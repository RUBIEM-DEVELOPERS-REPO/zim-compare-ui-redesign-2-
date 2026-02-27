"use client"

import { useAppStore } from "@/lib/store"
import en from "./locales/en.json"
import sn from "./locales/sn.json"
import nd from "./locales/nd.json"

const locales: Record<string, any> = { en, sn, nd }

export function useI18n() {
    const { language } = useAppStore()
    const locale = locales[language] || en

    const t = (path: string, variables?: Record<string, string | number>) => {
        let text = path.split(".").reduce((obj, key) => obj?.[key], locale) || path
        if (variables) {
            Object.entries(variables).forEach(([key, value]) => {
                text = text.replace(`{{${key}}}`, String(value))
            })
        }
        return text
    }

    return { t, language }
}
