import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./section.module.css"

type SectionProps = {
  id?: string
  title?: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ id, title, intro, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("container", styles.section, className)}>
      {title || intro ? (
        <header className={styles.head}>
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          {intro ? <p className={styles.intro}>{intro}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}
