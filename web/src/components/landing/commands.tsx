import { Link } from "@tanstack/react-router"
import { COMMANDS } from "@/lib/commands"
import { cn } from "@/lib/utils"
import { Section } from "./section"
import styles from "./commands.module.css"

export function Commands() {
  return (
    <Section
      id="commands"
      title="Eight commands. One fetch layer."
      intro="Every command returns agent-ready text or data. Run them from your shell, your editor, or any MCP client."
    >
      <div className={cn("lit", styles.panel)}>
        <div className={styles.head}>
          <span className={styles.prompt}>$</span> ctx --help
        </div>
        <div className={styles.list}>
          {COMMANDS.map((c) => (
            // deep-link the example so the playground lands pre-filled, not empty (1.3)
            <Link key={c.name} to="/playground" search={{ cmd: c.example }} className={styles.row}>
              <span className={styles.name}>{c.name}</span>
              <span className={styles.args}>{c.args}</span>
              <span className={styles.desc}>{c.blurb}</span>
              <span className={styles.go} aria-hidden="true">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  )
}
