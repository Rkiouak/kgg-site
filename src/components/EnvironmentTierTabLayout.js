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

export default function EnvironmentTierTabLayout({ allEnvironments }) {
    const [selectedTier, setSelectedTier] = useState(1); // Default to Tier 1

    const handleTierChange = (event, newValue) => {
        setSelectedTier(newValue);
    };

    const filteredEnvironments = useMemo(() => {
        if (!allEnvironments) return [];
        return allEnvironments
            .filter(env => env.tier === selectedTier)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allEnvironments, selectedTier]);

    const tiers = useMemo(() => {
        if (!allEnvironments) return [];
        const uniqueTiers = [...new Set(allEnvironments.map(env => env.tier))].sort((a, b) => a - b);
        // Ensure selectedTier is valid, otherwise default to the first available tier
        if (uniqueTiers.length > 0 && !uniqueTiers.includes(selectedTier)) {
            setSelectedTier(uniqueTiers[0]);
        }
        return uniqueTiers;
    }, [allEnvironments, selectedTier]); // Added selectedTier to re-evaluate if it becomes invalid

    if (!allEnvironments || allEnvironments.length === 0) {
        return <Typography sx={{ p: 2, textAlign: 'center' }}>No environment data available.</Typography>;
    }

    if (tiers.length === 0) { // Should not happen if allEnvironments has items with tiers
        return <Typography sx={{ p: 2, textAlign: 'center' }}>No tiers found in environment data.</Typography>;
    }

    return (
        <Paper elevation={2} sx={{ mt: 2 }}>
            <Tabs
                value={tiers.includes(selectedTier) ? selectedTier : (tiers[0] || false)} // Ensure value is valid
                onChange={handleTierChange}
                indicatorColor="primary" // Using primary for the main landing page tabs
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Environment Tiers"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                {tiers.map(tier => (
                    <Tab key={`tier-landing-${tier}`} label={`Tier ${tier}`} value={tier} />
                ))}
            </Tabs>

            <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {filteredEnvironments.length > 0 ? (
                    <List disablePadding>
                        {filteredEnvironments.map((env, index) => (
                            <React.Fragment key={env.name}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href={`/environments/${env.tier}/${encodeURIComponent(env.name)}`}
                                    >
                                        <ListItemText
                                            primary={env.name}
                                            secondary={
                                                <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                                                    <Chip label={env.environmentType || 'N/A'} size="small" sx={{ mr: 1 }} variant="outlined" />
                                                    <Typography variant="caption" color="text.secondary" component="span">
                                                        {env.description ? (env.description.length > 120 ? env.description.substring(0, 120) + "..." : env.description) : "No description."}
                                                    </Typography>
                                                </Box>
                                            }
                                            primaryTypographyProps={{ variant: 'h6' }}
                                            secondaryTypographyProps={{ component: 'div' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < filteredEnvironments.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                        No environments found for Tier {selectedTier}.
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}