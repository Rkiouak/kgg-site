'use client'; // Required for usePathname hook

import React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Link as MuiLink,
    useTheme, // Import useTheme to access theme palette for active styles
} from '@mui/material';

export default function SiteHeader() {
    const pathname = usePathname();
    const theme = useTheme();

    const commonLinkStyles = {
        fontWeight: 'medium',
        fontSize: '0.9375rem', // 15px
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '4px', // For hover background effect consistency
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-bottom 0.2s ease-in-out',
        borderBottom: '2px solid transparent', // Placeholder for active state
        '&:hover': {
            color: theme.palette.secondary.main, // Darker blue on hover
            backgroundColor: theme.palette.action.hover, // Subtle background on hover
            textDecoration: 'none',
        },
    };

    const activeLinkStyles = {
        color: theme.palette.text.primary, // Use a more prominent color for active state
        fontWeight: 'bold',
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.action.selected, // Or a slightly different hover/selected background
    };

    // Check if paths exist to avoid errors if theme.palette.action.selected is not defined
    const selectedBackgroundColor = theme.palette.action?.selected || theme.palette.action?.hover || 'transparent';


    const navLinks = [
        { href: '/classes/Bard', label: 'Classes', activeCheck: () => pathname.startsWith('/classes') },
        { href: '/ancestries/Human', label: 'Ancestries', activeCheck: () => pathname.startsWith('/ancestries') },
        // Add more links here if needed
    ];

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
                                mr: 1,
                            }}
                        />
                        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Ki Great Gaming
                        </Typography>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {navLinks.map((link) => {
                            const isActive = link.activeCheck();
                            return (
                                <MuiLink
                                    key={link.label}
                                    href={link.href}
                                    sx={{
                                        ...commonLinkStyles,
                                        color: isActive ? theme.palette.text.primary : theme.palette.primary.main,
                                        fontWeight: isActive ? 'bold' : 'medium',
                                        borderBottomColor: isActive ? theme.palette.primary.main : 'transparent',
                                        '&:hover': {
                                            ...commonLinkStyles['&:hover'], // inherit common hover
                                            // Optionally, slightly different hover for active to maintain prominence
                                            // color: isActive ? theme.palette.primary.dark : theme.palette.secondary.main,
                                        },
                                        ...(isActive && { backgroundColor: selectedBackgroundColor })
                                    }}
                                >
                                    {link.label}
                                </MuiLink>
                            );
                        })}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}