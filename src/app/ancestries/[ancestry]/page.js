import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import AncestryDetailLayout from '../../../components/AncestryDetailLayout'; // Import the new client component

// Fetch all ancestries (this will be cached by Next.js during build for SSG)
async function getAllAncestriesForStaticGeneration() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/ancestries';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch ancestries for generateStaticParams: ${res.status} ${res.statusText} from ${apiUrl}. Ensure API is available during build.`);
            throw new Error(`Failed to fetch ancestry list for static generation from ${apiUrl}. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for ancestry list.`);
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching ancestries data for generateStaticParams:', error);
        // Return empty array on critical error to allow build to proceed with no pages, or rethrow to fail build.
        // For now, let's rethrow to make build failures explicit if data is missing.
        throw new Error(`Critical error fetching ancestry list: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let ancestries = [];
    try {
        ancestries = await getAllAncestriesForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (ancestries): Failed to get ancestry list, build will likely fail or generate no ancestry pages.", error);
        return []; // Prevent build crash, generate no pages if fetch fails
    }

    if (!ancestries || ancestries.length === 0) {
        console.warn("generateStaticParams (ancestries): No ancestries found from API. No static ancestry pages will be generated.");
        return [];
    }

    return ancestries.map((anc) => {
        if (!anc || typeof anc.name !== 'string' || anc.name.trim() === '') {
            console.warn("generateStaticParams (ancestries): Found an ancestry object without a valid 'name' property, skipping:", anc);
            return null;
        }
        return {
            ancestry: anc.name, // `ancestry` here matches the folder name [ancestry]
        };
    }).filter(Boolean);
}

export async function generateMetadata(props) {
    const params = await props.params;
    // params.ancestry is URL-encoded. Decode it for display purposes.
    const decodedAncestryName = params.ancestry ? decodeURIComponent(params.ancestry) : "Ancestry";
    return {
        title: `${decodedAncestryName} - Daggerheart Ancestry | Ki Great Gaming`,
        description: `Explore the details of the ${decodedAncestryName} ancestry in Daggerheart.`,
    };
}

// This default export is the Server Component for the page
export default async function AncestryDetailPage(props) {
    const params = await props.params;
    // params.ancestry comes from the URL and is URL-encoded (e.g., "Mixed%20Ancestry")
    const { ancestry: encodedAncestryNameParam } = params;
    const ancestryNameParam = decodeURIComponent(encodedAncestryNameParam);
    const allAncestries = await getAllAncestriesForStaticGeneration();

    // Find the specific ancestry data. Match against the encoded name.
    const ancestryData = allAncestries.find(a => a.name === ancestryNameParam);

    if (!ancestryData) {
        const decodedParamForLog = decodeURIComponent(encodedAncestryNameParam);
        console.warn(`Ancestry data not found for param: ${encodedAncestryNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <AncestryDetailLayout
                    allAncestries={allAncestries}
                    ancestryData={ancestryData}
                    currentEncodedAncestryName={encodedAncestryNameParam} // Pass the encoded name from params
                />
            </Container>
            <SiteFooter />
        </>
    );
}
