"use client"

import React from "react"
import { useParams } from "next/navigation"
import { RegulatorContent } from "../regulator-content"

export default function RegulatorSectionPage() {
    const params = useParams()
    const section = params.section as string

    return (
        <RegulatorContent section={section} />
    )
}
