import React from 'react';
import Link from 'next/link';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Chip,
    Box
} from '@mui/material';
import SiteHeader from '../../components/SiteHeader'; // Adjust path as needed
import SiteFooter from '../../components/SiteFooter'; // Adjust path as needed

// Fetch all consumable items (can be refactored into a shared util if used elsewhere)
async function getAllConsumables() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/consumables';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' }); // Use 'force-cache' for SSG consistency
        if (!res.ok) {
            console.error(`Failed to fetch consumable items for landing page: ${res.status} ${res.statusText} from ${apiUrl}.`);
            return [];
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            console.error(`API at ${apiUrl} did not return an array for consumable item list (landing page).`);
            return [];
        }
        // Sort by roll number (parsing as int for correct numeric sort)
        return data.sort((a, b) => {
            const rollA = parseInt(a.roll, 10);
            const rollB = parseInt(b.roll, 10);
            if (isNaN(rollA) || isNaN(rollB)) { // Fallback for non-numeric rolls
                return (a.roll || "").localeCompare(b.roll || "");
            }
            return rollA - rollB;
        });
    } catch (error) {
        console.error('Error fetching consumable items for landing page:', error);
        return [];
    }
}

export async function generateMetadata() {
    return {
        title: 'Daggerheart Consumables | Ki Great Gaming',
        description: 'Browse all Daggerheart consumable items.',
    };
}

export default async function ConsumablesLandingPage() {
    const consumableItems = await getAllConsumables();

    return (
        <>
            <SiteHeader />
            <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Daggerheart Consumables
                    </Typography>
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Discover various consumable items available in Daggerheart.
                    </Typography>
                    {consumableItems.length > 0 ? (
                        <List>
                            {consumableItems.map((item, index) => (
                                <React.Fragment key={item.name}>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} href={`/consumables/${encodeURIComponent(item.name)}`}>
                                            <ListItemText
                                                primary={`${item.roll}. ${item.name}`}
                                                secondary={
                                                    <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block', mt: 0.5 }}>
                                                        {item.description ? (item.description.length > 150 ? item.description.substring(0, 147) + "..." : item.description) : "No description."}
                                                    </Typography>
                                                }
                                                primaryTypographyProps={{variant: 'h6'}}
                                                secondaryTypographyProps={{component: 'div'}}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    {index < consumableItems.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
                            No consumable items could be loaded at this time.
                        </Typography>
                    )}
                </Paper>
            </Container>
            <SiteFooter />
        </>
    );
}