import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import styles from "./lines.module.css"

/** Single source of truth for terminal output coloring (4.3). Hero, problem, and
 * the playground all classify lines the same way, so the rules can't drift. */
export function classifyLine(line: string): string | undefined {
  const t = line.trimStart()
  if (t.startsWith("[ctx:summary]")) return styles.summary
  if (t.startsWith("##")) return styles.subhead
  if (t.startsWith("#")) return styles.head
  if (/^\d+\.\s/.test(t)) return styles.lib
  if (t.startsWith("//")) return styles.comment
  if (
    t.startsWith("Searched:") ||
    t.startsWith("Use ctx") ||
    t.startsWith("Use `ctx") ||
    t.startsWith("---") ||
    t.startsWith("…") ||
    t.startsWith("Read sections") ||
    t.startsWith("Next:")
  )
    return styles.dim
  if (t.startsWith("-")) return styles.bullet
  if (/snippets:|score:|trust:/.test(t)) return styles.meta
  return undefined
}

type Props = {
  text: string
  /** animate lines in with a stagger (off for static blocks) */
  animate?: boolean
  reduce?: boolean | null
  /** flash the line(s) containing this substring — "the doc the agent picks" */
  flash?: string
}

export function TerminalLines({ text, animate, reduce, flash }: Props) {
  return text.split("\n").map((line, i) => {
    const cls = cn(classifyLine(line), flash && line.includes(flash) && styles.flash)
    if (!animate || reduce) {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className={cls}>
          {line || " "}
        </div>
      )
    }
    return (
      <motion.div
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.25,
          delay: Math.min(i * 0.022, 0.5),
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cls}
      >
        {line || " "}
      </motion.div>
    )
  })
}
