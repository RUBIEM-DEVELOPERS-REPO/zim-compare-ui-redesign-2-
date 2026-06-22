import { Policy } from "@/lib/types"

export function scoreInsurancePolicies(selectedPolicies: Policy[]) {
    if (selectedPolicies.length === 0) {
        // Return dummy objects to satisfy type system if empty array passed
        const dummy: Policy = {
            id: "", providerId: "", providerName: "", category: "motor",
            name: "", monthlyPremium: 0, annualPremium: 0, excess: 0,
            waitingPeriodDays: 0, coverLimit: 0, benefits: [], exclusions: [],
            type: "", currency: "USD", isManual: false
        }
        return { 
            scoredPolicies: [], 
            bestOverall: { ...dummy, calculatedScore: 0 }, 
            lowestCost: dummy, 
            bestCoverage: dummy, 
            lowestRisk: dummy 
        }
    }

    const lowestPremium = Math.min(...selectedPolicies.map(p => p.monthlyPremium))
    const lowestExcess = Math.min(...selectedPolicies.map(p => p.excess))
    const lowestCoPay = Math.min(...selectedPolicies.map(p => p.coPay ?? 0))
    const lowestOOP = Math.min(...selectedPolicies.map(p => p.outOfPocketLimit ?? 0))
    const highestCover = Math.max(...selectedPolicies.map(p => p.coverLimit))
    const minWait = Math.min(...selectedPolicies.map(p => p.waitingPeriodDays))
    const minExclusions = Math.min(...selectedPolicies.map(p => p.exclusions.length))
    const maxBenefits = Math.max(...selectedPolicies.map(p => p.benefits.length))

    const scoredPolicies = selectedPolicies.map(p => {
        let score = 0
        // Premiums (lower is better) - 25%
        score += (lowestPremium / p.monthlyPremium) * 25
        // Excess (lower is better) - 15%
        score += (p.excess === 0 ? 1 : (lowestExcess || 1) / (p.excess || 1)) * 15
        // Co-pay (lower is better) - 10%
        score += (p.coPay === 0 ? 1 : (lowestCoPay || 1) / (p.coPay || 1)) * 10
        // OOP Limit (lower is better) - 10%
        score += (p.outOfPocketLimit === 0 ? 1 : (lowestOOP || 1) / (p.outOfPocketLimit || 1)) * 10
        // Coverage Limit (higher is better) - 20%
        score += (p.coverLimit / highestCover) * 20
        // Benefits (more is better) - 10%
        score += (p.benefits.length / (maxBenefits || 1)) * 10
        // Waiting Period (shorter is better) - 5%
        score += (p.waitingPeriodDays === 0 ? 1 : (minWait || 1) / (p.waitingPeriodDays || 1)) * 5
        // Exclusions (fewer is better) - 5%
        score += ((minExclusions || 1) / (p.exclusions.length || 1)) * 5

        return { ...p, calculatedScore: Math.round(score) }
    })

    const bestOverall = scoredPolicies.reduce((prev, curr) => (curr.calculatedScore > prev.calculatedScore ? curr : prev), scoredPolicies[0])
    const lowestCost = selectedPolicies.reduce((prev, curr) => (curr.monthlyPremium < prev.monthlyPremium ? curr : prev), selectedPolicies[0])
    const bestCoverage = selectedPolicies.reduce((prev, curr) => (curr.coverLimit > prev.coverLimit || curr.benefits.length > prev.benefits.length ? curr : prev), selectedPolicies[0])
    const lowestRisk = selectedPolicies.reduce((prev, curr) => ((curr.excess + (curr.outOfPocketLimit ?? 0)) < (prev.excess + (prev.outOfPocketLimit ?? 0)) ? curr : prev), selectedPolicies[0])

    return { scoredPolicies, bestOverall, lowestCost, bestCoverage, lowestRisk }
}
