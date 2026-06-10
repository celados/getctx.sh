import { Link } from "@tanstack/react-router"
import { useEffect } from "react"
import { TerminalLines } from "@/components/terminal/lines"
import { SAMPLE_DOCS_REACT } from "@/lib/ctx-mock"
import type { Flow } from "@/lib/playground-flows"
import { useTerminalPlayback } from "@/lib/use-terminal-playback"
import { cn } from "@/lib/utils"
import { InstallPill } from "./install-pill"
import styles from "./hero.module.css"

// The hero proof is a one-shot version of the playground flow: type the command,
// reveal the output, rest the caret — so the page is "alive" on first paint (2.1).
const HERO_FLOW: Flow = {
  id: "hero",
  intent: "",
  steps: [{ cmd: 'ctx docs react "useEffect cleanup"', note: "", output: SAMPLE_DOCS_REACT }],
}

export function Hero() {
  const { entries, typing, reduce, playFlow } = useTerminalPlayback()

  useEffect(() => {
    void playFlow(HERO_FLOW, { showComment: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const step = entries.find((e) => e.kind === "step")
  const output = step?.kind === "step" ? step.output : null

  return (
    <section className={cn("container", styles.hero)}>
      <div className={styles.copyCol}>
        <span className={cn("lit", styles.freshness)}>
          {/* the live thing is the fetch, not an index timestamp (B3) */}
          <span className={styles.pulse} aria-hidden="true" /> live fetch · no training cutoff
        </span>

        <h1 className={styles.title}>
          Fresh context for coding agents<span className={styles.dot}>.</span>
        </h1>

        <p className={styles.sub}>
          The fetch layer between your coding agent and the real, current source. Library docs, live
          pages, and structured data, pulled on demand instead of recalled from a training cutoff.
        </p>

        <div className={styles.cta}>
          <InstallPill />
          <Link to="/docs" className={styles.docs}>
            Read the docs <span className={styles.arrow}>&rarr;</span>
          </Link>
        </div>
      </div>

      <div className={cn("lit", styles.proof)}>
        <div className={styles.proofHead}>
          <span>ctx · docs</span>
          <span className={styles.file}>react.dev</span>
        </div>
        <div className={styles.proofBody}>
          {/* invisible sizer: reserves the final height so the type-in reveal
              doesn't grow the box and shove the page down (no layout shift) */}
          <div className={styles.ghost} aria-hidden="true">
            <div className={styles.cmd}>
              <span className={styles.p}>$</span> <span className={styles.c}>ctx</span> docs react{" "}
              <span className={styles.str}>"useEffect cleanup"</span>
            </div>
            <TerminalLines text={SAMPLE_DOCS_REACT} />
            <div>
              <span className={styles.p}>$</span>
            </div>
          </div>

          <div className={styles.live}>
            {typing ? (
              <div className={styles.cmd}>
                <span className={styles.p}>$</span> {typing.cmd}
                <span className={styles.caret} aria-hidden="true" />
              </div>
            ) : step ? (
              <>
                <div className={styles.cmd}>
                  <span className={styles.p}>$</span> <span className={styles.c}>ctx</span> docs react{" "}
                  <span className={styles.str}>"useEffect cleanup"</span>
                </div>
                {output ? (
                  <>
                    <TerminalLines text={output} animate reduce={reduce} />
                    <div>
                      <span className={styles.p}>$</span>{" "}
                      <span className={styles.caret} aria-hidden="true" />
                    </div>
                  </>
                ) : (
                  <div>
                    <span className={styles.caret} aria-hidden="true" />
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
