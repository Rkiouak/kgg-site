// This component renders the site footer.
import React from 'react';
import {
    Typography,
    Container,
    Box,
    Link as MuiLink,
} from '@mui/material';

// Helper function to get current year for footer
const getCurrentYear = () => new Date().getFullYear();

export default function SiteFooter() {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', color: 'text.secondary', py: 6, borderTop: 1, borderColor: 'divider' }}>
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    © {getCurrentYear()} Matt Rkiouak. All original site design and non-SRD content.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    This website is an unofficial fan content compliant with the Daggerheart system.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Operates under the Darrington Press Community Gaming License. View the license at <MuiLink href="https://darringtonpress.com/license/" target="_blank" rel="noopener noreferrer">darringtonpress.com/license</MuiLink>.
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Daggerheart™ and all related Daggerheart marks and logos are trademarks of Critical Role, LLC. Daggerheart System Reference Document 1.0 © Critical Role, LLC.
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Last Updated: 2025-05-28. You can contact the site author at <a href={"mailto:mrkiouak@gmail.com"}>mrkiouak@gmail.com</a>
                </Typography>
            </Container>
        </Box>
    );
}