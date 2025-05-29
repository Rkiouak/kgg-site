'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Link as MuiLink,
    Button,
    Menu,
    MenuItem,
    useTheme,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // For mobile menu
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function SiteHeader() {
    const pathname = usePathname();
    const theme = useTheme();

    const [anchorElNav, setAnchorElNav] = useState(null); // For mobile nav menu
    const [anchorElCharacter, setAnchorElCharacter] = useState(null);
    const [anchorElEquipment, setAnchorElEquipment] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenCharacterMenu = (event) => {
        setAnchorElCharacter(event.currentTarget);
    };
    const handleCloseCharacterMenu = () => {
        setAnchorElCharacter(null);
    };

    const handleOpenEquipmentMenu = (event) => {
        setAnchorElEquipment(event.currentTarget);
    };
    const handleCloseEquipmentMenu = () => {
        setAnchorElEquipment(null);
    };

    const commonLinkStyles = {
        fontWeight: 'medium',
        fontSize: '0.9375rem',
        textDecoration: 'none',
        padding: '8px 12px', // Adjusted padding for slightly more compact look
        borderRadius: '4px',
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-bottom 0.2s ease-in-out',
        borderBottom: '2px solid transparent',
        display: 'flex', // Added for icon alignment
        alignItems: 'center', // Added for icon alignment
        '&:hover': {
            color: theme.palette.secondary.main,
            backgroundColor: theme.palette.action.hover,
            textDecoration: 'none',
        },
    };

    const selectedBackgroundColor = theme.palette.action?.selected || theme.palette.action?.hover || 'transparent';

    const characterNavLinks = [
        { href: '/classes/Bard', label: 'Classes', activeCheck: () => pathname.startsWith('/classes') },
        { href: '/domains', label: 'Domains', activeCheck: () => pathname.startsWith('/domains') },
        { href: '/ancestries/Human', label: 'Ancestries', activeCheck: () => pathname.startsWith('/ancestries') },
        { href: '/communities/Highborne', label: 'Communities', activeCheck: () => pathname.startsWith('/communities') },
    ];

    const equipmentNavLinks = [
        { href: '/weapons', label: 'Weapons', activeCheck: () => pathname.startsWith('/weapons') },
        { href: '/armors', label: 'Armors', activeCheck: () => pathname.startsWith('/armors') },
        { href: '/loot/Premium%20Bedroll', label: 'Loot', activeCheck: () => pathname.startsWith('/loot') },
        { href: '/consumables/Stride%20Potion', label: 'Consumables', activeCheck: () => pathname.startsWith('/consumables') },
    ];

    const otherNavLinks = [
        { href: '/adversaries', label: 'Adversaries', activeCheck: () => pathname.startsWith('/adversaries') },
        { href: '/environments', label: 'Environments', activeCheck: () => pathname.startsWith('/environments') },
        { href: '/campaign-frames', label: 'Campaign Frames', activeCheck: () => pathname.startsWith('/campaign-frames') },
    ];

    const allNavLinksForMobile = [
        ...characterNavLinks,
        ...equipmentNavLinks,
        ...otherNavLinks
    ];


    const renderMenuItem = (link, handleClose) => {
        const isActive = link.activeCheck();
        return (
            <MenuItem
                key={link.label}
                onClick={() => {
                    handleClose();
                    // No need for router.push if MuiLink handles navigation
                }}
                component={MuiLink}
                href={link.href}
                selected={isActive}
                sx={{
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? theme.palette.primary.main : 'inherit',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    }
                }}
            >
                {link.label}
            </MenuItem>
        );
    };


    return (
        <AppBar position="sticky" component="header">
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <MuiLink href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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
                        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: 'text.primary', display: { xs: 'none', sm: 'inline' } }}>
                            Ki Great Gaming
                        </Typography>
                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', color: 'text.primary', display: { xs: 'inline', sm: 'none' } }}>
                            KGG
                        </Typography>
                    </MuiLink>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: { xs: 0.5, sm: 1 } }}>
                        {/* Character Dropdown */}
                        <Button
                            aria-controls="character-menu"
                            aria-haspopup="true"
                            onClick={handleOpenCharacterMenu}
                            sx={{
                                ...commonLinkStyles,
                                color: characterNavLinks.some(l => l.activeCheck()) ? theme.palette.text.primary : theme.palette.primary.main,
                                fontWeight: characterNavLinks.some(l => l.activeCheck()) ? 'bold' : 'medium',
                                borderBottomColor: characterNavLinks.some(l => l.activeCheck()) ? theme.palette.primary.main : 'transparent',
                                ...(characterNavLinks.some(l => l.activeCheck()) && { backgroundColor: selectedBackgroundColor })
                            }}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            Character
                        </Button>
                        <Menu
                            id="character-menu"
                            anchorEl={anchorElCharacter}
                            open={Boolean(anchorElCharacter)}
                            onClose={handleCloseCharacterMenu}
                            MenuListProps={{ onMouseLeave: handleCloseCharacterMenu }}
                            keepMounted
                            transformOrigin={{ horizontal: 'left', vertical: 'top'}}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom'}}
                        >
                            {characterNavLinks.map(link => renderMenuItem(link, handleCloseCharacterMenu))}
                        </Menu>

                        {/* Equipment Dropdown */}
                        <Button
                            aria-controls="equipment-menu"
                            aria-haspopup="true"
                            onClick={handleOpenEquipmentMenu}
                            sx={{
                                ...commonLinkStyles,
                                color: equipmentNavLinks.some(l => l.activeCheck()) ? theme.palette.text.primary : theme.palette.primary.main,
                                fontWeight: equipmentNavLinks.some(l => l.activeCheck()) ? 'bold' : 'medium',
                                borderBottomColor: equipmentNavLinks.some(l => l.activeCheck()) ? theme.palette.primary.main : 'transparent',
                                ...(equipmentNavLinks.some(l => l.activeCheck()) && { backgroundColor: selectedBackgroundColor })
                            }}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            Equipment
                        </Button>
                        <Menu
                            id="equipment-menu"
                            anchorEl={anchorElEquipment}
                            open={Boolean(anchorElEquipment)}
                            onClose={handleCloseEquipmentMenu}
                            MenuListProps={{ onMouseLeave: handleCloseEquipmentMenu }}
                            keepMounted
                            transformOrigin={{ horizontal: 'left', vertical: 'top'}}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom'}}
                        >
                            {equipmentNavLinks.map(link => renderMenuItem(link, handleCloseEquipmentMenu))}
                        </Menu>

                        {/* Other Links */}
                        {otherNavLinks.map((link) => {
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

                    {/* Mobile Navigation */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon sx={{ color: theme.palette.primary.main }}/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {allNavLinksForMobile.map((link) => renderMenuItem(link, handleCloseNavMenu))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}