"use client"

import { Shield, Wrench, CheckCircle } from "lucide-react"

const maintenanceSchedule = [
    { period: "Monthly", task: "Visual inspection of panels for dirt/debris", cost: "Free (DIY)", priority: "high" },
    { period: "Quarterly", task: "Panel cleaning with soft cloth and water", cost: "$20–$50", priority: "high" },
    { period: "6 Months", task: "Battery health check and terminal cleaning", cost: "$30–$60", priority: "medium" },
    { period: "Annually", task: "Full system inspection by certified technician", cost: "$80–$150", priority: "high" },
    { period: "2–3 Years", task: "Inverter firmware update and performance audit", cost: "$50–$100", priority: "medium" },
    { period: "5 Years", task: "Battery replacement (if lead-acid)", cost: "$300–$800", priority: "high" },
    { period: "10 Years", task: "Inverter replacement check", cost: "$400–$1200", priority: "medium" },
    { period: "20–25 Years", task: "Panel replacement (end of warranty)", cost: "Varies", priority: "low" },
]

const warrantyComparison = [
    { provider: "SunPower Zimbabwe", panels: 20, inverter: 10, battery: 5, installation: 2 },
    { provider: "SolarTech Zimbabwe", panels: 10, inverter: 5, battery: 3, installation: 2 },
    { provider: "Greenergy Solutions", panels: 5, inverter: 3, battery: 2, installation: 1 },
    { provider: "AquaWell Drilling", panels: 0, inverter: 0, battery: 0, installation: 3 },
    { provider: "WaterWise Zimbabwe", panels: 0, inverter: 0, battery: 0, installation: 2 },
]

const priorityColors: Record<string, string> = {
    high: "bg-red-500/10 text-red-600 dark:text-red-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

export function SolarMaintenance() {
    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Wrench className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Maintenance & Warranty Guide</p>
                </div>
                <p className="text-xs text-muted-foreground">Keep your solar or borehole system running at peak performance with this maintenance schedule.</p>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-primary" /> Recommended Maintenance Schedule
                    </h3>
                </div>
                <div className="divide-y divide-border">
                    {maintenanceSchedule.map((item, i) => (
                        <div key={i} className="flex items-start gap-4 px-5 py-3 hover:bg-secondary/30 transition-colors">
                            <div className="w-20 shrink-0">
                                <span className="text-xs font-medium text-foreground">{item.period}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-foreground">{item.task}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Est. cost: {item.cost}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${priorityColors[item.priority]}`}>
                                {item.priority}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" /> Warranty Comparison by Provider
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-border bg-secondary/30">
                                <th className="px-5 py-3 text-left text-muted-foreground font-medium">Provider</th>
                                <th className="px-4 py-3 text-center text-muted-foreground font-medium">Panels</th>
                                <th className="px-4 py-3 text-center text-muted-foreground font-medium">Inverter</th>
                                <th className="px-4 py-3 text-center text-muted-foreground font-medium">Battery</th>
                                <th className="px-4 py-3 text-center text-muted-foreground font-medium">Installation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {warrantyComparison.map((row) => (
                                <tr key={row.provider} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-5 py-3 font-medium text-foreground">{row.provider}</td>
                                    {[row.panels, row.inverter, row.battery, row.installation].map((years, i) => (
                                        <td key={i} className="px-4 py-3 text-center">
                                            {years > 0 ? (
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${years >= 10 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : years >= 5 ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                                                    <CheckCircle className="w-2.5 h-2.5" /> {years}yr
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
                    <p className="text-xs font-medium text-foreground mb-1">Tip: Panel Cleaning</p>
                    <p className="text-xs text-muted-foreground">Clean panels in the early morning before they heat up. Use soft cloth and clean water — avoid abrasive materials.</p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <Shield className="w-5 h-5 text-amber-500 mb-2" />
                    <p className="text-xs font-medium text-foreground mb-1">Warranty Tip</p>
                    <p className="text-xs text-muted-foreground">Always register your system with the manufacturer within 30 days of installation to activate full warranty coverage.</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <Wrench className="w-5 h-5 text-primary mb-2" />
                    <p className="text-xs font-medium text-foreground mb-1">Annual Inspection</p>
                    <p className="text-xs text-muted-foreground">Schedule annual inspections with your installer. Many providers offer service contracts at $100–$200/year.</p>
                </div>
            </div>
        </div>
    )
}

