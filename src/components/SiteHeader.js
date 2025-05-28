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
                                height: { xs: 30, sm: 36 }, // Slightly increased size
                                width: { xs: 30, sm: 36 },  // Slightly increased size
                                objectFit: 'contain',
                            }}
                        />
                        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Ki Great Gaming
                        </Typography>
                    </Box>
                    {/* Optional Navigation Links */}
                    {/*
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <MuiLink href="#rules" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>Rules</MuiLink>
            <MuiLink href="#creation" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>Creation</MuiLink>
            <MuiLink href="#gm-toolkit" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>GM Toolkit</MuiLink>
          </Box>
          */}
                </Toolbar>
            </Container>
        </AppBar>
    );
}