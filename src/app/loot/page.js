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

// Fetch all loot items (can be refactored into a shared util if used elsewhere)
async function getAllLootItems() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/loot';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' }); // Use 'force-cache' for SSG consistency
        if (!res.ok) {
            console.error(`Failed to fetch loot items for landing page: ${res.status} ${res.statusText} from ${apiUrl}.`);
            return [];
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            console.error(`API at ${apiUrl} did not return an array for loot item list (landing page).`);
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
        console.error('Error fetching loot items for landing page:', error);
        return [];
    }
}

export async function generateMetadata() {
    return {
        title: 'Daggerheart Loot | Ki Great Gaming',
        description: 'Browse all Daggerheart loot items.',
    };
}

export default async function LootLandingPage() {
    const lootItems = await getAllLootItems();

    return (
        <>
            <SiteHeader />
            <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Daggerheart Loot
                    </Typography>
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Discover various loot items available in Daggerheart.
                    </Typography>
                    {lootItems.length > 0 ? (
                        <List>
                            {lootItems.map((item, index) => (
                                <React.Fragment key={item.name}>
                                    <ListItem disablePadding>
                                        <ListItemButton component={Link} href={`/loot/${encodeURIComponent(item.name)}`}>
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
                                    {index < lootItems.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
                            No loot items could be loaded at this time.
                        </Typography>
                    )}
                </Paper>
            </Container>
            <SiteFooter />
        </>
    );
}