import React from 'react';
import { Container, Typography } from '@mui/material';
import SiteHeader from '../../components/SiteHeader'; // Adjust path
import SiteFooter from '../../components/SiteFooter'; // Adjust path
import AdversaryTierTabLayout from '../../components/AdversaryTierTabLayout'; // Adjust path

// Function to fetch adversaries by tier and combine (as defined previously)
async function getAllAdversariesForStaticGeneration() {
    const tiersToFetch = [1, 2, 3, 4];
    let allAdversariesData = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/adversaries';

    // console.log("Landing Page: Attempting to fetch adversaries...");

    try {
        const fetchPromises = tiersToFetch.map(tier => {
            const apiUrl = `${baseUrl}?tier=${tier}`;
            return fetch(apiUrl, { cache: 'force-cache' }) // Using force-cache for SSG
                .then(async res => {
                    if (!res.ok) {
                        console.error(`Failed to fetch adversaries for tier ${tier} from ${apiUrl}: ${res.status} ${res.statusText}.`);
                        return [];
                    }
                    const data = await res.json();
                    if (!Array.isArray(data)) {
                        console.error(`API at ${apiUrl} did not return an array for tier ${tier}.`);
                        return [];
                    }
                    // console.log(`Landing Page: Successfully fetched ${data.length} adversaries for tier ${tier}.`);
                    return data;
                })
                .catch(tierError => {
                    console.error(`Landing Page EXCEPTION: Error fetching adversaries for tier ${tier} from ${apiUrl}:`, tierError.message);
                    return [];
                });
        });

        const resultsByTier = await Promise.all(fetchPromises);
        allAdversariesData = resultsByTier.flat();

        if (allAdversariesData.length === 0) {
            console.warn("Landing Page: No adversaries fetched across all tiers.");
        } else {
            // console.log(`Landing Page: Total adversaries fetched: ${allAdversariesData.length}`);
        }
        return allAdversariesData;

    } catch (error) {
        console.error('Landing Page CRITICAL ERROR in getAllAdversariesForStaticGeneration:', error);
        // Return empty array if critical error, page will show "No adversaries data available."
        return [];
    }
}

export async function generateMetadata() {
    return {
        title: 'Adversaries - Daggerheart | Ki Great Gaming',
        description: 'Browse Daggerheart adversaries by tier.',
    };
}

export default async function AdversariesLandingPage() {
    const allAdversaries = await getAllAdversariesForStaticGeneration();

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Daggerheart Adversaries
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                    Browse adversaries by their challenge tier. Select a tier to see the list of available adversaries.
                </Typography>
                <AdversaryTierTabLayout allAdversaries={allAdversaries} />
            </Container>
            <SiteFooter />
        </>
    );
}