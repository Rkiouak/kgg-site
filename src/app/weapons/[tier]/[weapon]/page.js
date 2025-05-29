import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../../components/SiteHeader';         // Adjust path
import SiteFooter from '../../../../components/SiteFooter';         // Adjust path
import WeaponDetailLayout from '../../../../components/WeaponDetailLayout'; // Adjust path

// Function to fetch all weapons by iterating through tiers
async function getAllWeaponsForStaticGeneration() {
    const tiersToFetch = [1, 2, 3, 4]; // Assuming these are all relevant tiers
    let allWeaponsData = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/weapons';

    try {
        const fetchPromises = tiersToFetch.map(tier => {
            const apiUrl = `${baseUrl}/${tier}`; // GET /api/dh/weapons/{tier}
            return fetch(apiUrl, { cache: 'force-cache' })
                .then(async res => {
                    if (!res.ok) {
                        console.error(`BUILD ERROR: Failed to fetch weapons for tier ${tier}: ${res.status} ${res.statusText} from ${apiUrl}.`);
                        return [];
                    }
                    const data = await res.json();
                    if (!Array.isArray(data)) {
                        console.error(`API at ${apiUrl} did not return an array for tier ${tier} weapon list.`);
                        return [];
                    }
                    return data;
                })
                .catch(tierError => {
                    console.error(`BUILD EXCEPTION: Error fetching weapons for tier ${tier} from ${apiUrl}:`, tierError.message);
                    return [];
                });
        });

        const resultsByTier = await Promise.all(fetchPromises);
        allWeaponsData = resultsByTier.flat();

        if (allWeaponsData.length === 0) {
            console.warn("getAllWeaponsForStaticGeneration: No weapons fetched across all tiers.");
        }
        return allWeaponsData;
    } catch (error) {
        console.error('getAllWeaponsForStaticGeneration: CRITICAL ERROR:', error);
        throw new Error(`Critical error fetching all weapon lists: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let weapons = [];
    try {
        weapons = await getAllWeaponsForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams (weapons): Error fetching all weapons. No pages will be generated.", error.message);
        return [];
    }

    if (!weapons || weapons.length === 0) {
        console.warn("generateStaticParams (weapons): No weapons found. No static pages will be generated.");
        return [];
    }

    return weapons.map((wpn) => {
        if (!wpn || typeof wpn.name !== 'string' || wpn.name.trim() === '' || wpn.tier === undefined) {
            console.warn("generateStaticParams (weapons): Invalid weapon object found, skipping:", wpn);
            return null;
        }
        return {
            tier: String(wpn.tier),
            weapon: wpn.name, // 'weapon' matches folder name [weapon]
        };
    }).filter(Boolean);
}

export async function generateMetadata(props) {
    const params = await props.params;
    const tier = params.tier;
    const decodedWeaponName = params.weapon ? decodeURIComponent(params.weapon) : "Weapon";
    return {
        title: `${decodedWeaponName} (Tier ${tier}) - Daggerheart Weapon | Ki Great Gaming`,
        description: `Details for the Tier ${tier} weapon: ${decodedWeaponName} in Daggerheart.`,
    };
}

export default async function WeaponDetailPage(props) {
    const params = await props.params;
    const { tier, weapon: encodedWeaponNameParam } = params;

    const allWeapons = await getAllWeaponsForStaticGeneration();

    const weaponData = allWeapons.find(
        wpn => String(wpn.tier) === tier && encodeURIComponent(wpn.name) === encodedWeaponNameParam
    );

    if (!weaponData) {
        const decodedParamForLog = decodeURIComponent(encodedWeaponNameParam);
        console.warn(`Weapon data not found for Tier ${tier}, Name: ${encodedWeaponNameParam} (decoded: ${decodedParamForLog})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <WeaponDetailLayout
                    allWeapons={allWeapons}
                    weaponData={weaponData}
                    currentTier={tier}
                    currentEncodedWeaponName={encodedWeaponNameParam}
                />
            </Container>
            <SiteFooter />
        </>
    );
}