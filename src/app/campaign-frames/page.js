import { redirect } from 'next/navigation';

// This page component will immediately redirect to a specific campaign frame.
// For example, defaulting to "The Witherwild".
export default function CampaignFramesLandingPage() {
    const defaultCampaignFrameName = "The Witherwild";
    const encodedCampaignFrameName = encodeURIComponent(defaultCampaignFrameName);

    redirect(`/campaign-frames/${encodedCampaignFrameName}`);

    // Note: Content below redirect() will not be rendered.
    // You can optionally return null or a minimal loading message,
    // but redirect() is designed to halt rendering of the current component.
    // return null;
}

// Optional: If you want this page to have some metadata, though it will be transient.
export async function generateMetadata() {
    return {
        title: 'Campaign Frames - Daggerheart | Ki Great Gaming',
        description: 'Exploring Daggerheart campaign frames.',
    };
}