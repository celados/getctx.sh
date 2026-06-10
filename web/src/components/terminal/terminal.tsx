import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./terminal.module.css"

type TerminalProps = {
  title?: ReactNode
  meta?: ReactNode
  children: ReactNode
  className?: string
}

/** A lit-edge code/proof block. Color tokens inside via global .t-* classes. */
export function Terminal({ title, meta, children, className }: TerminalProps) {
  return (
    <div className={cn("lit", styles.term, className)}>
      {title || meta ? (
        <div className={styles.head}>
          <span>{title}</span>
          {meta ? <span className={styles.meta}>{meta}</span> : null}
        </div>
      ) : null}
      <pre className={styles.body}>{children}</pre>
    </div>
  )
}
