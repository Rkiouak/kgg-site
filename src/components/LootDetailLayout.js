'use client';

import React, { useMemo } from 'react'; // Removed unnecessary useState and useEffect for this fix
import { useRouter } from 'next/navigation';
import {
    Typography,
    Box,
    Paper,
    Divider,
    Alert,
    Tabs,
    Tab,
    Chip,
    Card,
    CardContent
} from '@mui/material';

export default function LootDetailLayout({ allLootItems, lootData, currentEncodedLootName }) {
    // --- HOOKS MOVED TO TOP ---
    const router = useRouter();

    // Sort allLootItems by the 'roll' property for tab order
    // This useMemo is now at the top level
    const sortedLootForTabs = useMemo(() => {
        if (!allLootItems || allLootItems.length === 0) return []; // Handle empty/undefined allLootItems
        return [...allLootItems].sort((a, b) => {
            const rollA = parseInt(a.roll, 10);
            const rollB = parseInt(b.roll, 10);
            if (isNaN(rollA) || isNaN(rollB)) {
                return (a.roll || "").localeCompare(b.roll || "");
            }
            return rollA - rollB;
        });
    }, [allLootItems]);
    // --- END HOOKS MOVED TO TOP ---

    const handleTabChange = (event, newValue) => {
        if (newValue) {
            router.push(`/loot/${newValue}`);
        }
    };

    // Conditional returns are now AFTER all hook calls
    if (!allLootItems || allLootItems.length === 0) {
        return <Alert severity="warning" sx={{ m: 2 }}>No loot items available for navigation.</Alert>;
    }

    if (!lootData) {
        // Similar to ConsumableDetailLayout, ideally handled by page.js notFound
        return <Alert severity="error" sx={{ m: 2 }}>Selected loot item data could not be loaded or is not available.</Alert>;
    }

    return (
        <>
            {/* Loot Item Selector Tabs */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: { xs: 56, sm: 64 }, zIndex: 1100, bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentEncodedLootName}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="Daggerheart Loot Items"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {sortedLootForTabs.map((item) => ( // Uses the memoized sorted list
                        <Tab
                            key={item.name}
                            label={`${item.roll}. ${item.name}`}
                            value={encodeURIComponent(item.name)}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Loot Item Details Content */}
            <Paper component={Card} elevation={3} sx={{ p: { xs: 1, md: 2 } }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {lootData.name}
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2}}>
                        <Chip label={`Roll: ${lootData.roll}`} variant="outlined" />
                        <Chip label={`Type: ${lootData.type}`} color="secondary" size="small"/>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', mb: 1 }}>Description:</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {lootData.description}
                    </Typography>
                </CardContent>
            </Paper>
        </>
    );
}