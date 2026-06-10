import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./site-header.module.css"

export function SiteHeader() {
  // hairline + blur appear only after scrolling, so the top edge stays clean (4.4)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <div className={cn("container", styles.inner)}>
        <Link to="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true" />
          ctx
        </Link>
        <nav className={styles.nav}>
          {/* hash links must route to "/" so they work from /playground too (0.1) */}
          <Link to="/" hash="commands" className={cn(styles.link, styles.collapse)}>
            Commands
          </Link>
          <Link to="/" hash="pricing" className={cn(styles.link, styles.collapse)}>
            Pricing
          </Link>
          <Link to="/playground" className={styles.link} activeProps={{ "data-active": "true" }}>
            Playground
          </Link>
          <a
            href="https://github.com/ethan-huo/ctx"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
