import React from 'react';
import { Container, Typography } from '@mui/material';
import SiteHeader from '../../components/SiteHeader';        // Adjust path
import SiteFooter from '../../components/SiteFooter';        // Adjust path
import EnvironmentTierTabLayout from '../../components/EnvironmentTierTabLayout'; // Adjust path

// Re-using the fetch function (ensure it's correctly defined or imported if made common)
async function getAllEnvironmentsForStaticGeneration() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/environments';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch environments: ${res.status} ${res.statusText} from ${apiUrl}.`);
            return []; // Return empty on error to prevent build crash
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            console.error(`API at ${apiUrl} did not return an array for environment list.`);
            return [];
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching environments data for landing page:', error);
        return [];
    }
}


export async function generateMetadata() {
    return {
        title: 'Environments - Daggerheart | Ki Great Gaming',
        description: 'Browse Daggerheart environments by tier.',
    };
}

export default async function EnvironmentsLandingPage() {
    const allEnvironments = await getAllEnvironmentsForStaticGeneration();

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Daggerheart Environments
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                    Explore various Daggerheart environments. Select a tier to see the list.
                </Typography>
                <EnvironmentTierTabLayout allEnvironments={allEnvironments} />
            </Container>
            <SiteFooter />
        </>
    );
}