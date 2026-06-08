"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { 
  Role, UserPreference, SavedComparison, ChatMessage, Alert, PricingSnapshot,
  AlertPreference, Transaction, ServiceApplication, PricingUpdate
} from "@/lib/types"

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
  news: { id: string; source: string; title: string; link: string; time: string; tag?: string }[]

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
  chatHistory: { id: string; title: string; messages: ChatMessage[]; timestamp: string }[]
  addChatMessage: (msg: ChatMessage) => void
  saveCurrentSession: () => void
  loadSession: (id: string) => void
  deleteSession: (id: string) => void
  clearChat: () => void

  // Alerts
  alerts: Alert[]
  setAlerts: (alerts: Alert[]) => void
  addAlert: (a: Alert) => void
  markAlertRead: (id: string) => void
  alertPreferences: AlertPreference[]
  setAlertPreference: (category: string, channels: ("in_app" | "sms" | "whatsapp")[], active: boolean) => void
  subscriptionStatus: "basic" | "premium"
  setSubscriptionStatus: (status: "basic" | "premium") => void
  alertCredits: number
  useAlertCredit: () => boolean

  // Transactions
  transactions: Transaction[]
  addTransaction: (tx: Transaction) => void
  
  // Applications
  applications: ServiceApplication[]
  addApplication: (app: ServiceApplication) => void
  updateApplication: (id: string, updates: Partial<ServiceApplication>) => void

  // Admin
  uploadLogs: PricingSnapshot[]
  addUploadLog: (log: PricingSnapshot) => void
  pendingApprovals: PricingUpdate[]
  approveUpdate: (id: string) => void
  rejectUpdate: (id: string) => void
  auditLogs: { id: string; action: string; user: string; timestamp: string; details: string }[]
  addAuditLog: (action: string, user: string, details: string) => void

  // Recent views
  recentViews: { category: string; id: string; name: string; timestamp: string }[]
  setRecentViews: (views: { category: string; id: string; name: string; timestamp: string }[]) => void
  addRecentView: (view: { category: string; id: string; name: string }) => void
 
  // Workspace Navigation
  activeSection: string
  setActiveSection: (section: string) => void

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
        scenario: "personal",
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
      news: [
        { id: "n1", source: "Reserve Bank", title: "New Monetary Policy Framework Announced", link: "#", time: "2h ago", tag: "New" },
        { id: "n2", source: "TechZim", title: "Econet to expand 5G coverage to 10 more cities", link: "#", time: "5h ago", tag: "Promo" },
        { id: "n3", source: "Herald", title: "Banking sector stability report released", link: "#", time: "1d ago" },
      ],

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
      chatHistory: [],
      addChatMessage: (msg) => {
        if (get().chatMessages.some(m => m.id === msg.id)) return
        set({ chatMessages: [...get().chatMessages, msg] })
      },
      saveCurrentSession: () => {
        const messages = get().chatMessages
        if (messages.length === 0) return
        
        const title = messages[0].content.substring(0, 40) + (messages[0].content.length > 40 ? "..." : "")
        const newSession = {
          id: Date.now().toString(),
          title,
          messages: [...messages],
          timestamp: new Date().toISOString()
        }
        set({ 
          chatHistory: [newSession, ...get().chatHistory],
          chatMessages: [] 
        })
      },
      loadSession: (id) => {
        const session = get().chatHistory.find(s => s.id === id)
        if (session) {
          set({ chatMessages: [...session.messages] })
        }
      },
      deleteSession: (id) => {
        set({ chatHistory: get().chatHistory.filter(s => s.id !== id) })
      },
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
      alertPreferences: [],
      setAlertPreference: (category, channels, active) => {
        const current = get().alertPreferences
        const existing = current.find(p => p.category === category)
        if (existing) {
          set({
            alertPreferences: current.map(p => p.category === category ? { ...p, channels, active } : p)
          })
        } else {
          set({
            alertPreferences: [...current, { id: Math.random().toString(36).substr(2, 9), userId: "u1", category, channels, active }]
          })
        }
      },
      subscriptionStatus: "basic",
      setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
      alertCredits: 10,
      useAlertCredit: () => {
        const { alertCredits } = get()
        if (alertCredits > 0) {
          set({ alertCredits: alertCredits - 1 })
          return true
        }
        return false
      },

      transactions: [],
      addTransaction: (tx) => set({ transactions: [tx, ...get().transactions] }),

      applications: [],
      addApplication: (app) => set({ applications: [app, ...get().applications] }),
      updateApplication: (id, updates) => set({
        applications: get().applications.map(app => app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString() } : app)
      }),

      uploadLogs: [],
      addUploadLog: (log) => set({ uploadLogs: [...get().uploadLogs, log] }),

      pendingApprovals: [
        { id: "p1", provider: "CBZ Bank", item: "ZIPIT Fee", old: "$1.50", new: "$1.85", status: "pending", category: "banking", createdAt: new Date().toISOString() },
        { id: "p2", provider: "Econet", item: "Smart Data 5GB", old: "$12.00", new: "$11.00", status: "pending", category: "telecom", createdAt: new Date().toISOString() },
      ],
      approveUpdate: (id) => {
        const update = get().pendingApprovals.find(p => p.id === id)
        if (update) {
          set({
            pendingApprovals: get().pendingApprovals.filter(p => p.id !== id),
            auditLogs: [{
              id: Math.random().toString(36).substr(2, 9),
              action: "APPROVE_PRICE",
              user: get().userName,
              timestamp: new Date().toISOString(),
              details: `Approved ${update.item} for ${update.provider} (${update.old} -> ${update.new})`
            }, ...get().auditLogs]
          })
        }
      },
      rejectUpdate: (id) => {
        const update = get().pendingApprovals.find(p => p.id === id)
        if (update) {
          set({
            pendingApprovals: get().pendingApprovals.filter(p => p.id !== id),
            auditLogs: [{
              id: Math.random().toString(36).substr(2, 9),
              action: "REJECT_PRICE",
              user: get().userName,
              timestamp: new Date().toISOString(),
              details: `Rejected ${update.item} for ${update.provider} (${update.old} -> ${update.new})`
            }, ...get().auditLogs]
          })
        }
      },
      auditLogs: [],
      addAuditLog: (action, user, details) => set({
        auditLogs: [{
          id: Math.random().toString(36).substr(2, 9),
          action,
          user,
          timestamp: new Date().toISOString(),
          details
        }, ...get().auditLogs]
      }),

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
 
      activeSection: "chat",
      setActiveSection: (section) => set({ activeSection: section }),

    }),
    { name: "fintech-store" }
  )
)

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "fintech-store") {
      useAppStore.persist.rehydrate()
    }
  })
}
