'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Typography,
    Box,
    Paper,
    Divider,
    Alert,
    Tabs,
    Tab,
    Chip
} from '@mui/material';

export default function CommunityDetailLayout({ allCommunities, communityData, currentEncodedCommunityName }) {
    const router = useRouter();

    const handleTabChange = (event, newValue) => {
        // newValue will be the encodeURIComponent(community.name)
        if (newValue) {
            router.push(`/communities/${newValue}`);
        }
    };

    if (!allCommunities || allCommunities.length === 0) {
        return <Alert severity="warning">No communities available to display in tabs.</Alert>;
    }

    if (!communityData) {
        return <Alert severity="error">Selected community data could not be loaded.</Alert>;
    }

    return (
        <>
            {/* Community Selector Tabs */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: { xs: 56, sm: 64 }, zIndex: 1100, bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentEncodedCommunityName}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="Daggerheart communities"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {allCommunities.map((comm) => (
                        <Tab
                            key={comm.name}
                            label={comm.name}
                            value={encodeURIComponent(comm.name)}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Community Details Content */}
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    {communityData.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                    {communityData.description}
                </Typography>

                {communityData.adjectives && communityData.adjectives.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            Adjectives
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {communityData.adjectives.map((adj) => (
                                <Chip key={adj} label={adj} />
                            ))}
                        </Box>
                    </Box>
                )}

                {communityData.communityFeature && (
                    <Box>
                        <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            Community Feature
                        </Typography>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                            {communityData.communityFeature.name}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {communityData.communityFeature.description}
                        </Typography>
                    </Box>
                )}
                {!communityData.communityFeature && (!communityData.adjectives || communityData.adjectives.length === 0) && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        No specific adjectives or features listed for this community.
                    </Alert>
                )}
            </Paper>
        </>
    );
}