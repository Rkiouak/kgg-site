'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Box,
    Paper,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Chip,
    Divider
} from '@mui/material';

export default function AdversaryTierTabLayout({ allAdversaries }) {
    const [selectedTier, setSelectedTier] = useState(1); // Default to Tier 1

    const handleTierChange = (event, newValue) => {
        setSelectedTier(newValue);
    };

    const filteredAdversaries = useMemo(() => {
        if (!allAdversaries) return [];
        return allAdversaries
            .filter(adv => adv.tier === selectedTier)
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name within the tier
    }, [allAdversaries, selectedTier]);

    const tiers = useMemo(() => {
        if (!allAdversaries) return [];
        // Get unique tiers and sort them
        return [...new Set(allAdversaries.map(adv => adv.tier))].sort((a, b) => a - b);
    }, [allAdversaries]);

    if (!allAdversaries || allAdversaries.length === 0) {
        return <Typography sx={{ p: 2, textAlign: 'center' }}>No adversaries data available.</Typography>;
    }

    if (tiers.length === 0) {
        return <Typography sx={{ p: 2, textAlign: 'center' }}>No tiers found in adversary data.</Typography>;
    }

    return (
        <Paper elevation={2} sx={{ mt: 2 }}>
            <Tabs
                value={selectedTier}
                onChange={handleTierChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Adversary Tiers"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                {tiers.map(tier => (
                    <Tab key={`tier-${tier}`} label={`Tier ${tier}`} value={tier} />
                ))}
            </Tabs>

            <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {filteredAdversaries.length > 0 ? (
                    <List disablePadding>
                        {filteredAdversaries.map((adv, index) => (
                            <React.Fragment key={adv.name}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href={`/adversaries/${adv.tier}/${encodeURIComponent(adv.name)}`}
                                    >
                                        <ListItemText
                                            primary={adv.name}
                                            secondary={
                                                <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                                                    <Chip label={adv.adversaryType || 'N/A'} size="small" sx={{ mr: 1 }} />
                                                    <Typography variant="caption" color="text.secondary" component="span">
                                                        {adv.description ? (adv.description.length > 100 ? adv.description.substring(0, 100) + "..." : adv.description) : "No description."}
                                                    </Typography>
                                                </Box>
                                            }
                                            primaryTypographyProps={{ variant: 'h6' }}
                                            secondaryTypographyProps={{ component: 'div' }} // <--- FIX APPLIED HERE
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < filteredAdversaries.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                        No adversaries found for Tier {selectedTier}.
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}