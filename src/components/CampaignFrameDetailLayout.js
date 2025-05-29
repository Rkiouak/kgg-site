'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // For potential future links in referencedEntities
import {
    Typography,
    Box,
    Paper,
    Divider,
    Alert,
    Tabs,
    Tab,
    Chip,
    Grid,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Helper for simple string arrays (e.g., toneAndFeel, themes, touchstones)
const StringListChips = ({ items, title }) => {
    if (!items || items.length === 0) return null;
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h4" sx={{ fontWeight: 'medium', mb: 1 }}>{title}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {items.map(item => <Chip key={item} label={item} />)}
            </Box>
        </Box>
    );
};

// Helper for Principles (Player & GM) and Session Zero Questions
const ParagraphList = ({ items, title }) => {
    if (!items || items.length === 0) return null;
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>{title}</Typography>
            {items.map((item, index) => (
                <Typography key={index} variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {item}
                </Typography>
            ))}
        </Box>
    );
};

// Helper for Guidance Sections
const GuidanceSectionDisplay = ({ sectionData, title }) => {
    if (!sectionData || sectionData.length === 0) return null;
    return (
        <Accordion sx={{mb: 1}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {sectionData.map((group, index) => (
                    <Box key={index} sx={{ mb: 2, '&:last-child': {mb: 0} }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{group.groupTitle}</Typography>
                        {group.description && <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line', fontStyle:'italic' }}>{group.description}</Typography>}
                        {group.contexts && group.contexts.map((context, cIdx) => (
                            <Paper variant="outlined" key={cIdx} sx={{ p: 1.5, my: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>{context.contextName}</Typography>
                                <Typography variant="caption" display="block" paragraph sx={{ whiteSpace: 'pre-line' }}>{context.description}</Typography>
                                {context.questions && context.questions.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Prompts:</Typography>
                                        <List dense disablePadding sx={{pl:1}}>
                                            {context.questions.map((q, qIdx) => <ListItem key={qIdx} sx={{py:0}}><ListItemText primaryTypographyProps={{variant:'caption'}} primary={`• ${q}`} /></ListItem>)}
                                        </List>
                                    </Box>
                                )}
                                {context.referencedEntities && context.referencedEntities.length > 0 && (
                                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', mr:0.5 }}>Referenced:</Typography>
                                        {context.referencedEntities.map(ref => <Chip key={ref} label={ref} size="small" variant="outlined" />)}
                                    </Box>
                                )}
                            </Paper>
                        ))}
                        {group.questions && !group.contexts && group.questions.length > 0 && ( // For groups without contexts but with questions
                            <Box sx={{pl:1, mt:0.5}}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Prompts:</Typography>
                                <List dense disablePadding>
                                    {group.questions.map((q, qIdx) => <ListItem key={qIdx} sx={{py:0}}><ListItemText primaryTypographyProps={{variant:'caption'}} primary={`• ${q}`} /></ListItem>)}
                                </List>
                            </Box>
                        )}
                        {group.referencedEntities && !group.contexts && group.referencedEntities.length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, pl:1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', mr:0.5 }}>Referenced:</Typography>
                                {group.referencedEntities.map(ref => <Chip key={ref} label={ref} size="small" variant="outlined" />)}
                            </Box>
                        )}
                        {index < sectionData.length -1 && <Divider sx={{my:2}}/>}
                    </Box>
                ))}
            </AccordionDetails>
        </Accordion>
    );
};

// Helper for Setting Distinctions and Campaign Mechanics
const KeyValueSectionDisplay = ({ data, title }) => {
    if (!data || Object.keys(data).length === 0) return null;
    return (
        <Accordion sx={{mb: 1}} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {Object.values(data).map((item, index) => (
                    <Paper variant='outlined' key={item.name || index} sx={{ p: 2, mb: 2, '&:last-child': {mb: 0} }}>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>{item.name}</Typography>
                        <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line', mt:1 }}>{item.description}</Typography>
                        {item.featureQuestions && item.featureQuestions.length > 0 && (
                            <Box sx={{mt:1, pl:2}}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Questions:</Typography>
                                <List dense disablePadding>
                                    {item.featureQuestions.map((q, qIdx) => <ListItem key={qIdx} sx={{py:0}}><ListItemText primaryTypographyProps={{variant:'caption', fontStyle:'italic'}} primary={`• ${q}`} /></ListItem>)}
                                </List>
                            </Box>
                        )}
                        {item.notableGods && item.notableGods.length > 0 && (
                            <Box sx={{mt:1, pl:2}}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Notable Gods:</Typography>
                                {item.notableGods.map((god, godIdx) => (
                                    <Box key={godIdx} sx={{my:1}}>
                                        <Typography variant="subtitle2" sx={{fontWeight:'medium'}}>{god.name}</Typography>
                                        <Typography variant="caption" display="block">{god.description}</Typography>
                                    </Box>
                                ))}
                            </Box>)}
                    </Paper>))}
            </AccordionDetails>
        </Accordion>
    );
}


export default function CampaignFrameDetailLayout({ allCampaignFrames, campaignFrameData, currentEncodedCampaignFrameName }) {
    const router = useRouter();

    const handleTabChange = (event, newValue) => { // newValue is the encoded campaign frame name
        if (newValue) {
            router.push(`/campaign-frames/${newValue}`);
        }
    };

    if (!allCampaignFrames || allCampaignFrames.length === 0) {
        return <Alert severity="warning" sx={{ m: 2 }}>No campaign frames available to display in tabs.</Alert>;
    }

    if (!campaignFrameData) {
        return <Alert severity="error" sx={{ m: 2 }}>Selected campaign frame data could not be loaded.</Alert>;
    }

    return (
        <>
            {/* Campaign Frame Selector Tabs */}
            <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: { xs: 56, sm: 64 }, zIndex: 1100, bgcolor: 'background.paper' }}>
                <Tabs
                    value={currentEncodedCampaignFrameName}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="Daggerheart Campaign Frames"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {allCampaignFrames.map((cf) => (
                        <Tab
                            key={cf.name}
                            label={cf.name}
                            value={encodeURIComponent(cf.name)}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Campaign Frame Details Content */}
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    {campaignFrameData.name}
                </Typography>
                <Grid container spacing={1} justifyContent="center" sx={{mb:2}}>
                    <Grid item>
                        <Chip label={`Complexity: ${campaignFrameData.complexityRating || 'N/A'}`} size="small" variant="outlined"/>
                    </Grid>
                    {campaignFrameData.designerCredit && (
                        <Grid item>
                            <Typography variant="caption" color="text.secondary">Credit: {campaignFrameData.designerCredit}</Typography>
                        </Grid>
                    )}
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Box sx={{my:3}}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>Pitch</Typography>
                    <Typography variant="body1" paragraph sx={{whiteSpace: 'pre-line', fontStyle:'italic'}}>{campaignFrameData.pitch}</Typography>
                </Box>

                <Grid container spacing={2} sx={{mb:2}}>
                    <Grid item xs={12} md={4}><StringListChips items={campaignFrameData.toneAndFeel} title="Tone & Feel" /></Grid>
                    <Grid item xs={12} md={4}><StringListChips items={campaignFrameData.themes} title="Themes" /></Grid>
                    <Grid item xs={12} md={4}><StringListChips items={campaignFrameData.touchstones} title="Touchstones" /></Grid>
                </Grid>

                <Accordion defaultExpanded sx={{mb:1}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">Overview</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" paragraph sx={{whiteSpace: 'pre-line'}}>{campaignFrameData.overview}</Typography>
                    </AccordionDetails>
                </Accordion>

                {campaignFrameData.guidanceSections && (
                    <Box sx={{my:3}}>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Guidance Sections</Typography>
                        <GuidanceSectionDisplay sectionData={campaignFrameData.guidanceSections.communities} title="Communities" />
                        <GuidanceSectionDisplay sectionData={campaignFrameData.guidanceSections.ancestries} title="Ancestries" />
                        <GuidanceSectionDisplay sectionData={campaignFrameData.guidanceSections.classes} title="Classes" />
                    </Box>
                )}

                <ParagraphList items={campaignFrameData.playerPrinciples} title="Player Principles" />
                <ParagraphList items={campaignFrameData.gmPrinciples} title="GM Principles" />

                <KeyValueSectionDisplay data={campaignFrameData.settingDistinctions} title="Setting Distinctions" />

                {campaignFrameData.incitingIncident && (
                    <Accordion sx={{mb:1}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h5">Inciting Incident</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1" paragraph sx={{whiteSpace: 'pre-line'}}>{campaignFrameData.incitingIncident}</Typography>
                        </AccordionDetails>
                    </Accordion>
                )}

                <KeyValueSectionDisplay data={campaignFrameData.campaignMechanics} title="Campaign Mechanics" />
                <ParagraphList items={campaignFrameData.sessionZeroQuestions} title="Session Zero Questions" />

            </Paper>
        </>
    );
}