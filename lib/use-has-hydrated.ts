"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"

/**
 * Returns true only after Zustand's persist middleware has finished
 * rehydrating from localStorage. Use this to gate any role-based
 * redirects so they don't fire on stale "guest" state.
 */
export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    // If the store has already rehydrated synchronously (e.g., on client nav)
    // this will fire immediately; otherwise it waits for the onFinishHydration callback.
    const unsub = useAppStore.persist.onFinishHydration(() => {
      setHasHydrated(true)
    })

    // Also check immediately in case rehydration already happened
    if (useAppStore.persist.hasHydrated()) {
      setHasHydrated(true)
    }

    return () => unsub()
  }, [])

  return hasHydrated
}
