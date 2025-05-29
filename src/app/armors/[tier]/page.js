import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../components/SiteHeader';         // Adjust path
import SiteFooter from '../../../components/SiteFooter';         // Adjust path
import ArmorTierListLayout from '../../../components/ArmorTierListLayout'; // Adjust path

const ALL_AVAILABLE_TIERS = [1, 2, 3, 4];

async function getArmorsByTier(tier) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/dh/armors/${tier}`;
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`Failed to fetch armors for tier ${tier}: ${res.status} ${res.statusText} from ${apiUrl}.`);
            if (res.status === 404) return [];
            throw new Error(`Failed to fetch armors for tier ${tier}. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for armor list.`);
        }
        return data;
    } catch (error) {
        console.error(`Error fetching armors for tier ${tier}:`, error);
        return [];
    }
}

export async function generateStaticParams() {
    return ALL_AVAILABLE_TIERS.map((tier) => ({
        tier: String(tier),
    }));
}

export async function generateMetadata(props) {
    const params = await props.params;
    const tier = params.tier;
    return {
        title: `Tier ${tier} Armors - Daggerheart | Ki Great Gaming`,
        description: `Browse Tier ${tier} armors in Daggerheart.`,
    };
}

export default async function ArmorTierPage(props) {
    const params = await props.params;
    const tierParam = params.tier;
    const tier = parseInt(tierParam, 10);

    if (isNaN(tier) || !ALL_AVAILABLE_TIERS.includes(tier)) {
        notFound();
    }

    const armorsForTier = await getArmorsByTier(tier);

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <ArmorTierListLayout
                    armorsForTier={armorsForTier}
                    allAvailableTiers={ALL_AVAILABLE_TIERS}
                    currentTier={tier}
                />
            </Container>
            <SiteFooter />
        </>
    );
}