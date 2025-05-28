import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../components/SiteHeader'; // Adjust path as needed
import SiteFooter from '../../../components/SiteFooter'; // Adjust path as needed
import CommunityDetailLayout from '../../../components/CommunityDetailLayout'; // Import the new client component

// Fetch all communities
async function getAllCommunitiesForStaticGeneration() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/communities';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch communities for generateStaticParams: ${res.status} ${res.statusText} from ${apiUrl}.`);
            throw new Error(`Failed to fetch community list from ${apiUrl}. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for community list.`);
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching communities data:', error);
        throw new Error(`Critical error fetching community list: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let communities = [];
    try {
        communities = await getAllCommunitiesForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (communities): Failed to get list. No pages will be generated.", error);
        return [];
    }

    if (!communities || communities.length === 0) {
        console.warn("generateStaticParams (communities): No communities found. No static pages will be generated.");
        return [];
    }

    return communities.map((comm) => {
        if (!comm || typeof comm.name !== 'string' || comm.name.trim() === '') {
            console.warn("generateStaticParams (communities): Invalid community object found, skipping:", comm);
            return null;
        }
        return {
            community: encodeURIComponent(comm.name), // `community` matches folder name [community]
        };
    }).filter(Boolean);
}

export async function generateMetadata({ params }) {
    const decodedCommunityName = params.community ? decodeURIComponent(params.community) : "Community";
    return {
        title: `${decodedCommunityName} - Daggerheart Community | Ki Great Gaming`,
        description: `Explore the details of the ${decodedCommunityName} community in Daggerheart.`,
    };
}

// Page Server Component
export default async function CommunityDetailPage({ params }) {
    const { community: encodedCommunityNameParam } = params; // URL-encoded

    const allCommunities = await getAllCommunitiesForStaticGeneration();

    const communityData = allCommunities.find(c => encodeURIComponent(c.name) === encodedCommunityNameParam);

    if (!communityData) {
        const decodedParamForLog = decodeURIComponent(encodedCommunityNameParam);
        console.warn(`Community data not found for param: ${encodedCommunityNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <CommunityDetailLayout
                    allCommunities={allCommunities}
                    communityData={communityData}
                    currentEncodedCommunityName={encodedCommunityNameParam}
                />
            </Container>
            <SiteFooter />
        </>
    );
}