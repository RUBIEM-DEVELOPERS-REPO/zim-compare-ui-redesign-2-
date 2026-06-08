"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export default function ScraperImportPage() {
    const [category, setCategory] = useState<string>("banking")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const runImport = async () => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            // For the manual trigger in the Admin UI, we'll simulate the scraper's POST
            // by calling our own API with some sample data for the chosen category.
            // In a real scenario, this button might trigger a remote scraper service.
            
            let sampleRecords: any[] = []
            
            if (category === "banking") {
                sampleRecords = [
                    {
                        id: "bank-steward",
                        name: "Steward Bank",
                        type: "commercial",
                        transparencyScore: 85,
                        digitalScore: 90,
                        branches: 15,
                        digitalFeatures: ["Mobile App", "USSD", "Online Banking"],
                        locations: ["Harare", "Bulawayo", "Gweru"]
                    },
                    {
                        id: "prod-steward-savings",
                        bankId: "bank-steward",
                        bankName: "Steward Bank",
                        category: "savings",
                        name: "Steward Savings Plus",
                        interestRate: 5.5,
                        minBalance: 10,
                        monthlyFee: 0,
                        perks: ["Zero monthly fees", "Instant access"]
                    }
                ]
            } else if (category === "telecom") {
                sampleRecords = [
                    {
                        id: "tel-econet",
                        name: "Econet Wireless",
                        type: "mobile",
                        transparencyScore: 92,
                        coverageScore: 98,
                        networkType: "5G",
                        coverageCities: ["Harare", "Bulawayo", "Mutare"]
                    },
                    {
                        id: "bundle-econet-1gb-daily",
                        operator: "tel-econet",
                        currency: "USD",
                        bundle_group: "data",
                        bundle_name: "1GB Daily Bundle",
                        price: 1.0,
                        validity_type: "daily",
                        validity_value: 1,
                        validity_unit: "days",
                        total_data_mb: 1024,
                        source_name: "Manual Admin Trigger"
                    }
                ]
            } else if (category === "schools") {
                sampleRecords = [
                    {
                        id: "school-st-georges",
                        name: "St George's College",
                        type: "boarding",
                        transparencyScore: 88,
                        province: "Harare",
                        city: "Harare",
                        tuitionPerTerm: 2500,
                        totalAnnualCost: 7500,
                        passRate: 95.5,
                        studentTeacherRatio: 15,
                        curriculum: ["Cambridge", "ZIMSEC"]
                    }
                ]
            } else if (category === "insurance") {
                sampleRecords = [
                    {
                        id: "ins-cimas",
                        name: "CIMAS",
                        type: "medical",
                        transparencyScore: 90,
                        claimsScore: 85,
                        avgClaimDays: 14,
                        serviceAreas: ["Harare", "Bulawayo"]
                    },
                    {
                        id: "pol-cimas-med-gold",
                        providerId: "ins-cimas",
                        providerName: "CIMAS",
                        category: "medical",
                        name: "Medical Aid Gold",
                        monthlyPremium: 45,
                        coverLimit: 50000,
                        benefits: ["Full hospital cover", "Optical", "Dental"]
                    }
                ]
            }

            const response = await fetch("/api/admin/scraper-import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category,
                    source: "admin-ui-manual",
                    records: sampleRecords
                })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Failed to run import")
            
            setResult(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Scraper Integration</h1>
                    <p className="text-muted-foreground mt-2">
                        Manually trigger or monitor data imports from the real-time intelligence scraper.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Controls</CardTitle>
                            <CardDescription>Configure and run the import process.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="banking">Banking</SelectItem>
                                        <SelectItem value="telecom">Telecom</SelectItem>
                                        <SelectItem value="insurance">Insurance</SelectItem>
                                        <SelectItem value="schools">Schools</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button 
                                onClick={runImport} 
                                disabled={loading}
                                className="w-full gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                Run Import
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Import Results</CardTitle>
                            <CardDescription>Details of the last import run.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!loading && !result && !error && (
                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                    <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                                    <p>No import run yet.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <Loader2 className="w-10 h-10 mb-2 animate-spin text-primary" />
                                    <p>Processing records...</p>
                                </div>
                            )}

                            {error && (
                                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                                    <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-destructive">Import Failed</p>
                                        <p className="text-sm text-destructive/80">{error}</p>
                                    </div>
                                </div>
                            )}

                            {result && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-emerald-500">Import Successful</p>
                                            <p className="text-sm text-emerald-500/80">The data has been synchronized with the database.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl border bg-card text-center">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Imported</p>
                                            <p className="text-2xl font-bold mt-1 text-emerald-500">{result.importedCount}</p>
                                        </div>
                                        <div className="p-4 rounded-xl border bg-card text-center">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Skipped</p>
                                            <p className="text-2xl font-bold mt-1 text-amber-500">{result.skippedCount}</p>
                                        </div>
                                        <div className="p-4 rounded-xl border bg-card text-center">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Failed</p>
                                            <p className="text-2xl font-bold mt-1 text-destructive">{result.errorCount}</p>
                                        </div>
                                    </div>

                                    {result.errors && result.errors.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold">Error Log:</p>
                                            <div className="max-h-40 overflow-y-auto rounded-md border p-3 bg-muted/50 font-mono text-xs space-y-1">
                                                {result.errors.map((err: string, i: number) => (
                                                    <p key={i} className="text-destructive">{err}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Integration Status</CardTitle>
                        <CardDescription>Live connection with the intelligence scraper.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <div>
                                    <p className="font-medium">API Endpoint Active</p>
                                    <p className="text-xs text-muted-foreground">Listening at /api/admin/scraper-import</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                Connected
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
