"use client"

import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function SavedPage() {
  const { savedComparisons, removeSavedComparison, role } = useAppStore()
  const router = useRouter()

  if (role === "guest") {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <h1 className="text-lg font-semibold text-foreground">Saved Comparisons</h1>
        <p className="text-sm text-muted-foreground">Sign in to save and access your comparisons.</p>
        <button
          onClick={() => router.push("/auth")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Saved Comparisons</h1>
        <p className="text-sm text-muted-foreground">Your saved research and comparison sets</p>
      </div>

      {savedComparisons.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">No saved comparisons yet.</p>
          <p className="text-xs text-muted-foreground">
            Add items to compare from the Banking, Telecom, Schools, or Insurance sections, then save your comparison.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {savedComparisons.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded capitalize">{s.category}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{s.itemIds.length} items compared</p>
              <p className="text-xs text-muted-foreground mb-3">Saved {new Date(s.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/${s.category}`)}
                  className="flex-1 rounded-lg bg-primary/10 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => removeSavedComparison(s.id)}
                  className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
