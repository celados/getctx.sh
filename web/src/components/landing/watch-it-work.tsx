import { Fragment } from "react"
import { TerminalPlayer } from "@/components/playground/terminal-player"
import { FLOWS } from "@/lib/playground-flows"
import { Section } from "./section"
import styles from "./watch-it-work.module.css"

// The three-card "how it works" is gone; the player itself is the explanation.
// This legend just names the moves the player makes (1.1).
const LEGEND = [
  { k: "search", t: "find the right library" },
  { k: "docs", t: "scope to the topic" },
  { k: "read", t: "pull the full document" },
]

export function WatchItWork() {
  return (
    <Section
      id="how"
      title="Watch it work."
      intro="This is how an agent actually uses ctx: search to find the library, docs to scope the topic, read to pull the full document. Real output, no narration."
    >
      {/* one flow, autoplays once when it scrolls into view (1.1) */}
      <TerminalPlayer
        flows={[FLOWS[0]]}
        compact
        autoplay="view"
        cta={{ label: "open the playground", to: "/playground" }}
      />

      <div className={styles.legend}>
        {LEGEND.map((s, i) => (
          <Fragment key={s.k}>
            <div className={styles.step}>
              <span className={styles.cmd}>ctx {s.k}</span>
              <span className={styles.desc}>{s.t}</span>
            </div>
            {i < LEGEND.length - 1 ? (
              <span className={styles.arrow} aria-hidden="true">
                &rarr;
              </span>
            ) : null}
          </Fragment>
        ))}
      </div>

      <p className={styles.note}>
        <span className={styles.tag}>today</span> docs from Context7's live index, pages through a
        headless browser.
        <span className={styles.tag}>soon</span> a first-party getctx API, so nothing is stitched.
      </p>
    </Section>
  )
}
