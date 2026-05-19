export type ScrapedBundle = {
    operator: string
    currency: string
    bundle_group: string
    bundle_name: string
    price: number
    validity_type: string
    validity_value: number
    validity_unit: string
    total_data_mb: number
    source_url: string
    source_name: string
}

export async function scrapeTelecomBundles(): Promise<ScrapedBundle[]> {
    // This is temporary test scraper data.
    // Later we will replace this with real website scraping logic.

    return [
        {
            operator: "econet",
            currency: "USD",
            bundle_group: "data",
            bundle_name: "Test 1GB Daily Bundle",
            price: 1,
            validity_type: "daily",
            validity_value: 1,
            validity_unit: "days",
            total_data_mb: 1024,
            source_url: "https://example.com",
            source_name: "Test Scraper"
        },
        {
            operator: "netone",
            currency: "USD",
            bundle_group: "data",
            bundle_name: "Test 2GB Weekly Bundle",
            price: 3,
            validity_type: "weekly",
            validity_value: 7,
            validity_unit: "days",
            total_data_mb: 2048,
            source_url: "https://example.com",
            source_name: "Test Scraper"
        },
        {
            operator: "telecel",
            currency: "USD",
            bundle_group: "data",
            bundle_name: "Test 500MB Daily Bundle",
            price: 0.5,
            validity_type: "daily",
            validity_value: 1,
            validity_unit: "days",
            total_data_mb: 500,
            source_url: "https://example.com",
            source_name: "Test Scraper"
        }
    ]
}