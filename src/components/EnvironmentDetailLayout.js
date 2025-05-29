'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import NextLink
import {
    Typography,
    Box,
    Paper,
    Divider,
    Alert,
    Tabs,
    Tab,
    Chip,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemButton // Added for clickable list items
} from '@mui/material';

// Helper for lists of strings (e.g., impulses) - can remain as is if used elsewhere for non-links
const StringListDisplay = ({ items, title, useChips = false }) => {
    if (!items || items.length === 0) {
        return null;
    }
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', mb: 0.5 }}>{title}</Typography>
            {useChips ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {items.map((item) => <Chip key={item} label={item} size="small" />)}
                </Box>
            ) : (
                <List dense disablePadding>
                    {items.map((item) => <ListItem key={item} sx={{pl:1}}><ListItemText primaryTypographyProps={{variant:'body2'}} primary={item} /></ListItem>)}
                </List>
            )}
        </Box>
    );
};

// Helper for Environment Features (remains the same as previous version)
const EnvironmentFeaturesDisplay = ({ features }) => {
    if (!features || Object.keys(features).length === 0) {
        return null;
    }
    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Environment Features</Typography>
            {Object.values(features).map((feature) => (
                <Paper key={feature.name} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium' }}>{feature.name}</Typography>
                    <Chip label={feature.featureType || 'Feature'} size="small" color="info" sx={{ my: 0.5 }} />
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', my: 1 }}>{feature.description}</Typography>
                    {feature.informationPoints && feature.informationPoints.length > 0 && (
                        <Box sx={{mt:1, mb:1, pl:2}}>
                            <Typography variant="caption" display="block" color="text.secondary">Information Points:</Typography>
                            <List dense disablePadding>
                                {feature.informationPoints.map((point, idx) => <ListItem key={idx} sx={{py:0}}><ListItemText primaryTypographyProps={{variant:'caption'}} primary={`• ${point}`} /></ListItem>)}
                            </List>
                        </Box>
                    )}
                    {feature.featureQuestions && feature.featureQuestions.length > 0 && (
                        <Box sx={{mt:1, pl:2}}>
                            <Typography variant="caption" display="block" color="text.secondary">Feature Questions:</Typography>
                            <List dense disablePadding>
                                {feature.featureQuestions.map((question, idx) => <ListItem key={idx} sx={{py:0}}><ListItemText primaryTypographyProps={{variant:'caption', fontStyle:'italic'}} primary={`• ${question}`} /></ListItem>)}
                            </List>
                        </Box>
                    )}
                </Paper>
            ))}
        </Box>
    );
};


export default function EnvironmentDetailLayout({ allEnvironments, environmentData, currentTier, currentEncodedEnvironmentName }) {
    const router = useRouter();
    const [selectedFilterTier, setSelectedFilterTier] = useState(parseInt(currentTier, 10));

    useEffect(() => {
        setSelectedFilterTier(parseInt(currentTier, 10));
    }, [currentTier]);

    const handleTierTabChange = (event, newTier) => {
        setSelectedFilterTier(newTier);
        const firstEnvInNewTier = allEnvironments
            .filter(env => env.tier === newTier)
            .sort((a, b) => a.name.localeCompare(b.name))[0];
        if (firstEnvInNewTier) {
            router.push(`/environments/${newTier}/${encodeURIComponent(firstEnvInNewTier.name)}`);
        }
    };

    const handleEnvironmentTabChange = (event, encodedEnvironmentName) => {
        if (encodedEnvironmentName) {
            router.push(`/environments/${selectedFilterTier}/${encodedEnvironmentName}`);
        }
    };

    const uniqueTiers = useMemo(() => {
        if (!allEnvironments) return [];
        return [...new Set(allEnvironments.map(env => env.tier))].sort((a, b) => a - b);
    }, [allEnvironments]);

    const environmentsForSelectedTier = useMemo(() => {
        if (!allEnvironments) return [];
        return allEnvironments
            .filter(env => env.tier === selectedFilterTier)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allEnvironments, selectedFilterTier]);

    const environmentNameTabValue = (environmentData && environmentData.tier === selectedFilterTier)
        ? currentEncodedEnvironmentName
        : false;

    const headerHeight = { xs: 56, sm: 64 };
    const tierTabsHeight = 48;
    const environmentTabsTop = {
        xs: headerHeight.xs + tierTabsHeight,
        sm: headerHeight.sm + tierTabsHeight
    };

    if (!allEnvironments || allEnvironments.length === 0) {
        return <Alert severity="warning" sx={{ m: 2 }}>No environments data loaded.</Alert>;
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
                        aria-label="Filter by Environment Tier"
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

            {/* Environment Name Tabs (filtered by selectedFilterTier) */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: environmentTabsTop, zIndex: 1100, bgcolor: 'background.paper' }}>
                {environmentsForSelectedTier.length > 0 ? (
                    <Tabs
                        value={environmentNameTabValue}
                        onChange={handleEnvironmentTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Environments by selected tier"
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        {environmentsForSelectedTier.map((env) => (
                            <Tab
                                key={env.name}
                                label={env.name}
                                value={encodeURIComponent(env.name)}
                            />
                        ))}
                    </Tabs>
                ) : (
                    selectedFilterTier && <Typography sx={{p:2, textAlign:'center', color: 'text.secondary'}}>No environments found for Tier {selectedFilterTier}.</Typography>
                )}
            </Paper>

            {/* Environment Details Content */}
            {environmentData ? (
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        {environmentData.name}
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                        Tier {environmentData.tier} - {environmentData.environmentType}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                        {environmentData.description}
                    </Typography>
                    <Divider sx={{ my: 2 }}/>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <StringListDisplay items={environmentData.impulses} title="Impulses" useChips />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', mb: 0.5 }}>Difficulty</Typography>
                            <Typography variant="body2">{environmentData.difficulty ?? 'N/A'}</Typography>
                        </Grid>
                    </Grid>

                    {environmentData.potentialAdversaries && environmentData.potentialAdversaries.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', mb: 1 }}>Potential Adversaries</Typography>
                            <List dense disablePadding>
                                {environmentData.potentialAdversaries.map((advName) => (
                                    <ListItem key={advName} disablePadding sx={{mb: 0.5}}>
                                        <ListItemButton
                                            component={Link}
                                            href={`/adversaries/${environmentData.tier}/${encodeURIComponent(advName)}`}
                                            sx={{ borderRadius: 1 }}
                                        >
                                            <ListItemText
                                                primary={advName}
                                                primaryTypographyProps={{color: 'primary.main'}} // Style as a link
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    <EnvironmentFeaturesDisplay features={environmentData.environmentFeatures} />

                </Paper>
            ) : (
                <Alert severity="warning" sx={{mt: 2}}>Environment details could not be loaded for the current selection.</Alert>
            )}
        </>
    );
}