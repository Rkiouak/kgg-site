// This file sets up the basic HTML structure and applies the theme.
import { Inter } from 'next/font/google';
import ThemeRegistry from './ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Ki Great Gaming - Daggerheart compliant content & fiction',
    description: 'TTRPG and Interactive Story content inspired by Daggerheart',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
        </body>
        </html>
    );
}