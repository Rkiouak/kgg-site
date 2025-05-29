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
    Grid,
    List,
    ListItem
} from '@mui/material';

// Helper to render features/experience lists (from previous step)
const FeatureListDisplay = ({ items, title, nameKey = "name", descriptionKey = "description", bonusKey = "bonus" }) => {
    if (!items || (Array.isArray(items) && items.length === 0) || (typeof items === 'object' && Object.keys(items).length === 0) ) {
        return null;
    }
    const itemsArray = Array.isArray(items) ? items : Object.values(items);

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', mb: 1 }}>{title}</Typography>
            <List dense disablePadding>
                {itemsArray.map((item, index) => (
                    item && item[nameKey] && (
                        <ListItem key={item[nameKey] + index} sx={{ display: 'block', pl: 0, pb: 1, alignItems: 'flex-start' }}>
                            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                                {item[nameKey]} {item[bonusKey] ? `(${item[bonusKey]})` : ''}
                            </Typography>
                            {item[descriptionKey] && (
                                <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                                    {item[descriptionKey]}
                                </Typography>
                            )}
                        </ListItem>
                    )
                ))}
            </List>
        </Box>
    );
};


export default function AdversaryDetailLayout({ allAdversaries, adversaryData, currentTier, currentEncodedAdversaryName }) {
    const router = useRouter();

    // State for the tier selected in the Tier Tabs. Initialize with the current tier from URL.
    const [selectedFilterTier, setSelectedFilterTier] = useState(parseInt(currentTier, 10));

    // Effect to update selectedFilterTier if currentTier from URL changes (e.g., browser navigation)
    useEffect(() => {
        setSelectedFilterTier(parseInt(currentTier, 10));
    }, [currentTier]);

    const handleTierTabChange = (event, newTier) => {
        setSelectedFilterTier(newTier);
        // When tier filter changes, navigate to the first adversary in that new tier
        // or to a general tier page if that existed. For now, let's find the first one.
        const firstAdversaryInNewTier = allAdversaries
            .filter(adv => adv.tier === newTier)
            .sort((a,b) => a.name.localeCompare(b.name))[0];

        if (firstAdversaryInNewTier) {
            router.push(`/adversaries/${newTier}/${encodeURIComponent(firstAdversaryInNewTier.name)}`);
        } else {
            // If no adversaries in the selected tier, perhaps clear content or show a message.
            // For now, this will lead to a notFound if not handled by page.js for this new URL
            // Or, we can just update the filter and let the user pick an adversary if the list is empty.
            // For a better UX, let's just filter and not auto-navigate if changing tier only.
            // The user can then click an adversary from the filtered list.
            // If you want auto-navigation, uncomment the router.push above.
        }
    };

    const handleAdversaryTabChange = (event, encodedAdversaryName) => {
        // The value of the tab is the encodedAdversaryName directly
        if (encodedAdversaryName) {
            router.push(`/adversaries/${selectedFilterTier}/${encodedAdversaryName}`);
        }
    };

    const uniqueTiers = useMemo(() => {
        if (!allAdversaries) return [];
        return [...new Set(allAdversaries.map(adv => adv.tier))].sort((a, b) => a - b);
    }, [allAdversaries]);

    const adversariesForSelectedTier = useMemo(() => {
        if (!allAdversaries) return [];
        return allAdversaries
            .filter(adv => adv.tier === selectedFilterTier)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allAdversaries, selectedFilterTier]);

    // Determine the value for the adversary name tabs
    // It should be the current adversary's encoded name IF its tier matches the selected filter tier
    const adversaryNameTabValue = (adversaryData && adversaryData.tier === selectedFilterTier)
        ? currentEncodedAdversaryName
        : false; // No tab active if current adversary not in filtered tier

    // Calculate sticky top positions
    const headerHeight = { xs: 56, sm: 64 };
    const tierTabsHeight = 48; // Standard MUI Tab height
    const adversaryTabsTop = {
        xs: headerHeight.xs + tierTabsHeight,
        sm: headerHeight.sm + tierTabsHeight
    };


    if (!allAdversaries || allAdversaries.length === 0) {
        return <Alert severity="warning" sx={{m:2}}>No adversaries data loaded.</Alert>;
    }

    return (
        <>
            {/* Tier Selector Tabs */}
            {uniqueTiers.length > 0 && (
                <Paper elevation={1} sx={{
                    mb: 0.5, // Reduced margin to bring adversary tabs closer
                    position: 'sticky',
                    top: headerHeight,
                    zIndex: 1101,
                    bgcolor: 'background.paper'
                }}>
                    <Tabs
                        value={selectedFilterTier}
                        onChange={handleTierTabChange}
                        variant={uniqueTiers.length > 5 ? "scrollable" : "fullWidth"}
                        scrollButtons="auto"
                        aria-label="Filter by Adversary Tier"
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

            {/* Adversary Name Tabs (filtered by selectedFilterTier) */}
            <Paper elevation={1} sx={{
                mb: 3,
                position: 'sticky',
                top: adversaryTabsTop,
                zIndex: 1100,
                bgcolor: 'background.paper'
            }}>
                {adversariesForSelectedTier.length > 0 ? (
                    <Tabs
                        value={adversaryNameTabValue}
                        onChange={handleAdversaryTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Daggerheart adversaries by selected tier"
                        indicatorColor="secondary"
                        textColor="secondary"
                    >
                        {adversariesForSelectedTier.map((adv) => (
                            <Tab
                                key={adv.name}
                                label={adv.name}
                                value={encodeURIComponent(adv.name)} // Value is just the name now
                            />
                        ))}
                    </Tabs>
                ) : (
                    selectedFilterTier && <Typography sx={{p:2, textAlign:'center', color: 'text.secondary'}}>No adversaries found for Tier {selectedFilterTier}.</Typography>
                )}
            </Paper>

            {/* Adversary Details Content */}
            {adversaryData ? (
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        {adversaryData.name}
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                        Tier {adversaryData.tier} - {adversaryData.adversaryType}
                        {adversaryData.hordeDetails && ` (Horde: ${adversaryData.hordeDetails})`}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line', fontStyle: 'italic' }}>
                        {adversaryData.description}
                    </Typography>

                    {adversaryData.motivesAndTactics && adversaryData.motivesAndTactics.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', mb: 0.5 }}>Motives & Tactics:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {adversaryData.motivesAndTactics.map((motive) => (
                                    <Chip key={motive} label={motive} size="small" />
                                ))}
                            </Box>
                        </Box>
                    )}
                    <Divider sx={{ my: 2 }}/>

                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>Stats</Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item size={{xs:12, sm:6}}><Typography><strong>Difficulty:</strong> {adversaryData.stats?.difficulty}</Typography></Grid>
                        <Grid item size={{xs:12, sm:6}}><Typography><strong>Thresholds:</strong> {adversaryData.stats?.thresholds}</Typography></Grid>
                        <Grid item size={{xs:12, sm:6}}><Typography><strong>HP:</strong> {adversaryData.stats?.hp}</Typography></Grid>
                        <Grid item size={{xs:12, sm:6}}><Typography><strong>Stress:</strong> {adversaryData.stats?.stress}</Typography></Grid>
                        <Grid item size={{xs:12, sm:6}}><Typography><strong>Attack Modifier:</strong> {adversaryData.stats?.attackModifier}</Typography></Grid>
                    </Grid>

                    {adversaryData.standardAttack && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', mb: 0.5 }}>Standard Attack: {adversaryData.standardAttack.name}</Typography>
                            <Typography variant="body2">Range: {adversaryData.standardAttack.range}, Damage: {adversaryData.standardAttack.damage}</Typography>
                        </Box>
                    )}

                    <FeatureListDisplay items={adversaryData.experience || []} title="Experience" nameKey="name" bonusKey="bonus" descriptionKey={null}/>
                    <FeatureListDisplay items={adversaryData.features} title="Features" />
                    <FeatureListDisplay items={adversaryData.fearFeatures} title="Fear Features" />

                </Paper>
            ) : (
                <Alert severity="warning" sx={{mt: 2}}>Adversary details could not be loaded for the current selection.</Alert>
            )}
        </>
    );
}
