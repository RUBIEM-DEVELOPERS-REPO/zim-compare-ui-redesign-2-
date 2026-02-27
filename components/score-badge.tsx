import { cn } from "@/lib/utils"

export function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      : score >= 60
        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
        : "bg-red-500/15 text-red-400 border-red-500/20"

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", color)}>
      {score}% {label}
    </span>
  )
}
