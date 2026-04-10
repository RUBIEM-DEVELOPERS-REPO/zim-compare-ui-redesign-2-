"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Role, UserPreference, SavedComparison, ChatMessage, Alert, PricingSnapshot } from "@/lib/types"

interface AppState {
  // Auth
  role: Role
  userName: string
  userEmail: string
  isAuthenticated: boolean
  setRole: (role: Role) => void
  login: (email: string, name: string, role: Role) => void
  logout: () => void

  // Preferences
  preferences: UserPreference
  setPreferences: (prefs: Partial<UserPreference>) => void
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  language: "en" | "sn" | "nd"
  setLanguage: (lang: "en" | "sn" | "nd") => void

  // News Widget
  showNews: boolean
  setShowNews: (show: boolean) => void
  lastNewsSeenDate: string | null
  setLastNewsSeen: (date: string) => void

  // Saved comparisons
  savedComparisons: SavedComparison[]

  addSavedComparison: (c: SavedComparison) => Promise<void>
  removeSavedComparison: (id: string) => Promise<void>

  // Compare tray
  compareTray: { category: string; subcategory?: string; ids: string[]; lastAddedId?: string }
  addToCompareTray: (category: string, id: string, subcategory?: string) => void
  removeFromCompareTray: (id: string) => void
  clearCompareTray: () => void

  // Chat
  chatMessages: ChatMessage[]
  addChatMessage: (msg: ChatMessage) => void
  clearChat: () => void

  // Alerts
  alerts: Alert[]
  setAlerts: (alerts: Alert[]) => void
  addAlert: (a: Alert) => void
  markAlertRead: (id: string) => void

  // Admin
  uploadLogs: PricingSnapshot[]
  addUploadLog: (log: PricingSnapshot) => void

  // Recent views
  recentViews: { category: string; id: string; name: string; timestamp: string }[]
  setRecentViews: (views: { category: string; id: string; name: string; timestamp: string }[]) => void
  addRecentView: (view: { category: string; id: string; name: string }) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: "guest",
      userName: "",
      userEmail: "",
      isAuthenticated: false,
      setRole: (role) => set({ role, isAuthenticated: role !== "guest" }),
      login: (email, name, role) => set({ role, userEmail: email, userName: name, isAuthenticated: true }),
      logout: () => set({ role: "guest", userName: "", userEmail: "", isAuthenticated: false }),

      preferences: {
        scenario: "family",
        priceVsQuality: 50,
        convenienceVsReputation: 50,
        shortTermVsLongTerm: 50,
      },
      setPreferences: (prefs) =>
        set({ preferences: { ...get().preferences, ...prefs } }),

      theme: "system",
      setTheme: (theme) => set({ theme }),
      language: "en",
      setLanguage: (language) => set({ language }),

      showNews: false,
      setShowNews: (showNews) => set({ showNews }),
      lastNewsSeenDate: null,
      setLastNewsSeen: (date) => set({ lastNewsSeenDate: date }),

      savedComparisons: [],

      addSavedComparison: async (c) => {
        // Try calling the API if logged in, fallback to local state regardless
        if (get().isAuthenticated) {
            try {
                // Ignore API prefix and fetch manually, or use apiPost if imported
                // Since this is a store file, we will just use native fetch if api.ts isn't imported
                const res = await fetch('/api/user/comparisons', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('zim_auth_token')}`
                    },
                    body: JSON.stringify({
                        category: c.category,
                        name: c.name,
                        itemIds: c.itemIds
                    })
                })
                if (res.ok) {
                    const data = await res.json()
                    c.id = data.comparison.id
                }
            } catch (e) {
                // Ignore failure
            }
        }
        set({ savedComparisons: [...get().savedComparisons, c] })
      },
      removeSavedComparison: async (id) => {
        if (get().isAuthenticated) {
            try {
                await fetch(`/api/user/comparisons/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('zim_auth_token')}` }
                })
            } catch (e) {
                // Ignore
            }
        }
        set({ savedComparisons: get().savedComparisons.filter((s) => s.id !== id) })
      },

      compareTray: { category: "", subcategory: "", ids: [], lastAddedId: "" },
      addToCompareTray: (category, id, subcategory) => {
        const tray = get().compareTray
        // If switching category or subcategory, clear and start fresh
        if (tray.category !== category || (subcategory && tray.subcategory !== subcategory)) {
          set({ compareTray: { category, subcategory, ids: [id], lastAddedId: id } })
        } else if (!tray.ids.includes(id)) {
          // Limit to max 4 items and ensure uniqueness
          if (tray.ids.length < 4) {
            set({ compareTray: { ...tray, ids: [...tray.ids, id], lastAddedId: id } })
          }
        }
      },
      removeFromCompareTray: (id) => {
        const tray = get().compareTray
        const newIds = tray.ids.filter((i) => i !== id)
        set({
          compareTray: {
            ...tray,
            ids: newIds,
            category: newIds.length === 0 ? "" : tray.category,
            subcategory: newIds.length === 0 ? "" : tray.subcategory
          }
        })
      },
      clearCompareTray: () => set({ compareTray: { category: "", subcategory: "", ids: [] } }),

      chatMessages: [],
      addChatMessage: (msg) => set({ chatMessages: [...get().chatMessages, msg] }),
      clearChat: () => set({ chatMessages: [] }),

      alerts: [
        { id: "a1", type: "price_drop", category: "telecom", itemId: "eco-d3", message: "Econet Monthly 5GB price dropped by 10%", createdAt: "2026-02-05T10:00:00Z", read: false },
        { id: "a2", type: "new_promo", category: "banking", itemId: "stanbic", message: "Stanbic offering zero fees for new accounts this month", createdAt: "2026-02-04T08:00:00Z", read: false },
        { id: "a3", type: "fee_increase", category: "banking", itemId: "fbc", message: "FBC ZIPIT fees increased from $1.50 to $1.80", createdAt: "2026-02-03T12:00:00Z", read: true },
      ],
      setAlerts: (alerts) => set({ alerts }),
      addAlert: (a) => set({ alerts: [a, ...get().alerts] }),
      markAlertRead: (id) =>
        set({ alerts: get().alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) }),

      uploadLogs: [],
      addUploadLog: (log) => set({ uploadLogs: [...get().uploadLogs, log] }),

      recentViews: [],
      setRecentViews: (views) => set({ recentViews: views }),
      addRecentView: (view) => {
        const views = get().recentViews.filter((v) => v.id !== view.id)
        set({
          recentViews: [
            { ...view, timestamp: new Date().toISOString() },
            ...views.slice(0, 9),
          ],
        })
      },
    }),
    { name: "zimcompare-store" }
  )
)
