import React from 'react';
import Link from 'next/link';
import { Container, Typography, Paper, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import SiteHeader from '../../components/SiteHeader'; // Adjust path
import SiteFooter from '../../components/SiteFooter'; // Adjust path

const ALL_AVAILABLE_TIERS = [1, 2, 3, 4]; // Consistent list of tiers

export async function generateMetadata() {
    return {
        title: 'Daggerheart Weapons | Ki Great Gaming',
        description: 'Browse Daggerheart weapons by tier.',
    };
}

export default async function WeaponsLandingPage() {
    return (
        <>
            <SiteHeader />
            <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Daggerheart Weapons
                    </Typography>
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Select a tier to view available weapons.
                    </Typography>
                    {ALL_AVAILABLE_TIERS.length > 0 ? (
                        <List>
                            {ALL_AVAILABLE_TIERS.map((tier, index) => (
                                <React.Fragment key={`tier-link-${tier}`}>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} href={`/weapons/${tier}`}>
                                            <ListItemText
                                                primary={`Tier ${tier} Weapons`}
                                                primaryTypographyProps={{variant: 'h6'}}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    {index < ALL_AVAILABLE_TIERS.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
                            Weapon tiers are currently unavailable.
                        </Typography>
                    )}
                </Paper>
            </Container>
            <SiteFooter />
        </>
    );
}