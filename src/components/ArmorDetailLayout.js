'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
    CardContent,
    Grid
} from '@mui/material';

export default function ArmorDetailLayout({ allArmors, armorData, currentTier, currentEncodedArmorName }) {
    const router = useRouter();

    const [selectedFilterTier, setSelectedFilterTier] = useState(parseInt(currentTier, 10));

    useEffect(() => {
        setSelectedFilterTier(parseInt(currentTier, 10));
    }, [currentTier]);

    const handleTierTabChange = (event, newTier) => {
        setSelectedFilterTier(newTier);
        const firstArmorInNewTier = allArmors
            .filter(arm => arm.tier === newTier)
            .sort((a, b) => a.name.localeCompare(b.name))[0];

        if (firstArmorInNewTier) {
            router.push(`/armors/${newTier}/${encodeURIComponent(firstArmorInNewTier.name)}`);
        } else {
            // If no armors in new tier, current page might show "not found" or layout handles empty data
            // For now, we navigate and let the target page resolve.
            // Consider if a fallback to /armors/${newTier} is better if no specific armor.
            router.push(`/armors/${newTier}`); // Fallback to tier page if no specific armor found
        }
    };

    const handleArmorTabChange = (event, encodedArmorName) => {
        if (encodedArmorName) {
            router.push(`/armors/${selectedFilterTier}/${encodedArmorName}`);
        }
    };

    const uniqueTiers = useMemo(() => {
        if (!allArmors) return [];
        return [...new Set(allArmors.map(arm => arm.tier))].sort((a, b) => a - b);
    }, [allArmors]);

    const armorsForSelectedTier = useMemo(() => {
        if (!allArmors) return [];
        return allArmors
            .filter(arm => arm.tier === selectedFilterTier)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allArmors, selectedFilterTier]);

    const armorNameTabValue = (armorData && armorData.tier === selectedFilterTier)
        ? currentEncodedArmorName
        : false;

    const headerHeight = { xs: 56, sm: 64 };
    const tierTabsHeight = 48;
    const armorTabsTop = {
        xs: headerHeight.xs + tierTabsHeight,
        sm: headerHeight.sm + tierTabsHeight
    };

    if (!allArmors || allArmors.length === 0) {
        return <Alert severity="warning" sx={{m:2}}>No armor data available for navigation.</Alert>;
    }

    return (
        <>
            {/* Tier Selector Tabs */}
            {uniqueTiers.length > 0 && (
                <Paper elevation={1} sx={{ mb: 0.5, position: 'sticky', top: headerHeight, zIndex: 1101, bgcolor: 'background.paper' }}>
                    <Tabs
                        value={selectedFilterTier}
                        onChange={handleTierTabChange}
                        variant={uniqueTiers.length > 5 ? "scrollable" : "fullWidth"}
                        scrollButtons="auto"
                        aria-label="Filter by Armor Tier"
                        indicatorColor="primary"
                        textColor="primary"
                        centered={uniqueTiers.length <= 5}
                    >
                        {uniqueTiers.map(tier => (
                            <Tab key={`tier-select-${tier}`} label={`Tier ${tier}`} value={tier} />
                        ))}
                    </Tabs>
                </Paper>
            )}

            {/* Armor Name Tabs (filtered by selectedFilterTier) */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: armorTabsTop, zIndex: 1100, bgcolor: 'background.paper' }}>
                {armorsForSelectedTier.length > 0 ? (
                    <Tabs
                        value={armorNameTabValue}
                        onChange={handleArmorTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Armors by selected tier"
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        {armorsForSelectedTier.map((arm) => (
                            <Tab
                                key={arm.name}
                                label={arm.name}
                                value={encodeURIComponent(arm.name)}
                            />
                        ))}
                    </Tabs>
                ) : (
                    selectedFilterTier !== null && <Typography sx={{p:2, textAlign:'center', color: 'text.secondary'}}>No armors found for Tier {selectedFilterTier}.</Typography>
                )}
            </Paper>

            {/* Armor Details Content */}
            {armorData ? (
                <Paper component={Card} elevation={3} sx={{ p: { xs: 1, md: 2 } }}>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {armorData.name}
                        </Typography>
                        <Chip label={`Tier ${armorData.tier}`} variant="outlined" sx={{mb:2}} />
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}><Typography><strong>Base Thresholds:</strong> {armorData.baseThresholds || 'N/A'}</Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography><strong>Base Score:</strong> {armorData.baseScore ?? 'N/A'}</Typography></Grid>
                        </Grid>
                        {armorData.feature && (
                            <Box sx={{mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider'}}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Feature:</Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{armorData.feature}</Typography>
                            </Box>
                        )}
                        {!armorData.feature && (
                            <Typography variant="body2" sx={{mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', fontStyle:'italic', color: 'text.secondary'}} >
                                No special feature.
                            </Typography>
                        )}
                    </CardContent>
                </Paper>
            ) : (
                <Alert severity="warning" sx={{mt: 2}}>Armor details could not be loaded. Please select an armor from the tabs above.</Alert>
            )}
        </>
    );
}