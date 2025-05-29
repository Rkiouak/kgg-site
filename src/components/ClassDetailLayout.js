// src/components/ClassDetailLayout.js
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Typography,
    Box,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
    Tabs,
    Tab,
    Alert,
    Grid, // Added Grid for layout
} from '@mui/material';
import Link from 'next/link'; // Import Link from Next.js
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Helper component to render features (remains the same)
const FeatureAccordion = ({ title, features, initiallyExpanded = false }) => {
    if (!features || Object.keys(features).length === 0) return null;
    return (
        <Accordion sx={{ mb: 2 }} defaultExpanded={initiallyExpanded}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List dense disablePadding>
                    {Object.values(features).map(feature => (
                        <ListItem key={feature.name} sx={{ display: 'block', mb: 1, px: 0 }}>
                            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>{feature.name}</Typography>
                            <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>{feature.description}</Typography>
                            {feature.abilities && (
                                <List dense sx={{ pl: 2, pt: 0.5 }} disablePadding>
                                    {feature.abilities.map((ability, index) => (
                                        <ListItem key={ability.name || `ability-${index}`} sx={{ display: 'block', pt: 0.5, px:0 }}>
                                            {ability.name && <Typography variant="caption" component="div" sx={{ fontWeight: 'medium' }}>{ability.name}:</Typography>}
                                            <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>{ability.description}</Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    );
};

// Helper component to render subclass details (remains the same)
const SubclassAccordion = ({ subclass }) => {
    if (!subclass) return null; // Add a guard for null subclass
    return (
        <Accordion key={subclass.name} slotProps={{ transition: { unmountOnExit: true }}} sx={{ boxShadow: 'none', borderTop: 1, borderColor: 'divider', '&:first-of-type': { borderTop: 0 } }} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{subclass.name}</Typography>
                {subclass.spellcastTrait && <Chip label={`Spellcast: ${subclass.spellcastTrait}`} size="small" sx={{ ml: 2 }} color="secondary" />}
            </AccordionSummary>
            <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 0 /* Adjust padding if needed */ }}>
                <FeatureAccordion key={"Foundation Features"} title="Foundation Features" features={subclass.foundationFeatures} initiallyExpanded />
                <FeatureAccordion key={"Specialization Features"} title="Specialization Features" features={subclass.specializationFeatures} />
                <FeatureAccordion key={"Mastery Features"} title="Mastery Features" features={subclass.masteryFeatures} />
            </AccordionDetails>
        </Accordion>
    );
};

// Main component to display class details and the new Tabs selector
export default function ClassDetailLayout({ classData, allClasses }) {
    const router = useRouter();
    const [selectedSubclassIndex, setSelectedSubclassIndex] = React.useState(0);

    const handleMainTabChange = (event, newValue) => {
        if (newValue) {
            router.push(`/classes/${encodeURIComponent(newValue)}`);
        }
    };

    const handleSubclassTabChange = (event, newIndex) => {
        setSelectedSubclassIndex(newIndex);
    };

    const currentMainTabValue = classData ? classData.name : false;

    if (!allClasses || allClasses.length === 0) {
        return <Alert severity="info">Loading class list or no classes available.</Alert>;
    }

    // Calculate sticky top position for subclass sidebar
    // Header height (approx 64px on sm+) + Class Tabs height (approx 48px) + some margin (16px)
    const subclassSidebarStickyTop = { xs: 56 + 48 + 16, sm: 64 + 48 + 16 }; // Result: xs: 120px, sm: 128px
    const currentSubclass = classData?.subclasses?.[selectedSubclassIndex];

    return (
        <>
            {/* Class Selector Tabs (Main classes) */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: { xs: 56, sm: 64 }, zIndex: 1100, bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentMainTabValue}
                    onChange={handleMainTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="Daggerheart classes"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {allClasses.map((cls) => (
                        <Tab key={cls.name} label={cls.name} value={cls.name} />
                    ))}
                </Tabs>
            </Paper>

            {!classData && currentMainTabValue === false && (
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, textAlign: 'center' }}>
                    <Typography variant="h5">Select a Class</Typography>
                    <Typography variant="body1">
                        Please choose a class from the navigation above to see its details.
                    </Typography>
                </Paper>
            )}

            {classData && (
                <Grid container spacing={3}>
                    {/* === Left Column: Main Class Details (approx 75% width on md+) === */}
                    <Grid item size={{xs:12, md:7, lg:8}}> {/* lg={9} for 75%, md={8} for ~66% */}
                        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 3 }}>
                            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                                {classData.name}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2, mb: 3, textAlign: 'center' }}>
                                <Box>
                                    <Typography variant="overline" display="block" color="text.secondary">Domains</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                        {classData.domains.map(domain => (
                                            <Link href={`/domains/${encodeURIComponent(domain)}`} key={domain} passHref legacyBehavior>
                                                <Chip
                                                    component="a" // Makes the Chip behave like an anchor for NextLink
                                                    label={domain}
                                                    color="primary"
                                                    clickable // MUI prop for visual feedback
                                                    sx={{ '&:hover': { textDecoration: 'none' } }} // Prevent underline on chip if not desired
                                                />
                                            </Link>
                                        ))}
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="overline" display="block" color="text.secondary">Starting Evasion</Typography>
                                    <Typography variant="h6">{classData.startingEvasion}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="overline" display="block" color="text.secondary">Starting Hit Points</Typography>
                                    <Typography variant="h6">{classData.startingHitPoints}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" display="block" color="text.secondary" align="center">Class Items</Typography>
                                <Typography variant="body1" align="center">
                                    {classData.classItems.join(' or ')}
                                </Typography>
                            </Box>
                        </Paper>

                        <FeatureAccordion title="Class Features" features={classData.classFeatures} initiallyExpanded />
                        <FeatureAccordion title="Hope Features" features={classData.hopeFeatures} />
                    </Grid>

                    {/* === Right Column: Subclasses (approx 25% width on md+) === */}
                    <Grid item size={{xs:12, md:5, lg:4}}> {/* lg={3} for 25%, md={4} for ~33% */}
                        {classData.subclasses && classData.subclasses.length > 0 ? (
                            <Paper elevation={2} sx={{
                                p: { xs: 2, md: 2 },
                                position: 'sticky',
                                top: subclassSidebarStickyTop,
                                // Calculate max height to enable scrolling within the sidebar
                                // 100vh - top_offset - some_bottom_padding
                                maxHeight: {
                                    xs: `calc(100vh - ${subclassSidebarStickyTop.xs}px - 24px)`,
                                    sm: `calc(100vh - ${subclassSidebarStickyTop.sm}px - 24px)`
                                },
                                overflowY: 'auto',
                            }}>
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium', mb: 1, px:1 /* Add some padding if Tabs have none */ }}>
                                    Subclasses
                                </Typography>
                                <Tabs
                                    value={selectedSubclassIndex}
                                    onChange={handleSubclassTabChange}
                                    // Make tabs full width if 2 or less, otherwise scrollable
                                    variant={classData.subclasses.length <= 2 ? "fullWidth" : "scrollable"}
                                    scrollButtons="auto"
                                    aria-label="Subclass options"
                                    indicatorColor="primary"
                                    textColor="primary"
                                    sx={{ borderBottom: 1, borderColor: 'divider', mb:0 /* Remove margin if SubclassAccordion handles its top margin/border */ }}
                                >
                                    {classData.subclasses.map((subclass, index) => (
                                        <Tab key={subclass.name} label={subclass.name} value={index} sx={{flexGrow: classData.subclasses.length <=2 ? 1 : undefined }}/>
                                    ))}
                                </Tabs>
                                {/* Display selected subclass accordion */}
                                <Box sx={{ pt: 0 }}> {/* Adjust padding if SubclassAccordion styling changes */}
                                    {classData.subclasses[selectedSubclassIndex] && (
                                        <SubclassAccordion key={currentSubclass.name} subclass={classData.subclasses[selectedSubclassIndex]} />
                                    )}
                                </Box>
                            </Paper>
                        ) : (
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', position: 'sticky', top: subclassSidebarStickyTop }}>
                                <Typography variant="body1" color="text.secondary">No subclasses available for this class.</Typography>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            )}
        </>
    );
}