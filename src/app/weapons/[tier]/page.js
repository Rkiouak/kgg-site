import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../components/SiteHeader';         // Adjust path
import SiteFooter from '../../../components/SiteFooter';         // Adjust path
import WeaponTierDetailLayout from '../../../components/WeaponTierDetailLayout'; // Adjust path

const ALL_AVAILABLE_TIERS = [1, 2, 3, 4]; // Define available tiers

// Fetch weapons for a specific tier
async function getWeaponsByTier(tier) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/dh/weapons/${tier}`;
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`Failed to fetch weapons for tier ${tier}: ${res.status} ${res.statusText} from ${apiUrl}.`);
            if (res.status === 404) return []; // No weapons for this tier
            throw new Error(`Failed to fetch weapons for tier ${tier}. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for weapon list.`);
        }
        return data;
    } catch (error) {
        console.error(`Error fetching weapons for tier ${tier}:`, error);
        return []; // Return empty on error to allow page to render with "no weapons" message
    }
}

export async function generateStaticParams() {
    // Generate params for known tiers
    return ALL_AVAILABLE_TIERS.map((tier) => ({
        tier: String(tier),
    }));
}

export async function generateMetadata(props) {
    const params = await props.params;
    const tier = params.tier;
    return {
        title: `Tier ${tier} Weapons - Daggerheart | Ki Great Gaming`,
        description: `Browse Tier ${tier} weapons in Daggerheart.`,
    };
}

export default async function WeaponTierDetailPage(props) {
    const params = await props.params;
    const tierParam = params.tier;
    const tier = parseInt(tierParam, 10);

    if (isNaN(tier) || !ALL_AVAILABLE_TIERS.includes(tier)) {
        console.warn(`Invalid tier requested: ${tierParam}`);
        notFound();
    }

    const weaponsForTier = await getWeaponsByTier(tier);

    // if (weaponsForTier.length === 0) {
    //     // Optionally, if a tier having zero weapons should be a 404.
    //     // console.warn(`No weapons found for Tier ${tier}.`);
    //     // notFound();
    // }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <WeaponTierDetailLayout
                    weaponsForTier={weaponsForTier}
                    allAvailableTiers={ALL_AVAILABLE_TIERS}
                    currentTier={tier}
                />
            </Container>
            <SiteFooter />
        </>
    );
}