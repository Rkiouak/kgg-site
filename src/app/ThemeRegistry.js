// This file defines and provides the Material UI theme to the application.
'use client';
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// Updated light theme with text colors harmonized with the KGG logo
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3483C4', // KGG Logo Spirit Blue (Teal/Cyan elements in logo are accents)
        },
        secondary: {
            main: '#2A5F9E', // KGG Logo Darker Spirit Blue
        },
        background: {
            default: '#ffffff',
            paper: '#f7f9fc',
        },
        text: {
            primary: '#212121',   // Very Dark Gray / Off-Black (harmonizing with KGG logo's own text)
            secondary: '#616161', // Medium-Dark Gray for secondary text
        },
        divider: 'rgba(0, 0, 0, 0.12)',
        action: {
            hover: 'rgba(52, 131, 196, 0.08)',
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        // Update typography to use new text colors
        h1: { fontWeight: 700, color: '#212121' },
        h2: { fontWeight: 700, color: '#212121' },
        h3: { fontWeight: 600, color: '#212121' },
        h4: { fontWeight: 700, color: '#212121' }, // Used for Page Titles
        h5: { fontWeight: 700, color: '#212121' }, // Used for Site Title in Header
        h6: { fontWeight: 600, color: '#212121' }, // Used for Accordion Summaries
        body1: { color: '#212121' }, // Main body text
        body2: { color: '#616161' }, // Secondary body text (e.g., descriptions)
        caption: { color: '#616161'},
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                    fontWeight: 600,
                },
                containedPrimary: {
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#2A5F9E',
                    },
                },
                outlinedPrimary: {
                    borderColor: '#3483C4',
                    color: '#3483C4',
                    '&:hover': {
                        backgroundColor: 'rgba(52, 131, 196, 0.08)',
                        borderColor: '#2A5F9E',
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#3483C4', // Links remain blue
                    textDecoration: 'underline',
                    '&:hover': {
                        color: '#2A5F9E',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f7f9fc',
                    boxShadow: '0 2px 4px -1px rgba(0,0,0,0.10)'
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: 'background.paper', // Use paper color for accordions
                    '&:before': {
                        display: 'none', // Remove default top border
                    },
                    '&$expanded': {
                        margin: 'auto',
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    // backgroundColor: 'rgba(0, 0, 0, .03)', // Slightly different background for summary
                    borderBottom: '1px solid rgba(0, 0, 0, .125)',
                    marginBottom: -1,
                    minHeight: 56,
                    '&$expanded': {
                        minHeight: 56,
                    },
                },
                content: {
                    '&$expanded': {
                        margin: '12px 0',
                    },
                },
            },
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    margin: '4px',
                }
            }
        }
    },
});

export default function ThemeRegistry({ children, options }) {
    return (
        <AppRouterCacheProvider options={options || { key: 'mui' }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
