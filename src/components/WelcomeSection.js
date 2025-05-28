import React from 'react';
import {
    Typography,
    Container,
    Box,
    Paper,
} from '@mui/material';

export default function WelcomeSection() {
    return (
        <Box component="section" sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', bgcolor: 'background.paper' }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Welcome, Adventurer!
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, maxWidth: '800px', mx: 'auto' }}>
                        Ki Great Gaming is a dedicated fan-driven resource for the Daggerheart roleplaying game by Darrington Press. My mission is to generate interesting content for all players and Game Masters to explore with the core mechanics and narrative elements of Daggerheart, as presented in the System Reference Document (SRD).
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}