import React from 'react';
import {
    Typography,
    Container,
    Box,
    Button,
    Grid, // Added Grid
} from '@mui/material';

import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import WelcomeSection from '../components/WelcomeSection';
import FeaturesSection from '../components/FeaturesSection';
import LicenseAndAttributionSection from '../components/LicenseAndAttributionSection';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function HomePage() {
    const exploreButtons = [
        { href: "/classes/Bard", label: "Explore Classes" },
        { href: "/ancestries/Human", label: "Explore Ancestries" },
        { href: "/communities/Highborne", label: "Explore Communities" },
        { href: "/domains", label: "Explore Domains" },
        { href: "/adversaries", label: "Explore Adversaries" },
        { href: "/environments", label: "Explore Environments" },
        { href: "/campaign-frames", label: "Explore Campaign Frames" },
        { href: "/weapons", label: "Explore Weapons" },
        { href: "/armors", label: "Explore Armors" },
        { href: "/consumables/Stride%20Potion", label: "Explore Consumables" },
        { href: "/loot/Premium%20Bedroll", label: "Explore Loot" },
    ];

    return (
        <>
            <SiteHeader />

            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 6, md: 10 }, // Adjusted padding
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Box
                        component="img"
                        src="/Ki-Great-Gaming-Logo-Large.png"
                        alt="Ki Great Gaming Logo"
                        sx={{
                            mx: 'auto',
                            mb: 4,
                            height: { xs: 100, md: 140 }, // Slightly adjusted
                            width: 'auto',
                            maxWidth: { xs: '80%', sm: 380, md: 450 }, // Adjusted max width
                            objectFit: 'contain',
                        }}
                    />
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Exploration, Fantasy, Sorcery & Swords
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ color: 'text.secondary', mb: 5, maxWidth: '700px', mx: 'auto' }}> {/* Increased bottom margin */}
                        A bunch of stuff that&#39;s compliant with the Daggerheart system. Explore rules, create characters, and dive into lore & stories.
                    </Typography>

                    {/* Grid for Buttons */}
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        {exploreButtons.map((buttonInfo) => (
                            <Grid item size={{xs:6, sm:4, md:3}} key={buttonInfo.href}> {/* Adjust column sizes as needed */}
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    href={buttonInfo.href}
                                    fullWidth // Make buttons take full width of their grid item
                                >
                                    {buttonInfo.label}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <WelcomeSection />
            <FeaturesSection />
            <LicenseAndAttributionSection />

            <SiteFooter />
            <GoogleAnalytics gaId={"G-ZWF7H100PF"}/>
        </>
    );
}