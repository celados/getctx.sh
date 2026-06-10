import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import styles from "./footer.module.css"

type FLink = { label: string; to: string; hash?: string } | { label: string; href: string }
type FGroup = { title: string; links: FLink[] }

const GROUPS: FGroup[] = [
  {
    title: "product",
    links: [
      { label: "Playground", to: "/playground" },
      // hash links route to "/" so they resolve from any page (0.1)
      { label: "Commands", to: "/", hash: "commands" },
      { label: "Pricing", to: "/", hash: "pricing" },
    ],
  },
  {
    title: "resources",
    links: [
      { label: "Docs", to: "/docs" },
      { label: "GitHub", href: "https://github.com/ethan-huo/ctx" },
    ],
  },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={cn("container", styles.inner)}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <span className={styles.mark} aria-hidden="true" />
            ctx
          </div>
          <p className={styles.tag}>
            Fresh context for coding agents. The fetch layer between your agent and the real,
            current source.
          </p>
        </div>

        <div className={styles.cols}>
          {GROUPS.map((g) => (
            <div key={g.title} className={styles.col}>
              <span className={styles.colTitle}>{g.title}</span>
              {g.links.map((l) =>
                "to" in l ? (
                  <Link key={l.label} to={l.to} hash={l.hash} className={styles.link}>
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    {l.label}
                  </a>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={cn("container", styles.bottom)}>
        <span>© 2026 getctx.sh</span>
        <span className={styles.mono}>
          {/* honest framing: ctx fetches at call time, not from a stale index (B3) */}
          <span className={styles.dot} aria-hidden="true" /> live fetch · no training cutoff
        </span>
      </div>
    </footer>
  )
}
