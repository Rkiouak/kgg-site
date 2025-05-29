'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link
import {
    Typography,
    Box,
    Paper,
    Alert,
    Tabs,
    Tab,
    Chip,
    List, // Added List
    ListItem, // Added ListItem
    ListItemButton, // Added ListItemButton
    ListItemText, // Added ListItemText
    Divider // Added Divider
} from '@mui/material';

export default function WeaponTierDetailLayout({ weaponsForTier, allAvailableTiers, currentTier }) {
    const router = useRouter();

    const handleTabChange = (event, newTierValue) => {
        if (newTierValue) {
            router.push(`/weapons/${newTierValue}`);
        }
    };

    // Sort weapons by category, then by name
    const sortedWeapons = weaponsForTier
        ? [...weaponsForTier].sort((a, b) => {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            return a.name.localeCompare(b.name);
        })
        : [];

    return (
        <>
            {/* Tier Selector Tabs */}
            {allAvailableTiers && allAvailableTiers.length > 0 && (
                <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: { xs: 56, sm: 64 }, zIndex: 1100, bgcolor: 'background.paper' }}>
                    <Tabs
                        value={Number(currentTier)}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Daggerheart Weapon Tiers"
                        indicatorColor="primary"
                        textColor="primary"
                        centered={allAvailableTiers.length <= 4}
                    >
                        {allAvailableTiers.map((tier) => (
                            <Tab
                                key={`tier-tab-${tier}`}
                                label={`Tier ${tier}`}
                                value={tier}
                            />
                        ))}
                    </Tabs>
                </Paper>
            )}

            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Tier {currentTier} Weapons
            </Typography>

            {sortedWeapons.length > 0 ? (
                <Paper elevation={2} sx={{p: {xs: 1, sm: 2}}}> {/* Wrap list in Paper for better styling */}
                    <List disablePadding>
                        {sortedWeapons.map((weapon, index) => (
                            <React.Fragment key={weapon.name}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href={`/weapons/${weapon.tier}/${encodeURIComponent(weapon.name)}`}
                                    >
                                        <ListItemText
                                            primary={weapon.name}
                                            secondary={
                                                <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5, alignItems: 'center' }}>
                                                    <Chip label={weapon.category || 'N/A'} size="small" variant="outlined" />
                                                    <Chip label={weapon.weaponType || 'N/A'} size="small" variant="outlined" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Burden: {weapon.burden || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            }
                                            primaryTypographyProps={{ variant: 'h6', component: 'h3' }}
                                            secondaryTypographyProps={{ component: 'div' }} // Important for nesting Chip/Typography
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < sortedWeapons.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No weapons found for Tier {currentTier}, or data is currently unavailable.
                </Alert>
            )}
        </>
    );
}