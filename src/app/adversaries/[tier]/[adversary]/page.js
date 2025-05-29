import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../../components/SiteHeader'; // Adjust path
import SiteFooter from '../../../../components/SiteFooter'; // Adjust path
import AdversaryDetailLayout from '../../../../components/AdversaryDetailLayout'; // Adjust path

// Function to fetch adversaries by tier and combine (as defined previously)
async function getAllAdversariesForStaticGeneration() {
    const tiersToFetch = [1, 2, 3, 4];
    let allAdversariesData = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/adversaries';

    // console.log("Detail Page: Attempting to fetch adversaries...");

    try {
        const fetchPromises = tiersToFetch.map(tier => {
            const apiUrl = `${baseUrl}?tier=${tier}`;
            return fetch(apiUrl, { cache: 'force-cache' })
                .then(async res => {
                    if (!res.ok) {
                        console.error(`BUILD ERROR: Failed to fetch adversaries for tier ${tier}: ${res.status} ${res.statusText} from ${apiUrl}.`);
                        return [];
                    }
                    const data = await res.json();
                    if (!Array.isArray(data)) {
                        console.error(`API at ${apiUrl} did not return an array for tier ${tier}.`);
                        return [];
                    }
                    // console.log(`Detail Page: Successfully fetched ${data.length} adversaries for tier ${tier}.`);
                    return data;
                })
                .catch(tierError => {
                    console.error(`Detail Page EXCEPTION: Error fetching adversaries for tier ${tier} from ${apiUrl}:`, tierError.message);
                    return [];
                });
        });

        const resultsByTier = await Promise.all(fetchPromises);
        allAdversariesData = resultsByTier.flat();

        if (allAdversariesData.length === 0) {
            console.warn("Detail Page: No adversaries fetched across all tiers.");
        } else {
            // console.log(`Detail Page: Total adversaries fetched: ${allAdversariesData.length}`);
        }
        return allAdversariesData;

    } catch (error) {
        console.error('Detail Page CRITICAL ERROR in getAllAdversariesForStaticGeneration:', error);
        throw new Error(`Critical error fetching and processing all adversaries lists: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let adversaries = [];
    try {
        adversaries = await getAllAdversariesForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (adversaries): Top-level error getting list. No pages will be generated.", error.message);
        return [];
    }

    if (!adversaries || adversaries.length === 0) {
        console.warn("generateStaticParams (adversaries): No adversaries found from API. No static adversary pages will be generated.");
        return [];
    }

    return adversaries.map((adv) => {
        if (!adv || typeof adv.name !== 'string' || adv.name.trim() === '' || adv.tier === undefined) {
            console.warn("generateStaticParams (adversaries): Invalid adversary object found (missing name or tier), skipping:", adv);
            return null;
        }
        return {
            tier: String(adv.tier),
            adversary: encodeURIComponent(adv.name),
        };
    }).filter(Boolean);
}

export async function generateMetadata({ params }) {
    const tier = params.tier;
    const decodedAdversaryName = params.adversary ? decodeURIComponent(params.adversary) : "Adversary";
    return {
        title: `${decodedAdversaryName} (Tier ${tier}) - Daggerheart Adversary | Ki Great Gaming`,
        description: `Details for the Tier ${tier} adversary: ${decodedAdversaryName} in Daggerheart.`,
    };
}

// Page Server Component
export default async function AdversaryDetailPage({ params }) {
    const { tier, adversary: encodedAdversaryNameParam } = params;
    const adversaryNameParam = decodeURIComponent(encodedAdversaryNameParam);
    const allAdversaries = await getAllAdversariesForStaticGeneration();

    const adversaryData = allAdversaries.find(
        adv => String(adv.tier) === tier && encodeURIComponent(adv.name) === adversaryNameParam
    );

    if (!adversaryData) {
        const decodedParamForLog = decodeURIComponent(encodedAdversaryNameParam);
        console.warn(`Adversary data not found for Tier ${tier}, Name: ${encodedAdversaryNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <AdversaryDetailLayout
                    allAdversaries={allAdversaries}
                    adversaryData={adversaryData}
                    currentTier={tier} // Pass current tier from URL
                    currentEncodedAdversaryName={encodedAdversaryNameParam} // Pass current name from URL
                />
            </Container>
            <SiteFooter />
        </>
    );
}