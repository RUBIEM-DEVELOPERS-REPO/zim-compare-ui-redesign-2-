import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const providers = await prisma.insuranceProvider.findMany({
      orderBy: {
        isManual: "desc",
      },
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.error("Failed to fetch insurance providers:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}
