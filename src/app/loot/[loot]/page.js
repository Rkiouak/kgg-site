import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../components/SiteHeader';         // Adjust path as needed
import SiteFooter from '../../../components/SiteFooter';         // Adjust path
import LootDetailLayout from '../../../components/LootDetailLayout'; // Adjust path as needed

// Fetch all loot items
async function getAllLootItemsForStaticGeneration() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/loot';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch loot items: ${res.status} ${res.statusText} from ${apiUrl}.`);
            throw new Error(`Failed to fetch loot item list. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for loot item list.`);
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching loot items data:', error);
        throw new Error(`Critical error fetching loot item list: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let lootItems = [];
    try {
        lootItems = await getAllLootItemsForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (loot): Failed to get list. No pages will be generated.", error.message);
        return [];
    }

    if (!lootItems || lootItems.length === 0) {
        console.warn("generateStaticParams (loot): No loot items found. No static pages will be generated.");
        return [];
    }

    return lootItems.map((item) => {
        if (!item || typeof item.name !== 'string' || item.name.trim() === '') {
            console.warn("generateStaticParams (loot): Invalid loot item object found, skipping:", item);
            return null;
        }
        return {
            loot: item.name, // 'loot' matches folder name [loot]
        };
    }).filter(Boolean);
}

export async function generateMetadata({ params }) {
    const decodedLootName = params.loot ? decodeURIComponent(params.loot) : "Loot Item";
    return {
        title: `${decodedLootName} - Daggerheart Loot | Ki Great Gaming`,
        description: `Details for the Daggerheart loot item: ${decodedLootName}.`,
    };
}

export default async function LootDetailPage({ params }) {
    const { loot: encodedLootNameParam } = params; // URL-encoded from path

    const allLootItems = await getAllLootItemsForStaticGeneration();

    const lootData = allLootItems.find(
        item => encodeURIComponent(item.name) === encodedLootNameParam
    );

    if (!lootData) {
        const decodedParamForLog = decodeURIComponent(encodedLootNameParam);
        console.warn(`Loot item data not found for param: ${encodedLootNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <LootDetailLayout
                    allLootItems={allLootItems}
                    lootData={lootData}
                    currentEncodedLootName={encodedLootNameParam}
                />
            </Container>
            <SiteFooter />
        </>
    );
}