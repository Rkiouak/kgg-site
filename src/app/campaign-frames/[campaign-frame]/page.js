import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../components/SiteHeader';         // Adjust path
import SiteFooter from '../../../components/SiteFooter';         // Adjust path
import CampaignFrameDetailLayout from '../../../components/CampaignFrameDetailLayout'; // Adjust path

// Fetch all campaign frames
async function getAllCampaignFramesForStaticGeneration() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/campaign-frames';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch campaign frames: ${res.status} ${res.statusText} from ${apiUrl}.`);
            throw new Error(`Failed to fetch campaign frame list. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for campaign frame list.`);
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching campaign frames data:', error);
        throw new Error(`Critical error fetching campaign frame list: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let campaignFrames = [];
    try {
        campaignFrames = await getAllCampaignFramesForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (campaign-frames): Failed to get list. No pages will be generated.", error.message);
        return [];
    }

    if (!campaignFrames || campaignFrames.length === 0) {
        console.warn("generateStaticParams (campaign-frames): No campaign frames found. No static pages will be generated.");
        return [];
    }

    return campaignFrames.map((cf) => {
        if (!cf || typeof cf.name !== 'string' || cf.name.trim() === '') {
            console.warn("generateStaticParams (campaign-frames): Invalid campaign frame object found, skipping:", cf);
            return null;
        }
        return {
            "campaign-frame": cf.name,
        };
    }).filter(Boolean);
}

export async function generateMetadata(props) {
    const params = await props.params;
    // Param key matches the folder name: [campaign-frame]
    const encodedName = params["campaign-frame"];
    const decodedCampaignFrameName = encodedName ? decodeURIComponent(encodedName) : "Campaign Frame";
    return {
        title: `${decodedCampaignFrameName} - Daggerheart Campaign Frame | Ki Great Gaming`,
        description: `Explore the details of the ${decodedCampaignFrameName} campaign frame in Daggerheart.`,
    };
}

export default async function CampaignFrameDetailPage(props) {
    const params = await props.params;
    // Param key matches the folder name: [campaign-frame]
    const encodedCampaignFrameNameParam = params["campaign-frame"];

    const allCampaignFrames = await getAllCampaignFramesForStaticGeneration();

    const campaignFrameData = allCampaignFrames.find(
        cf => encodeURIComponent(cf.name) === encodedCampaignFrameNameParam
    );

    if (!campaignFrameData) {
        const decodedParamForLog = decodeURIComponent(encodedCampaignFrameNameParam);
        console.warn(`Campaign Frame data not found for param: ${encodedCampaignFrameNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <CampaignFrameDetailLayout
                    allCampaignFrames={allCampaignFrames}
                    campaignFrameData={campaignFrameData}
                    currentEncodedCampaignFrameName={encodedCampaignFrameNameParam}
                />
            </Container>
            <SiteFooter />
        </>
    );
}