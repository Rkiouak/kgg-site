import React from 'react';
import {
    Typography,
    Container,
    Box,
    Paper,
    Link as MuiLink,
} from '@mui/material';

export default function LicenseAndAttributionSection() {
    return (
        <Box component="section" id="license" sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.paper' }}>
                    <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb:3 }}>
                        License and Attribution
                    </Typography>

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            component="img"
                            src="/DH_CGL_logos_final_full_color.svg"
                            alt="Daggerheart Community Gaming License Logo"
                            sx={{ mx: 'auto', mb: 1, height: {xs: 60, sm: 80}, width: 'auto', maxWidth: '250px' }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Daggerheart Compatible Content
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        This website, Ki Great Gaming, includes materials from the <strong>Daggerheart System Reference Document 1.0</strong>, © Critical Role, LLC. All rights reserved. This content is used under the terms of the <strong>Darrington Press Community Gaming License (DPCGL)</strong>.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        More information about Daggerheart can be found at <MuiLink href="https://www.daggerheart.com" target="_blank" rel="noopener noreferrer">https://www.daggerheart.com</MuiLink>.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        This website adapts and presents the Daggerheart System Reference Document 1.0 for ease of online access and searchability. The original SRD content is Public Game Content, used as provided by Darrington Press, without previous third-party modifications to the source material that this site is building upon.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        The full Darrington Press Community Gaming License can be found at: <MuiLink href="https://darringtonpress.com/license/" target="_blank" rel="noopener noreferrer">https://darringtonpress.com/license/</MuiLink>.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        Darrington Press™ and the Darrington Press authorized work logo are trademarks of Critical Role, LLC and used with permission.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        This website and its content are not sponsored by or endorsed by Darrington Press or Critical Role. It is an unofficial fan-created resource.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}