/**
 * Universal Data Ingestion Script
 * This script runs all scrapers and posts the data to the bulk-import API.
 * Run with: npx ts-node scripts/import-all-scraped-data.ts
 */

import { scrapeTelecomBundles } from '../lib/scrapers/telecom-scraper';
import { 
    scrapeSchools, 
    scrapeInsurance, 
    scrapeMobility, 
    scrapeHotels, 
    scrapeSolar, 
    scrapeUtilities 
} from '../lib/scrapers/all-scrapers';

const API_BASE = 'http://localhost:3000/api/admin/bulk-import';

async function importData(category: string, data: any) {
    console.log(`[Import] Posting ${category} data...`);
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, data })
        });
        
        const result = await response.json();
        if (response.ok) {
            console.log(`[Success] ${category}: ${result.recordCount} records imported, ${result.failed} failed`);
            if (result.failed > 0 && result.errors) {
                console.error(`[Errors] ${category} first few:`, result.errors);
            }
        } else {
            console.error(`[Error] ${category}:`, result.error || result.message || JSON.stringify(result));
        }
    } catch (err) {
        console.error(`[Fatal] Failed to post ${category}:`, err);
    }
}

async function main() {
    console.log('--- Starting Universal Data Import ---');

    // 1. Telecom
    const telecomData = await scrapeTelecomBundles();
    await importData('telecom', telecomData);

    // 2. Schools
    const schoolData = await scrapeSchools();
    await importData('schools', schoolData);

    // 3. Insurance
    const insuranceData = await scrapeInsurance();
    await importData('insurance', insuranceData);

    // 4. Mobility
    const mobilityData = await scrapeMobility() as any;
    // Mobility is complex, it has sub-categories, but API expects a flat array
    const flattenedMobility = [
        ...(mobilityData.vehicles || []),
        ...(mobilityData.dealerships || []),
        ...(mobilityData.busRoutes || []),
        ...(mobilityData.drivingSchools || [])
    ];
    await importData('mobility', flattenedMobility);

    // 5. Hotels
    const hotelData = await scrapeHotels();
    await importData('hotels', hotelData);

    // 6. Solar
    const solarData = await scrapeSolar();
    await importData('solar', solarData);

    // 7. Utilities
    const utilityData = await scrapeUtilities();
    await importData('utilities', utilityData);

    console.log('--- Import Complete ---');
}

main().catch(console.error);
