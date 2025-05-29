'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Typography,
    Box,
    Paper,
    Alert,
    Tabs,
    Tab,
    Chip,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider
} from '@mui/material';

export default function ArmorTierListLayout({ armorsForTier, allAvailableTiers, currentTier }) {
    const router = useRouter();

    const handleTabChange = (event, newTierValue) => {
        if (newTierValue !== currentTier) { // Only navigate if tier actually changes
            router.push(`/armors/${newTierValue}`);
        }
    };

    const sortedArmors = armorsForTier
        ? [...armorsForTier].sort((a, b) => a.name.localeCompare(b.name))
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
                        aria-label="Daggerheart Armor Tiers"
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
                Tier {currentTier} Armors
            </Typography>

            {sortedArmors.length > 0 ? (
                <Paper elevation={2} sx={{p: {xs: 1, sm: 2}}}>
                    <List disablePadding>
                        {sortedArmors.map((armor, index) => (
                            <React.Fragment key={armor.name}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href={`/armors/${armor.tier}/${encodeURIComponent(armor.name)}`}
                                    >
                                        <ListItemText
                                            primary={armor.name}
                                            secondary={
                                                <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5, alignItems: 'center' }}>
                                                    <Chip label={`Score: ${armor.baseScore}`} size="small" variant="outlined" />
                                                    <Chip label={`Thresholds: ${armor.baseThresholds}`} size="small" variant="outlined" />
                                                </Box>
                                            }
                                            primaryTypographyProps={{ variant: 'h6', component: 'h3' }}
                                            secondaryTypographyProps={{ component: 'div' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < sortedArmors.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No armors found for Tier {currentTier}.
                </Alert>
            )}
        </>
    );
}