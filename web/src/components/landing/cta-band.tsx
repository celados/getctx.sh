import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { InstallPill } from "./install-pill"
import styles from "./cta-band.module.css"

export function CtaBand() {
  return (
    <section className={styles.band}>
      <div className={cn("container", styles.inner)}>
        <h2 className={styles.title}>
          Give your agent a source of truth<span className={styles.dot}>.</span>
        </h2>
        <p className={styles.sub}>Install in ten seconds. No signup.</p>
        <InstallPill emphasis className={styles.pill} />
        <Link to="/playground" className={styles.secondary}>
          or try it in the browser&nbsp;&rarr;
        </Link>
      </div>
    </section>
  )
}
