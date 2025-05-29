'use client';

import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Paper,
    Chip,
    List,
    ListItem,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Helper component to render individual Beastform Option details (remains the same)
const BeastformOptionDetail = ({ option }) => {
    const renderTraitModification = (mod) => mod ? `${mod.trait} +${mod.modifier}` : 'N/A';
    const renderAttackRolls = (rolls) => rolls ? `${rolls.range} - ${rolls.trait} - ${rolls.damage}` : 'N/A';

    const renderFeaturesList = (featuresObj, title) => {
        if (!featuresObj || Object.keys(featuresObj).length === 0) {
            return null;
        }
        return (
            <Box sx={{mt: 1}}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{title || 'Features'}:</Typography>
                <List dense disablePadding sx={{pl:1}}>
                    {Object.values(featuresObj).map(f => (
                        f && f.name && ( // Ensure feature and name exist
                            <ListItem key={f.name} sx={{ display: 'block', pl: 0, pb: 1 }}>
                                <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold' }}>{f.name}</Typography>
                                <Typography variant="caption" component="div" sx={{ whiteSpace: 'pre-line' }}>{f.description}</Typography>
                            </ListItem>
                        )
                    ))}
                </List>
            </Box>
        );
    };

    return (
        <Paper elevation={1} sx={{ p: 2, mb: 2, '&:last-child': { mb: 0 } }}>
            <Typography variant="h6" gutterBottom>{option.name} (Tier {option.tier || 'N/A'})</Typography>
            {option.examples && option.examples.length > 0 && (
                <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{fontWeight:'medium'}}>Examples:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {option.examples.map(ex => <Chip key={ex} label={ex} size="small" />)}
                    </Box>
                </Box>
            )}
            <Divider sx={{ my: 1.5 }}/>

            {option.traitModification && <Typography variant="body2"><strong>Trait Modification:</strong> {renderTraitModification(option.traitModification)}</Typography>}
            {option.evasionBonus !== undefined && <Typography variant="body2"><strong>Evasion Bonus:</strong> {option.evasionBonus}</Typography>}
            {option.attackRolls && <Typography variant="body2"><strong>Attack:</strong> {renderAttackRolls(option.attackRolls)}</Typography>}

            {option.advantagesOn && option.advantagesOn.length > 0 && (
                <Box sx={{ my: 1 }}>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{fontWeight:'medium'}}>Advantages On:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {option.advantagesOn.map(adv => <Chip key={adv} label={adv} variant="outlined" size="small" />)}
                    </Box>
                </Box>
            )}

            {option.type === "beastformOption" && renderFeaturesList(option.features, "Features")}

            {option.type === "beastformHybrid" && option.hybridFeaturesRule && (
                <Box sx={{mt: 1.5}}>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>{option.hybridFeaturesRule.name}</Typography>
                    <Typography variant="caption" component="div" sx={{ whiteSpace: 'pre-line' }}>{option.hybridFeaturesRule.description}</Typography>
                </Box>
            )}

            {option.type === "beastformEvolutionTemplate" && (
                <>
                    {option.description && <Typography variant="body2" sx={{my:1, fontStyle: 'italic'}}>{option.description}</Typography>}
                    {option.baseBeastformTierToUpgrade && <Typography variant="body2"><strong>Based on Tier to Upgrade:</strong> {option.baseBeastformTierToUpgrade}</Typography>}
                    {renderFeaturesList(option.evolutionBonuses, "Evolution Bonuses")}
                </>
            )}
        </Paper>
    );
};


export default function DruidBeastformOptions() {
    const [beastformOptions, setBeastformOptions] = useState([]);
    const [loading, setLoading] = useState(true); // Set initial loading to true if fetching on first expand
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Accordion starts collapsed

    useEffect(() => {
        // Only fetch if expanded and data hasn't been loaded yet
        if (isExpanded && beastformOptions.length === 0 && loading) {
            async function fetchData() {
                try {
                    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/druid/beastformOptions');
                    if (!response.ok) {
                        throw new Error(`Failed to fetch beastform options: ${response.status} ${response.statusText}`);
                    }
                    let data = await response.json();
                    // Sort data by tier
                    if (Array.isArray(data)) {
                        data.sort((a, b) => (a.tier || 0) - (b.tier || 0)); // Added fallback for tier if undefined
                    }
                    setBeastformOptions(data);
                    setError(null);
                } catch (err) {
                    console.error(err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        } else if (!isExpanded && beastformOptions.length === 0) {
            // If accordion is collapsed and we haven't fetched, set loading true so it fetches on next expand
            setLoading(true);
        } else if (beastformOptions.length > 0) {
            // If data is already loaded, ensure loading is false
            setLoading(false);
        }
    }, [isExpanded, beastformOptions.length, loading]); // Rerun effect if these change

    const handleAccordionChange = (event, newExpandedState) => {
        setIsExpanded(newExpandedState);
    };

    return (
        <Box sx={{ mt: 4, mb: 2 }}>
            <Accordion expanded={isExpanded} onChange={handleAccordionChange} TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="druid-beastform-options-content"
                    id="druid-beastform-options-header"
                >
                    <Typography variant="h5" component="div">Druid Beastform Options</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: { xs: 1, sm: 2 } }}>
                    {loading && isExpanded && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
                    {error && isExpanded && <Alert severity="error" sx={{my: 2}}>Error loading Beastform Options: {error}</Alert>}
                    {!loading && !error && isExpanded && beastformOptions.length === 0 && <Typography sx={{my:2}}>No beastform options available.</Typography>}
                    {!loading && !error && isExpanded && beastformOptions.length > 0 && (
                        <Box>
                            {beastformOptions.map(option => (
                                option && option.name ?
                                    <BeastformOptionDetail key={option.name} option={option} />
                                    : null
                            ))}
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}