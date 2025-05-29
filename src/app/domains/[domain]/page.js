import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material';
import SiteHeader from '../../../components/SiteHeader';         // Adjust path
import SiteFooter from '../../../components/SiteFooter';         // Adjust path
import DomainDetailLayout from '../../../components/DomainDetailLayout'; // Adjust path

// Fetch all unique domain names
async function getAllDomainNames() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/dh/domains';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch domain names: ${res.status} ${res.statusText} from ${apiUrl}.`);
            throw new Error(`Failed to fetch domain name list. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data) || !data.every(item => typeof item === 'string')) {
            throw new Error(`API at ${apiUrl} did not return an array of strings for domain names.`);
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching domain names:', error);
        throw new Error(`Critical error fetching domain name list: ${error.message}`);
    }
}

// Fetch cards for a specific domain
async function getDomainCards(encodedDomainName) {
    // The API endpoint expects the decoded domain name in the path typically
    const decodedDomainName = decodeURIComponent(encodedDomainName);
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/dh/domains/${decodedDomainName}/cards`;
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' }); // Use 'force-cache' for SSG
        if (!res.ok) {
            console.error(`Failed to fetch cards for domain "${decodedDomainName}": ${res.status} ${res.statusText} from ${apiUrl}.`);
            // Return empty array or throw error if domain might legitimately have no cards vs. an API error
            // For now, assume an error in fetching means data is unavailable.
            if (res.status === 404) return []; // Domain might exist but have no cards (or endpoint implies cards always exist)
            throw new Error(`Failed to fetch cards for domain ${decodedDomainName}. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for domain cards.`);
        }
        return data;
    } catch (error) {
        console.error(`Error fetching cards for domain "${decodedDomainName}":`, error);
        // Return empty array on error to allow page to render with "no cards" message
        return [];
    }
}

export async function generateStaticParams() {
    let domainNames = [];
    try {
        domainNames = await getAllDomainNames();
    } catch (error) {
        console.error("generateStaticParams (domains): Failed to get domain names. No pages will be generated.", error.message);
        return [];
    }

    if (!domainNames || domainNames.length === 0) {
        console.warn("generateStaticParams (domains): No domain names found. No static pages will be generated.");
        return [];
    }

    return domainNames.map((domainName) => {
        if (typeof domainName !== 'string' || domainName.trim() === '') {
            console.warn("generateStaticParams (domains): Invalid domain name found, skipping:", domainName);
            return null;
        }
        return {
            domain: encodeURIComponent(domainName), // `domain` matches folder name [domain]
        };
    }).filter(Boolean);
}

export async function generateMetadata(props) {
    const params = await props.params;
    const decodedDomainName = params.domain ? decodeURIComponent(params.domain) : "Domain";
    return {
        title: `${decodedDomainName} Domain - Daggerheart Cards | Ki Great Gaming`,
        description: `Explore cards from the ${decodedDomainName} domain in Daggerheart.`,
    };
}

export default async function DomainDetailPage(props) {
    const params = await props.params;
    const { domain: encodedDomainNameParam } = params; // URL-encoded from path

    const allDomainNames = await getAllDomainNames();
    const domainCards = await getDomainCards(encodedDomainNameParam);

    const decodedDomainName = decodeURIComponent(encodedDomainNameParam);

    // Check if the current domain from params actually exists in the fetched list of domain names
    if (!allDomainNames.includes(decodedDomainName)) {
        console.warn(`Domain "${decodedDomainName}" from URL param not found in the list of fetched domains.`);
        notFound(); // Or handle as a domain that might have no cards but the domain itself is valid if API implies that
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                <DomainDetailLayout
                    allDomainNames={allDomainNames}
                    domainCards={domainCards}
                    currentDomainName={decodedDomainName} // Pass decoded for display titles
                    currentEncodedDomainName={encodedDomainNameParam} // Pass encoded for tab value matching
                />
            </Container>
            <SiteFooter />
        </>
    );
}