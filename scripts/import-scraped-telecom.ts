/**
 * Sample script to import scraped telecom data into ZimCompare.
 * Usage: npx tsx scripts/import-scraped-telecom.ts
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function importTelecomData() {
    console.log(`🚀 Starting telecom data import to ${BASE_URL}...`);

    const data = [
        // Data Bundle Example
        {
            "Operator": "Econet Wireless",
            "Bundle Name": "Neural Daily 2GB",
            "Price": 2.50,
            "Total Data (MB)": 2048,
            "Validity Value": "1",
            "Validity Unit": "days",
            "Category": "daily",
            "USSD Code": "*143#",
            "Source URL": "https://www.econet.co.zw/bundles"
        },
        // Voice Plan Example (detected by 'Rate Per Min' or 'On-Net Minutes')
        {
            "Operator": "NetOne",
            "Plan Name": "OneFusion Voice Ultra",
            "Rate Per Min": 0.08,
            "On-Net Minutes": 100,
            "Off-Net Minutes": 20,
            "SMS Count": 50,
            "Type": "prepaid",
            "Group": "voice",
            "USSD Code": "*111#"
        },
        // Another Data Bundle
        {
            "Operator": "Telecel",
            "Bundle Name": "Weekly Mega Data",
            "Price": 5.00,
            "Data GB": 4,
            "Validity Value": "7",
            "Validity Unit": "days",
            "Category": "weekly",
            "Source Name": "Telecel Website"
        }
    ];

    try {
        const response = await fetch(`${BASE_URL}/api/admin/bulk-import`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category: "telecom",
                data: data
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log("✅ Import Successful!");
        console.log(`📊 Records Inserted/Updated: ${result.recordCount}`);
        if (result.failed > 0) {
            console.warn(`⚠️ Failed Rows: ${result.failed}`);
            console.warn("Errors:", result.errors);
        }
    } catch (error) {
        console.error("❌ Import Failed:", error);
    }
}

importTelecomData();
