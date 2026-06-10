import styles from "./integrations.module.css"

/** Thin trust strip below the hero. */
export function Integrations() {
  return (
    <div className={styles.strip}>
      <div className="container">
        <div className={styles.inner}>
          <span className={styles.item}>
            backed by Context7's <b>live index</b>
          </span>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <span className={styles.item}>runs in Claude Code, Cursor, Windsurf, Zed</span>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <span className={styles.item}>MCP server + skill</span>
        </div>
      </div>
    </div>
  )
}
