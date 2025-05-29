'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Typography,
    Box,
    Paper,
    Divider,
    Alert,
    Tabs,
    Tab,
    Chip,
    Card,
    CardContent,
    Grid
} from '@mui/material';

// Component to display a single Domain Card
const DomainCardItem = ({ card }) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom sx={{fontWeight:'bold'}}>
                        {card.name}
                    </Typography>
                    <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={card.type || 'Card'} size="small" color="primary" />
                        <Chip label={`Level: ${card.level}`} size="small" variant="outlined" />
                        <Chip label={`Recall: ${card.recallCost}`} size="small" variant="outlined" />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {card.description}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default function DomainDetailLayout({ allDomainNames, domainCards, currentDomainName, currentEncodedDomainName }) {
    const router = useRouter();

    const handleTabChange = (event, newValue) => { // newValue is the encoded domain name
        if (newValue) {
            router.push(`/domains/${newValue}`);
        }
    };

    if (!allDomainNames || allDomainNames.length === 0) {
        return <Alert severity="warning" sx={{ m: 2 }}>No domains available for navigation.</Alert>;
    }

    const sortedDomainCards = domainCards
        ? [...domainCards].sort((a, b) => (a.level - b.level) || a.name.localeCompare(b.name))
        : [];

    return (
        <>
            {/* Domain Selector Tabs */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: { xs: 56, sm: 64 }, zIndex: 1100, bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentEncodedDomainName} // Should be the URL-encoded name
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="Daggerheart Domains"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {allDomainNames.sort().map((domainName) => ( // Sort domain names alphabetically for tabs
                        <Tab
                            key={domainName}
                            label={domainName}
                            value={encodeURIComponent(domainName)}
                        />
                    ))}
                </Tabs>
            </Paper>

            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                {currentDomainName} Domain Cards
            </Typography>

            {sortedDomainCards.length > 0 ? (
                <Grid container spacing={2}>
                    {sortedDomainCards.map((card) => (
                        <DomainCardItem key={card.name} card={card} />
                    ))}
                </Grid>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No cards found for the {currentDomainName} domain, or data is loading.
                </Alert>
            )}
        </>
    );
}