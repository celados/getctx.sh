import { useState } from "react"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  className?: string
  idle?: string
  done?: string
}

/** Copies `value` to the clipboard with a brief confirmation swap. */
export function CopyButton({
  value,
  className,
  idle = "copy",
  done = "✓ copied",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function onClick() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard unavailable (e.g. insecure context) — no-op
    }
  }

  return (
    <button
      type="button"
      className={cn(className)}
      onClick={onClick}
      data-copied={copied ? "" : undefined}
      aria-label={copied ? "copied to clipboard" : "copy to clipboard"}
    >
      {copied ? done : idle}
    </button>
  )
}
