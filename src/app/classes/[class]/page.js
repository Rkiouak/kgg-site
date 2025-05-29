import React from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@mui/material'; // Only Container needed from MUI here
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ClassDetailLayout from '../../../components/ClassDetailLayout';
import DruidBeastformOptions from '../../../components/DruidBeastformOptions'; // Import the new component

// Assume getAllClassesForStaticGeneration and getClassData are defined in this file or imported correctly
// For brevity, their definitions are omitted here but should be present as before.
async function getAllClassesForStaticGeneration() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL+'/api/dh/classes';
    try {
        const res = await fetch(apiUrl, { cache: 'force-cache' });
        if (!res.ok) {
            console.error(`BUILD ERROR: Failed to fetch classes for generateStaticParams: ${res.status} ${res.statusText} from ${apiUrl}. Ensure API is available during build.`);
            throw new Error(`Failed to fetch class list for static generation from ${apiUrl}. Status: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error(`API at ${apiUrl} did not return an array for class list.`);
        }
        return data;
    } catch (error) {
        console.error('BUILD CRITICAL ERROR fetching classes data for generateStaticParams:', error);
        throw new Error(`Critical error fetching class list: ${error.message}`);
    }
}

export async function generateStaticParams() {
    let classes = [];
    try {
        classes = await getAllClassesForStaticGeneration();
    } catch (error) {
        console.error("generateStaticParams: Failed to get class list, build will likely fail or generate no class pages.", error);
        return [];
    }

    if (!classes || classes.length === 0) {
        console.warn("generateStaticParams: No classes found from API. No static class pages will be generated. Check API availability and response during build.");
        return [];
    }

    return classes.map((cls) => {
        if (!cls || typeof cls.name !== 'string' || cls.name.trim() === '') {
            console.warn("generateStaticParams: Found a class object without a valid 'name' property, skipping:", cls);
            return null;
        }
        return {
            class: encodeURIComponent(cls.name),
        };
    }).filter(Boolean);
}

export async function generateMetadata(props) {
    const params = await props.params;
    const decodedClassName = params.class ? decodeURIComponent(params.class) : "Class";
    return {
        title: `${decodedClassName} - Daggerheart Class | Ki Great Gaming`,
        description: `Explore the details of the ${decodedClassName} class in Daggerheart.`,
    };
}

async function getClassData(classNameParam, allClasses) { // classNameParam is encoded
    const decodedClassName = decodeURIComponent(classNameParam);
    return allClasses.find(c => c.name === decodedClassName);
}

// This default export is the Server Component for the page
export default async function ClassDetailPage(props) {
    const params = await props.params;
    const { class: classNameParam } = params; // classNameParam is URL-encoded
    const decodedClassName = decodeURIComponent(classNameParam); // Decode for display and conditional logic

    const allClasses = await getAllClassesForStaticGeneration();
    const classData = await getClassData(classNameParam, allClasses); // getClassData handles decoding

    if (!classData) {
        // This console.warn should use decodedClassName for better logging if classNameParam is encoded
        console.warn(`Class data not found for param: ${classNameParam} (decoded: ${decodedClassName})`);
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                {/* ClassDetailLayout is a client component handling main class details & subclass tabs */}
                <ClassDetailLayout classData={classData} allClasses={allClasses} />

                {decodedClassName === 'Druid' && <DruidBeastformOptions />}
            </Container>
            <SiteFooter />
        </>
    );
}