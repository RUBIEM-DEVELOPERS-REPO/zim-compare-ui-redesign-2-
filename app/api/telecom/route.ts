import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { telecomProviders, dataBundles, voiceRates as mockVoiceRates } from "@/lib/mock/telecoms"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    const where: any = {}
    if (providerId) where.id = providerId

    let providers = await prisma.telecomProvider.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    let bundles = await prisma.dataBundle.findMany({
      orderBy: { price: 'asc' },
    })

    const voiceRateWhere = providerId ? { operator: providerId } : {}

    let voiceRates = await prisma.voiceRate.findMany({
      where: voiceRateWhere,
      orderBy: { price: 'asc' },
    })

    // Fallback to mock data if DB is empty
    if (providers.length === 0) {
      providers = providerId 
        ? telecomProviders.filter(p => p.id === providerId) as any
        : telecomProviders as any
    }
    if (bundles.length === 0) bundles = dataBundles as any
    if (voiceRates.length === 0) voiceRates = mockVoiceRates as any

    return NextResponse.json({ providers, bundles, voiceRates })
  } catch (error: any) {
    console.error("Telecom API Error, falling back to mocks:", error)
    
    // Total fallback in case of connection failure
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    
    const fallbackProviders = providerId 
      ? telecomProviders.filter(p => p.id === providerId) 
      : telecomProviders

    return NextResponse.json({ 
      providers: fallbackProviders, 
      bundles: dataBundles, 
      voiceRates: mockVoiceRates 
    })
  }
}
