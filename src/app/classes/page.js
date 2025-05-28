import React from 'react';
import Link from 'next/link';
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Alert
} from '@mui/material';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

async function getAllClasses() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL+'/api/dh/classes';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' }); // Force cache for SSG
        if (!res.ok) {
            console.error(`Failed to fetch classes: ${res.status} ${res.statusText} from ${apiUrl}`);
            return []; // Return empty array on error to prevent build failure, or throw error
        }
        return res.json();
    } catch (error) {
        console.error(`Error fetching classes data from ${apiUrl}:`, error);
        return []; // Return empty array on fetch error
    }
}

export default async function ClassesListPage() {
    const allClasses = await getAllClasses();

    return (
        <>
            <SiteHeader />
            <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Daggerheart Classes
                    </Typography>
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Select a class to view its details, features, and subclasses.
                    </Typography>
                    {allClasses && allClasses.length > 0 ? (
                        <List>
                            {allClasses.map((cls) => (
                                <ListItem key={cls.name} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton component={Link} href={`/classes/${encodeURIComponent(cls.name)}`}>
                                        <ListItemText
                                            primary={cls.name}
                                            primaryTypographyProps={{variant: 'h6'}}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            No class data could be loaded at this time. The API might be unavailable or returned no data.
                        </Alert>
                    )}
                </Paper>
            </Container>
            <SiteFooter />
        </>
    );
}