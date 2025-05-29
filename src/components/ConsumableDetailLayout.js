'use client';

import React, { useMemo } from 'react'; // Removed unnecessary useState and useEffect for this fix
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
    CardContent
} from '@mui/material';

export default function ConsumableDetailLayout({ allConsumables, consumableData, currentEncodedConsumableName }) {
    // --- HOOKS MOVED TO TOP ---
    const router = useRouter();

    // Sort allConsumables by the 'roll' property for tab order
    // This useMemo is now at the top level
    const sortedConsumablesForTabs = useMemo(() => {
        if (!allConsumables || allConsumables.length === 0) return []; // Handle empty/undefined allConsumables
        return [...allConsumables].sort((a, b) => {
            const rollA = parseInt(a.roll, 10);
            const rollB = parseInt(b.roll, 10);
            if (isNaN(rollA) || isNaN(rollB)) {
                return (a.roll || "").localeCompare(b.roll || "");
            }
            return rollA - rollB;
        });
    }, [allConsumables]);
    // --- END HOOKS MOVED TO TOP ---

    const handleTabChange = (event, newValue) => {
        if (newValue) {
            router.push(`/consumables/${newValue}`);
        }
    };

    // Conditional returns are now AFTER all hook calls
    if (!allConsumables || allConsumables.length === 0) {
        return <Alert severity="warning" sx={{ m: 2 }}>No consumables available for navigation.</Alert>;
    }

    if (!consumableData) {
        // This check should ideally be handled by the page component leading to a notFound,
        // but if the layout receives undefined consumableData, it can show an error.
        return <Alert severity="error" sx={{ m: 2 }}>Selected consumable data could not be loaded or is not available.</Alert>;
    }

    return (
        <>
            {/* Consumable Item Selector Tabs */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: { xs: 56, sm: 64 }, zIndex: 1100, bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentEncodedConsumableName}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="Daggerheart Consumable Items"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {sortedConsumablesForTabs.map((item) => ( // Uses the memoized sorted list
                        <Tab
                            key={item.name}
                            label={`${item.roll}. ${item.name}`}
                            value={encodeURIComponent(item.name)}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Consumable Item Details Content */}
            <Paper component={Card} elevation={3} sx={{ p: { xs: 1, md: 2 } }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {consumableData.name}
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2}}>
                        <Chip label={`Roll: ${consumableData.roll}`} variant="outlined" />
                        <Chip label={`Type: ${consumableData.type}`} color="secondary" size="small"/>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', mb: 1 }}>Description:</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {consumableData.description}
                    </Typography>
                </CardContent>
            </Paper>
        </>
    );
}