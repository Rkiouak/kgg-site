import React from 'react';
import {
    Typography,
    Container,
    Box,
    Grid,
    Paper,
    Icon,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const featuresData = [
    { title: "Character Tools", description: "Interactive guides for character creation, ancestry features, and class abilities.", iconName: "PersonAdd" },
    { title: "GM Resources", description: "Quick references, adversary stats, and tools to help run your games smoothly.", iconName: "Build" },
    { title: "Community Focused", description: "Links to the wider Daggerheart community, homebrew content (clearly marked), and other fan resources.", iconName: "Groups" },
];

export default function FeaturesSection() {
    return (
        <Box component="section" sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 6 }}>
                    What You&apos;ll Find Inside.
                </Typography>
                <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mb: 6 }}>
                    Site is Under Construction -- Placeholder Content Follows
                </Typography>
                <Grid container spacing={4}>
                    {featuresData.map((feature, index) => (
                        <Grid item size={{xs:12, sm:6, md:4}} key={feature.title + index}>
                            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                                <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h6" component="h3" sx={{ color: 'primary.main', fontWeight: 'semibold', mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}