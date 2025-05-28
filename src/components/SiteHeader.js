import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Link as MuiLink,
} from '@mui/material';

export default function SiteHeader() {
    return (
        <AppBar position="sticky" component="header">
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} component="a" href="/">
                        <Box
                            component="img"
                            src="/kgg-logo-192x192.png"
                            alt="Ki Great Gaming Small Logo"
                            sx={{
                                height: { xs: 30, sm: 36 },
                                width: { xs: 30, sm: 36 },
                                objectFit: 'contain',
                                mr: 1, // Add some margin to the right of the logo
                            }}
                        />
                        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Ki Great Gaming
                        </Typography>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}> {/* Adjusted gap for potentially more items */}
                        <MuiLink
                            href="/classes/Bard"
                            sx={{
                                color: 'primary.main', // Use the main primary color (blue)
                                fontWeight: 'medium',   // Or 'bold'
                                fontSize: '0.9375rem', // Adjust size to be harmonious with h5, typically 16px is body1, h5 is 24px. 15px here.
                                textDecoration: 'none',
                                padding: '8px 16px',    // Standard padding for clickable areas
                                borderRadius: '4px',    // Consistent with other themed components like buttons
                                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                '&:hover': {
                                    color: 'secondary.main', // Darker blue on hover for the text
                                    backgroundColor: 'action.hover', // Use theme's subtle background hover
                                    textDecoration: 'none', // Keep underline off, or add 'underline' if preferred for nav links
                                },
                            }}
                        >
                            Classes
                        </MuiLink>
                        {/* You can add more links here following the same pattern if needed:
                        <MuiLink
                            href="#another-link"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'medium',
                                fontSize: '0.9375rem',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                '&:hover': {
                                    color: 'secondary.main',
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            Another Link
                        </MuiLink>
                        */}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}