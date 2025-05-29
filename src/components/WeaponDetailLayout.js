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

export default function WeaponDetailLayout({ allWeapons, weaponData, currentTier, currentEncodedWeaponName }) {
    const router = useRouter();

    const [selectedFilterTier, setSelectedFilterTier] = useState(parseInt(currentTier, 10));

    useEffect(() => {
        setSelectedFilterTier(parseInt(currentTier, 10));
    }, [currentTier]);

    const handleTierTabChange = (event, newTier) => {
        setSelectedFilterTier(newTier);
        // Navigate to the first weapon in the new tier
        const firstWeaponInNewTier = allWeapons
            .filter(wpn => wpn.tier === newTier)
            .sort((a, b) => a.name.localeCompare(b.name))[0];

        if (firstWeaponInNewTier) {
            router.push(`/weapons/${newTier}/${encodeURIComponent(firstWeaponInNewTier.name)}`);
        } else {
            // If no weapons in selected tier, could show a message or clear content.
            // For now, the page for the first weapon (or lack thereof) will handle it.
            // Pushing to a generic tier page if that was available could also be an option:
            // router.push(`/weapons/${newTier}`);
        }
    };

    const handleWeaponTabChange = (event, encodedWeaponName) => {
        if (encodedWeaponName) {
            router.push(`/weapons/${selectedFilterTier}/${encodedWeaponName}`);
        }
    };

    const uniqueTiers = useMemo(() => {
        if (!allWeapons) return [];
        return [...new Set(allWeapons.map(wpn => wpn.tier))].sort((a, b) => a - b);
    }, [allWeapons]);

    const weaponsForSelectedTier = useMemo(() => {
        if (!allWeapons) return [];
        return allWeapons
            .filter(wpn => wpn.tier === selectedFilterTier)
            .sort((a, b) => { // Sort by category then name
                if (a.category < b.category) return -1;
                if (a.category > b.category) return 1;
                return a.name.localeCompare(b.name);
            });
    }, [allWeapons, selectedFilterTier]);

    const weaponNameTabValue = (weaponData && weaponData.tier === selectedFilterTier)
        ? currentEncodedWeaponName
        : false;

    const headerHeight = { xs: 56, sm: 64 };
    const tierTabsHeight = 48;
    const weaponTabsTop = {
        xs: headerHeight.xs + tierTabsHeight,
        sm: headerHeight.sm + tierTabsHeight
    };

    if (!allWeapons || allWeapons.length === 0) {
        return <Alert severity="warning" sx={{m:2}}>No weapon data available for navigation.</Alert>;
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
                        aria-label="Filter by Weapon Tier"
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

            {/* Weapon Name Tabs (filtered by selectedFilterTier) */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: weaponTabsTop, zIndex: 1100, bgcolor: 'background.paper' }}>
                {weaponsForSelectedTier.length > 0 ? (
                    <Tabs
                        value={weaponNameTabValue}
                        onChange={handleWeaponTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Weapons by selected tier"
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        {weaponsForSelectedTier.map((wpn) => (
                            <Tab
                                key={wpn.name}
                                label={wpn.name}
                                value={encodeURIComponent(wpn.name)}
                            />
                        ))}
                    </Tabs>
                ) : (
                    selectedFilterTier && <Typography sx={{p:2, textAlign:'center', color: 'text.secondary'}}>No weapons found for Tier {selectedFilterTier}.</Typography>
                )}
            </Paper>

            {/* Weapon Details Content */}
            {weaponData ? (
                <Paper component={Card} elevation={3} sx={{ p: { xs: 2, md: 3 } }}> {/* Using Card styles for consistency */}
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {weaponData.name}
                        </Typography>
                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip label={`Tier ${weaponData.tier}`} variant="outlined" />
                            <Chip label={weaponData.category || 'N/A'} color="primary" />
                            <Chip label={weaponData.weaponType || 'N/A'} color="secondary" />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}><Typography><strong>Trait:</strong> {weaponData.trait || 'N/A'}</Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography><strong>Range:</strong> {weaponData.range || 'N/A'}</Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography><strong>Damage:</strong> {weaponData.damage || 'N/A'}</Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography><strong>Burden:</strong> {weaponData.burden || 'N/A'}</Typography></Grid>
                        </Grid>
                        {weaponData.feature && (
                            <Box sx={{mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider'}}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Feature:</Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{weaponData.feature}</Typography>
                            </Box>
                        )}
                    </CardContent>
                </Paper>
            ) : (
                <Alert severity="warning" sx={{mt: 2}}>Weapon details could not be loaded. Please select a weapon from the tabs above.</Alert>
            )}
        </>
    );
}