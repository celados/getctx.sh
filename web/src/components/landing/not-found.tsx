import { Link } from "@tanstack/react-router"
import { Terminal } from "@/components/terminal/terminal"
import { cn } from "@/lib/utils"
import styles from "./not-found.module.css"

export function NotFound() {
  return (
    <section className={cn("container", styles.wrap)}>
      <Terminal title="ctx · 404" className={styles.term}>
        <span className="t-ok">$</span> ctx read /this-page
        {"\n\n"}
        <span className="t-err">✗ 404 — nothing here</span>
        {"\n"}
        <span className="t-dim"># the page you asked for isn't indexed</span>
      </Terminal>
      <Link to="/" className={styles.home}>
        <span className={styles.arrow}>&larr;</span> back to home
      </Link>
    </section>
  )
}
