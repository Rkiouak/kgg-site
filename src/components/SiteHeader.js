'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Link as MuiLink,
    useTheme,
} from '@mui/material';

export default function SiteHeader() {
    const pathname = usePathname();
    const theme = useTheme();

    const commonLinkStyles = {
        fontWeight: 'medium',
        fontSize: '0.9375rem',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-bottom 0.2s ease-in-out',
        borderBottom: '2px solid transparent',
        '&:hover': {
            color: theme.palette.secondary.main,
            backgroundColor: theme.palette.action.hover,
            textDecoration: 'none',
        },
    };

    const selectedBackgroundColor = theme.palette.action?.selected || theme.palette.action?.hover || 'transparent';

    const navLinks = [
        { href: '/classes/Bard', label: 'Classes', activeCheck: () => pathname.startsWith('/classes') },
        { href: '/ancestries/Human', label: 'Ancestries', activeCheck: () => pathname.startsWith('/ancestries') },
        { href: '/communities/Highborne', label: 'Communities', activeCheck: () => pathname.startsWith('/communities') },
        { href: '/domains', label: 'Domains', activeCheck: () => pathname.startsWith('/domains') },
        { href: '/adversaries', label: 'Adversaries', activeCheck: () => pathname.startsWith('/adversaries') },
        { href: '/environments', label: 'Environments', activeCheck: () => pathname.startsWith('/environments') },
        { href: '/campaign-frames', label: 'Campaign Frames', activeCheck: () => pathname.startsWith('/campaign-frames') },
        { href: '/weapons', label: 'Weapons', activeCheck: () => pathname.startsWith('/weapons') },
        { href: '/armors', label: 'Armors', activeCheck: () => pathname.startsWith('/armors') },


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

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: {xs: 0.5, sm: 1} }}> {/* Adjusted gap */}
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
                                            ...commonLinkStyles['&:hover'],
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