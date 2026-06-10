import { INSTALL_CMD } from "@/lib/install"
import { cn } from "@/lib/utils"
import { Section } from "./section"
import styles from "./pricing.module.css"

export function Pricing() {
  return (
    <Section
      id="pricing"
      title="Free to start. An API when you outgrow it."
      intro="The CLI is free for individual use. A first-party API with higher limits and team keys is on the way."
    >
      <div className={styles.split}>
        <div className={cn("lit", styles.card)}>
          <div className={styles.cardHead}>
            <span className={styles.plan}>ctx CLI</span>
            <span className={styles.price}>free</span>
          </div>
          <ul className={styles.feats}>
            <li>
              <span className="t-ok">✓</span> all eight commands
            </li>
            <li>
              <span className="t-ok">✓</span> docs, read, screenshot, scrape, crawl
            </li>
            <li>
              <span className="t-ok">✓</span> MCP server + Claude Code skill
            </li>
            <li>
              <span className="t-ok">✓</span> Context7 library index
            </li>
          </ul>
          <div className={styles.cmd}>
            <span className="t-ok">$</span> {INSTALL_CMD}
          </div>
        </div>

        <div className={cn("lit", styles.card, styles.soon)}>
          <div className={styles.cardHead}>
            <span className={styles.plan}>getctx API</span>
            <span className={styles.badgeSoon}>soon</span>
          </div>
          <ul className={styles.feats}>
            <li>
              <span className={styles.o}>○</span> first-party endpoints, no stitching
            </li>
            <li>
              <span className={styles.o}>○</span> higher rate limits + edge caching
            </li>
            <li>
              <span className={styles.o}>○</span> team keys + usage dashboards
            </li>
          </ul>
          <a href="#" className={styles.waitlist}>
            Join the waitlist&nbsp;&rarr;
          </a>
        </div>
      </div>
    </Section>
  )
}
