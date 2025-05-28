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

export default function HomePage() {
    return (
        <>
            <SiteHeader />

            <Box
                sx={{
                    backgroundColor: 'background.paper',
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
                        src="/Ki-Great-Gaming-Logo-Large.png"
                        alt="Ki Great Gaming Logo"
                        sx={{
                            mx: 'auto',
                            mb: 4,
                            borderRadius: '50%', // Removed as logo is not circular
                            height: { xs: 120, md: 160 },
                            width: { xs: 'auto', sm: 320, md: 400 }, // Allow auto width for aspect ratio
                            maxWidth: '100%', // Ensure it doesn't overflow container
                            objectFit: 'contain',
                             border: 3, // Border might not be needed if logo has its own whitespace
                             borderColor: 'primary.main',
                             boxShadow: 5, // Shadow might be too much on a non-circular logo image
                        }}
                    />
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Swords, Sorcery & Exploration
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ color: 'text.secondary', mb: 4, maxWidth: '700px', mx: 'auto' }}>
                        A bunch of stuff that&#39;s compliant with the  Daggerheart system. Explore rules, create characters, and dive into lore & stories.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
                        {/*<Button variant="contained" color="primary" size="large" href="#explore-srd">
                            Explore the SRD
                        </Button>
                        <Button variant="outlined" color="primary" size="large" href="#character-creation">
                            Character Creation
                        </Button>*/}
                        <Button variant="contained" color="primary" size="large" href="#explore-srd">
                            Under Construction
                        </Button>
                    </Box>
                </Container>
            </Box>

            <WelcomeSection />
            <FeaturesSection />
            <LicenseAndAttributionSection />

            <SiteFooter />
        </>
    );
}
