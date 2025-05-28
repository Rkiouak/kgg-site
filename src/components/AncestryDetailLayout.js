'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    Divider,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
// Note: Container, SiteHeader, SiteFooter are managed by the page.js

export default function AncestryDetailLayout({ allAncestries, ancestryData, currentEncodedAncestryName }) {
    const router = useRouter();

    const handleTabChange = (event, newValue) => {
        // newValue will be the encodeURIComponent(ancestry.name)
        if (newValue) {
            router.push(`/ancestries/${newValue}`);
        }
    };

    if (!allAncestries || allAncestries.length === 0) {
        return <Alert severity="warning">No ancestries available to display in tabs.</Alert>;
    }

    if (!ancestryData) {
        // This case should ideally be caught by notFound() in page.js,
        // but as a fallback for the layout component:
        return <Alert severity="error">Selected ancestry data could not be loaded.</Alert>;
    }

    return (
        <>
            {/* Ancestry Selector Tabs */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: { xs: 56, sm: 64 }, zIndex: 1100, bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentEncodedAncestryName} // This should match the value prop of the active Tab
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="Daggerheart ancestries"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {allAncestries.map((anc) => (
                        <Tab
                            key={anc.name}
                            label={anc.name}
                            value={encodeURIComponent(anc.name)} // Ensure this matches how currentEncodedAncestryName is derived
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Ancestry Details Content */}
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    {ancestryData.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                    {ancestryData.description}
                </Typography>

                {ancestryData.type === 'ancestry' && ancestryData.ancestryFeatures && (
                    <>
                        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 'medium' }}>
                            Ancestry Features
                        </Typography>
                        <List dense>
                            {Object.values(ancestryData.ancestryFeatures).map((feature) => (
                                <ListItem key={feature.name} sx={{ display: 'block', mb: 2, p:0 }}>
                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>{feature.name}</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{feature.description}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}

                {ancestryData.type === 'ancestryGuide' && ancestryData.creationSteps && (
                    <>
                        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 'medium' }}>
                            Creation Steps for Mixed Ancestry
                        </Typography>
                        <List dense>
                            {ancestryData.creationSteps.map((step) => (
                                <ListItem key={step.stepNumber} sx={{ display: 'block', mb: 2, p:0 }}>
                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>{`${step.stepNumber}. ${step.name}`}</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{step.description}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
                {!ancestryData.ancestryFeatures && !ancestryData.creationSteps && Object.keys(ancestryData).length > 0 && ( // Check if ancestryData is not empty
                    <Alert severity="info" sx={{ mt: 3 }}>
                        No specific features or creation steps listed for this entry.
                    </Alert>
                )}
            </Paper>
        </>
    );
}