import React from 'react';
import Link from 'next/link';
import { Container, Typography, Paper, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import SiteHeader from '../../components/SiteHeader'; // Adjust path
import SiteFooter from '../../components/SiteFooter'; // Adjust path

// Re-use or ensure this function is accessible
async function getAllDomainNames() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/domains';
    try {
        const res = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Revalidate data periodically
        if (!res.ok) {
            console.error(`Failed to fetch domain names for landing page: ${res.status} ${res.statusText} from ${apiUrl}.`);
            return []; // Return empty on error
        }
        const data = await res.json();
        if (!Array.isArray(data) || !data.every(item => typeof item === 'string')) {
            console.error(`API at ${apiUrl} did not return an array of strings for domain names for landing page.`);
            return [];
        }
        return data.sort(); // Sort domain names alphabetically
    } catch (error) {
        console.error('Error fetching domain names for landing page:', error);
        return [];
    }
}

export async function generateMetadata() {
    return {
        title: 'Daggerheart Domains | Ki Great Gaming',
        description: 'Browse all Daggerheart domains and their cards.',
    };
}

export default async function DomainsLandingPage() {
    const domainNames = await getAllDomainNames();

    return (
        <>
            <SiteHeader />
            <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Daggerheart Domains
                    </Typography>
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Select a domain to view its associated spells and abilities.
                    </Typography>
                    {domainNames.length > 0 ? (
                        <List>
                            {domainNames.map((domainName, index) => (
                                <React.Fragment key={domainName}>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} href={`/domains/${encodeURIComponent(domainName)}`}>
                                            <ListItemText
                                                primary={domainName}
                                                primaryTypographyProps={{variant: 'h6'}}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    {index < domainNames.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
                            No domains could be loaded at this time.
                        </Typography>
                    )}
                </Paper>
            </Container>
            <SiteFooter />
        </>
    );
}