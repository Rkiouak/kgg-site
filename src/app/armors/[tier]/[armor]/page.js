import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../../components/SiteHeader';         // Adjust path
import SiteFooter from '../../../../components/SiteFooter';         // Adjust path
import ArmorDetailLayout from '../../../../components/ArmorDetailLayout'; // Adjust path

// Function to fetch all armors by iterating through tiers
async function getAllArmorsForStaticGeneration() {
    const tiersToFetch = [1, 2, 3, 4]; // Assuming these are all relevant tiers
    let allArmorsData = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/armors';

    try {
        const fetchPromises = tiersToFetch.map(tier => {
            const apiUrl = `${baseUrl}/${tier}`; // GET /api/dh/armors/{tier}
            return fetch(apiUrl, { cache: 'force-cache' })
                .then(async res => {
                    if (!res.ok) {
                        console.error(`BUILD ERROR: Failed to fetch armors for tier ${tier}: ${res.status} ${res.statusText} from ${apiUrl}.`);
                        return [];
                    }
                    const data = await res.json();
                    if (!Array.isArray(data)) {
                        console.error(`API at ${apiUrl} did not return an array for tier ${tier} armor list.`);
                        return [];
                    }
                    return data;
                })
                .catch(tierError => {
                    console.error(`BUILD EXCEPTION: Error fetching armors for tier ${tier} from ${apiUrl}:`, tierError.message);
                    return [];
                });
        });

        const resultsByTier = await Promise.all(fetchPromises);
        allArmorsData = resultsByTier.flat();

        if (allArmorsData.length === 0) {
            console.warn("getAllArmorsForStaticGeneration: No armors fetched across all tiers.");
        }
        return allArmorsData;
    } catch (error) {
        console.error('getAllArmorsForStaticGeneration: CRITICAL ERROR:', error);
        throw new Error(`Critical error fetching all armor lists: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let armors = [];
    try {
        armors = await getAllArmorsForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (armors): Error fetching all armors. No pages will be generated.", error.message);
        return [];
    }

    if (!armors || armors.length === 0) {
        console.warn("generateStaticParams (armors): No armors found. No static pages will be generated.");
        return [];
    }

    return armors.map((arm) => {
        if (!arm || typeof arm.name !== 'string' || arm.name.trim() === '' || arm.tier === undefined) {
            console.warn("generateStaticParams (armors): Invalid armor object found, skipping:", arm);
            return null;
        }
        return {
            tier: String(arm.tier),
            armor: arm.name, // 'armor' matches folder name [armor]
        };
    }).filter(Boolean);
}

export async function generateMetadata(props) {
    const params = await props.params;
    const tier = params.tier;
    const decodedArmorName = params.armor ? decodeURIComponent(params.armor) : "Armor";
    return {
        title: `${decodedArmorName} (Tier ${tier}) - Daggerheart Armor | Ki Great Gaming`,
        description: `Details for the Tier ${tier} armor: ${decodedArmorName} in Daggerheart.`,
    };
}

export default async function ArmorDetailPage(props) {
    const params = await props.params;
    const { tier, armor: encodedArmorNameParam } = params;

    const allArmors = await getAllArmorsForStaticGeneration();

    const armorData = allArmors.find(
        arm => String(arm.tier) === tier && encodeURIComponent(arm.name) === encodedArmorNameParam
    );

    if (!armorData) {
        const decodedParamForLog = decodeURIComponent(encodedArmorNameParam);
        console.warn(`Armor data not found for Tier ${tier}, Name: ${encodedArmorNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <ArmorDetailLayout
                    allArmors={allArmors}
                    armorData={armorData}
                    currentTier={tier}
                    currentEncodedArmorName={encodedArmorNameParam}
                />
            </Container>
            <SiteFooter />
        </>
    );
}