import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../components/SiteHeader';         // Adjust path as needed
import SiteFooter from '../../../components/SiteFooter';         // Adjust path as needed
import ConsumableDetailLayout from '../../../components/ConsumableDetailLayout'; // Adjust path as needed

// Fetch all consumable items
async function getAllConsumablesForStaticGeneration() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/consumables';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch consumable items: ${res.status} ${res.statusText} from ${apiUrl}.`);
            throw new Error(`Failed to fetch consumable item list. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for consumable item list.`);
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching consumable items data:', error);
        throw new Error(`Critical error fetching consumable item list: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let consumableItems = [];
    try {
        consumableItems = await getAllConsumablesForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (consumables): Failed to get list. No pages will be generated.", error.message);
        return [];
    }

    if (!consumableItems || consumableItems.length === 0) {
        console.warn("generateStaticParams (consumables): No consumable items found. No static pages will be generated.");
        return [];
    }

    return consumableItems.map((item) => {
        if (!item || typeof item.name !== 'string' || item.name.trim() === '') {
            console.warn("generateStaticParams (consumables): Invalid consumable item object found, skipping:", item);
            return null;
        }
        return {
            consumable: item.name, // 'consumable' matches folder name [consumable]
        };
    }).filter(Boolean);
}

export async function generateMetadata({ params }) {
    const decodedConsumableName = params.consumable ? decodeURIComponent(params.consumable) : "Consumable Item";
    return {
        title: `${decodedConsumableName} - Daggerheart Consumable | Ki Great Gaming`,
        description: `Details for the Daggerheart consumable item: ${decodedConsumableName}.`,
    };
}

export default async function ConsumableDetailPage({ params }) {
    const { consumable: encodedConsumableNameParam } = params; // URL-encoded from path

    const allConsumables = await getAllConsumablesForStaticGeneration();

    const consumableData = allConsumables.find(
        item => encodeURIComponent(item.name) === encodedConsumableNameParam
    );

    if (!consumableData) {
        const decodedParamForLog = decodeURIComponent(encodedConsumableNameParam);
        console.warn(`Consumable item data not found for param: ${encodedConsumableNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <ConsumableDetailLayout
                    allConsumables={allConsumables}
                    consumableData={consumableData}
                    currentEncodedConsumableName={encodedConsumableNameParam}
                />
            </Container>
            <SiteFooter />
        </>
    );
}