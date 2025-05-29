import React from 'react';
import {
    Typography,
    Container,
    Box,
    Button,
} from '@mui/material';

import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import WelcomeSection from '../components/WelcomeSection';
import FeaturesSection from '../components/FeaturesSection';
import LicenseAndAttributionSection from '../components/LicenseAndAttributionSection';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function HomePage() {
    return (
        <>
            <SiteHeader />

            <Box
                sx={{
                    backgroundColor: 'background.paper', // Ensure this uses theme.palette.background.paper
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    {/* Site Logo */}
                    <Box
                        component="img"
                        src="/Ki-Great-Gaming-Logo-Large.png" // Make sure this path is correct from the public folder
                        alt="Ki Great Gaming Logo"
                        sx={{
                            mx: 'auto',
                            mb: 4,
                            // borderRadius: '50%', // Removed as logo is not circular
                            height: { xs: 120, md: 160 },
                            width: { xs: 'auto', sm: 320, md: 400 }, // Allow auto width for aspect ratio
                            maxWidth: '100%', // Ensure it doesn't overflow container
                            objectFit: 'contain',
                            // border: 3, // Border might not be needed if logo has its own whitespace
                            // borderColor: 'primary.main',
                            // boxShadow: 5, // Shadow might be too much on a non-circular logo image
                        }}
                    />
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Exploration, Fantasy, Sorcery & Swords
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ color: 'text.secondary', mb: 4, maxWidth: '700px', mx: 'auto' }}>
                        A bunch of stuff that&#39;s compliant with the  Daggerheart system. Explore rules, create characters, and dive into lore & stories.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
                        <Button variant="outlined" color="secondary" size="large" href="/classes/Bard">
                            Explore Classes
                        </Button>
                        <Button variant="outlined" color="secondary" size="large" href="/ancestries/Human"> {/* Changed from contained to outlined for variety */}
                            Explore Ancestries
                        </Button>
                        <Button variant="outlined" color="secondary" size="large" href="/communities/Highborne"> {/* Added Communities button */}
                            Explore Communities
                        </Button>
                        <Button variant="outlined" color="secondary" size="large" href="/adversaries"> {/* Added Adversaries button */}
                            Explore Adversaries
                        </Button>
                        <Button variant="outlined" color="secondary" size="large" href="/environments">
                            Explore Environments
                        </Button>
                    </Box>
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