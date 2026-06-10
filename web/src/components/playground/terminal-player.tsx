import { ScrollArea } from "@base-ui/react/scroll-area"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"
import { TerminalLines } from "@/components/terminal/lines"
import { CopyButton } from "@/components/terminal/copy-button"
import { type Flow, FLOWS } from "@/lib/playground-flows"
import { useTerminalPlayback } from "@/lib/use-terminal-playback"
import { cn } from "@/lib/utils"
import styles from "./playground.module.css"

type TerminalPlayerProps = {
  /** flows offered as chips / picked for autoplay (defaults to all) */
  flows?: Flow[]
  showChips?: boolean
  showInput?: boolean
  /** shorter body for the homepage embed */
  compact?: boolean
  /** how the first flow kicks off: when scrolled into view, after a delay, or never */
  autoplay?: "view" | "delay" | false
  /** ?cmd= deeplink — runs straight away instead of autoplaying a flow (1.3) */
  initialCmd?: string
  /** append the closing install line when a flow finishes (3.4) */
  closingCta?: boolean
  /** external call-to-action shown under the terminal */
  cta?: { label: string; to: "/playground" }
}

export function TerminalPlayer({
  flows = FLOWS,
  showChips = false,
  showInput = false,
  compact = false,
  autoplay = false,
  initialCmd,
  closingCta = false,
  cta,
}: TerminalPlayerProps) {
  const { entries, typing, busy, activeId, reduce, playFlow, runManual, skip } =
    useTerminalPlayback()
  const [input, setInput] = useState("")

  const bodyRef = useRef<HTMLDivElement>(null)
  const atBottomRef = useRef(true) // sticky-scroll: only follow when already pinned (3.3)
  const historyRef = useRef<string[]>([])
  const histPosRef = useRef(0) // steps back from the newest command
  const startedRef = useRef(false)

  const play = (flow: Flow) => void playFlow(flow, { closingCta })

  // Kick off: deeplink command > delayed autoplay > in-view autoplay (3.1, 1.1).
  useEffect(() => {
    if (startedRef.current) return
    if (initialCmd) {
      startedRef.current = true
      void runManual(initialCmd)
      return
    }
    if (autoplay === "delay") {
      startedRef.current = true
      const t = setTimeout(() => play(flows[0]), 600)
      return () => clearTimeout(t)
    }
    if (autoplay === "view") {
      const el = bodyRef.current
      if (!el) return
      const io = new IntersectionObserver(
        (es) => {
          if (es[0]?.isIntersecting && !startedRef.current) {
            startedRef.current = true
            play(flows[0])
            io.disconnect()
          }
        },
        { threshold: 0.4 },
      )
      io.observe(el)
      return () => io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Follow the tail only if the user hadn't scrolled up (3.3).
  useEffect(() => {
    if (atBottomRef.current && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [entries, typing])

  function onScroll() {
    const b = bodyRef.current
    if (b) atBottomRef.current = b.scrollHeight - b.scrollTop - b.clientHeight < 40
  }

  function focusInput() {
    bodyRef.current?.querySelector("input")?.focus()
  }

  // Click / keypress collapses the current step while playing; focuses input when idle (3.2).
  function onActivate() {
    if (busy) skip()
    else if (showInput) focusInput()
  }

  function submit() {
    const cmd = input.trim()
    if (!cmd) return
    historyRef.current.push(cmd)
    histPosRef.current = 0
    setInput("")
    void runManual(cmd)
  }

  function onInputKey(ev: React.KeyboardEvent) {
    const h = historyRef.current
    if (ev.key === "ArrowUp" && h.length) {
      ev.preventDefault()
      histPosRef.current = Math.min(histPosRef.current + 1, h.length)
      setInput(h[h.length - histPosRef.current])
    } else if (ev.key === "ArrowDown" && h.length) {
      ev.preventDefault()
      histPosRef.current = Math.max(histPosRef.current - 1, 0)
      setInput(histPosRef.current === 0 ? "" : h[h.length - histPosRef.current])
    }
  }

  return (
    <div className={styles.wrap}>
      {showChips ? (
        <div className={styles.intents}>
          <span className={styles.intentsLabel}>pick an intent</span>
          {flows.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={activeId === f.id}
              className={cn(
                "lit",
                styles.chip,
                activeId === f.id && styles.chipActive,
                busy && activeId !== f.id && styles.chipDim,
              )}
              onClick={() => play(f)}
            >
              {busy && activeId === f.id ? (
                <span className={styles.chipMark} aria-hidden="true">
                  ▸{" "}
                </span>
              ) : null}
              {f.intent}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={cn("lit", styles.term, busy && styles.termBusy)}
        onClick={onActivate}
        onKeyDown={(e) => {
          if (busy && e.key !== "Tab") onActivate()
        }}
        // focusable so "press any key to skip" works for keyboard users (3.2, a11y)
        tabIndex={busy ? 0 : -1}
        role="group"
        aria-label="ctx terminal"
      >
        <div className={styles.head}>
          <span>ctx · playground</span>
          <span className={styles.state}>{busy ? "running · click to skip" : "ready"}</span>
        </div>

        {/* Base UI ScrollArea: native scroller (Viewport) with a custom, fade-in overlay scrollbar.
            bodyRef/onScroll/aria-live live on the Viewport — it's the element that actually scrolls. */}
        <ScrollArea.Root className={cn(styles.body, compact && styles.compact)}>
          <ScrollArea.Viewport
            className={styles.viewport}
            ref={bodyRef}
            onScroll={onScroll}
            aria-live="polite"
          >
            {entries.length === 0 && !typing ? (
              <div className={styles.hint}>
                {showChips
                  ? "# pick an intent above — watch the agent run the ctx workflow\n# search → docs → read, with real output"
                  : "# watch an agent run the ctx workflow"}
              </div>
            ) : null}

            {entries.map((e) =>
              e.kind === "comment" ? (
                <div key={e.id} className={styles.comment}>
                  {e.text}
                </div>
              ) : e.kind === "cta" ? (
                <div key={e.id} className={styles.ctaLine}>
                  <span>{e.text}</span>
                  <CopyButton value={e.copy} className={styles.ctaCopy} />
                </div>
              ) : (
                <div key={e.id} className={styles.entry}>
                  {e.note ? (
                    <div className={styles.note}>
                      <span className={styles.noteMark}>▸</span> {e.note}
                    </div>
                  ) : null}
                  <div className={styles.cmdLine}>
                    <span className={styles.prompt}>$</span> {e.cmd}
                  </div>
                  {e.running ? (
                    <div className={styles.running}>
                      <span className={styles.spinner} aria-hidden="true" />
                      <span className={styles.shimmer}>fetching context…</span>
                    </div>
                  ) : e.output ? (
                    <div className={styles.out}>
                      <TerminalLines
                        text={e.output}
                        animate
                        reduce={reduce}
                        flash={e.flash ? e.highlight : undefined}
                      />
                    </div>
                  ) : null}
                </div>
              ),
            )}

            <AnimatePresence>
              {typing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={styles.entry}
                >
                  {typing.note ? (
                    <div className={styles.note}>
                      <span className={styles.noteMark}>▸</span> {typing.note}
                    </div>
                  ) : null}
                  <div className={styles.cmdLine}>
                    <span className={styles.prompt}>$</span> {typing.cmd}
                    <span className={styles.caret} aria-hidden="true" />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {showInput && !typing && !busy ? (
              <form
                className={styles.inputLine}
                onSubmit={(ev) => {
                  ev.preventDefault()
                  submit()
                }}
              >
                <span className={styles.prompt}>$</span>
                <input
                  className={styles.input}
                  value={input}
                  onChange={(ev) => setInput(ev.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="…or type a command: ctx read <url>  ·  ↑ history  ·  clear"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="ctx command"
                />
              </form>
            ) : null}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className={styles.scrollbar}>
            <ScrollArea.Thumb className={styles.thumb} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {cta ? (
        <Link to={cta.to} className={styles.openCta}>
          {cta.label} <span aria-hidden="true">&rarr;</span>
        </Link>
      ) : null}
    </div>
  )
}
