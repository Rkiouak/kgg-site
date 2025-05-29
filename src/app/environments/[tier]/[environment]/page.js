import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../../components/SiteHeader';         // Adjust path
import SiteFooter from '../../../../components/SiteFooter';         // Adjust path
import EnvironmentDetailLayout from '../../../../components/EnvironmentDetailLayout'; // Adjust path

// Fetch all environments (assuming a single endpoint)
async function getAllEnvironmentsForStaticGeneration() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/environments';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch environments for generateStaticParams: ${res.status} ${res.statusText} from ${apiUrl}.`);
            throw new Error(`Failed to fetch environment list from ${apiUrl}. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for environment list.`);
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching environments data:', error);
        throw new Error(`Critical error fetching environment list: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let environments = [];
    try {
        environments = await getAllEnvironmentsForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (environments): Failed to get list. No pages will be generated.", error.message);
        return [];
    }

    if (!environments || environments.length === 0) {
        console.warn("generateStaticParams (environments): No environments found. No static pages will be generated.");
        return [];
    }

    return environments.map((env) => {
        if (!env || typeof env.name !== 'string' || env.name.trim() === '' || env.tier === undefined) {
            console.warn("generateStaticParams (environments): Invalid environment object found, skipping:", env);
            return null;
        }
        return {
            tier: String(env.tier),
            environment: env.name,
        };
    }).filter(Boolean);
}

export async function generateMetadata(props) {
    const params = await props.params;
    const tier = params.tier;
    const decodedEnvironmentName = params.environment ? decodeURIComponent(params.environment) : "Environment";
    return {
        title: `${decodedEnvironmentName} (Tier ${tier}) - Daggerheart Environment | Ki Great Gaming`,
        description: `Details for the Tier ${tier} environment: ${decodedEnvironmentName} in Daggerheart.`,
    };
}

export default async function EnvironmentDetailPage(props) {
    const params = await props.params;
    const { tier, environment: encodedEnvironmentNameParam } = params;

    const allEnvironments = await getAllEnvironmentsForStaticGeneration();

    const environmentData = allEnvironments.find(
        env => String(env.tier) === tier && encodeURIComponent(env.name) === encodedEnvironmentNameParam
    );

    if (!environmentData) {
        const decodedParamForLog = decodeURIComponent(encodedEnvironmentNameParam);
        console.warn(`Environment data not found for Tier ${tier}, Name: ${encodedEnvironmentNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <EnvironmentDetailLayout
                    allEnvironments={allEnvironments}
                    environmentData={environmentData}
                    currentTier={tier}
                    currentEncodedEnvironmentName={encodedEnvironmentNameParam}
                />
            </Container>
            <SiteFooter />
        </>
    );
}