import { useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { runLine } from "@/lib/ctx-mock"
import { INSTALL_CMD } from "@/lib/install"
import type { Flow } from "@/lib/playground-flows"

/** One shared playback engine for every live terminal on the site: the hero
 * load-in, the homepage "watch it work" player, and the full playground. It owns
 * the state machine (type → fetch → reveal) plus cancellation and skip; each
 * surface renders the same state in its own chrome. */

export type TypingState = { cmd: string; note?: string }

export type Entry =
  | { id: string; kind: "comment"; text: string }
  | { id: string; kind: "cta"; text: string; copy: string }
  | {
      id: string
      kind: "step"
      cmd: string
      note?: string
      output: string | null
      running: boolean
      highlight?: string
      flash?: boolean
    }

export type PlayOptions = {
  /** prepend the `# intent` comment line (off for the bare hero proof) */
  showComment?: boolean
  /** append a closing install CTA line once the flow finishes */
  closingCta?: boolean
}

export function useTerminalPlayback() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [typing, setTyping] = useState<TypingState | null>(null)
  const [busy, setBusy] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const reduce = useReducedMotion()

  const tokenRef = useRef(0) // bumped to cancel any in-flight playback
  const idRef = useRef(0)
  const skipRef = useRef(false) // fast-forward the current step
  const wakeRef = useRef<(() => void) | null>(null) // resolves the active sleep early

  useEffect(() => () => void tokenRef.current++, []) // cancel on unmount

  /** Cancellable, skippable sleep — skip() or a token bump wakes it immediately. */
  function sleep(ms: number) {
    return new Promise<void>((resolve) => {
      const id = setTimeout(() => {
        wakeRef.current = null
        resolve()
      }, ms)
      wakeRef.current = () => {
        clearTimeout(id)
        wakeRef.current = null
        resolve()
      }
    })
  }

  /** Collapse the current step to its end state (typical terminal-demo gesture). */
  function skip() {
    if (!busy) return
    skipRef.current = true
    wakeRef.current?.()
  }

  function reset() {
    tokenRef.current++
    skipRef.current = false
    setEntries([])
    setTyping(null)
    setActiveId(null)
    setBusy(false)
  }

  async function typeOut(text: string, token: number) {
    if (reduce || skipRef.current) {
      setTyping((t) => ({ cmd: text, note: t?.note }))
      return
    }
    let cur = ""
    for (const ch of text) {
      if (tokenRef.current !== token) return
      if (skipRef.current) {
        setTyping((t) => ({ cmd: text, note: t?.note }))
        return
      }
      cur += ch
      setTyping((t) => ({ cmd: cur, note: t?.note }))
      await sleep(11)
    }
  }

  async function playFlow(flow: Flow, opts: PlayOptions = {}) {
    const token = ++tokenRef.current
    skipRef.current = false
    setActiveId(flow.id)
    setBusy(true)
    setEntries(
      opts.showComment === false
        ? []
        : [{ id: `c${idRef.current++}`, kind: "comment", text: `# ${flow.intent}` }],
    )
    setTyping(null)
    await sleep(reduce ? 0 : 450)

    for (const step of flow.steps) {
      if (tokenRef.current !== token) return
      setTyping({ cmd: "", note: step.note })
      await typeOut(step.cmd, token)
      if (tokenRef.current !== token) return
      await sleep(reduce ? 0 : 220)

      const id = `e${idRef.current++}`
      setEntries((p) => [
        ...p,
        { id, kind: "step", cmd: step.cmd, note: step.note, output: null, running: true },
      ])
      setTyping(null)
      await sleep(reduce ? 120 : 430 + Math.random() * 280)
      if (tokenRef.current !== token) return

      setEntries((p) =>
        p.map((e) =>
          e.id === id && e.kind === "step"
            ? { ...e, output: step.output, running: false, highlight: step.highlight }
            : e,
        ),
      )
      const lines = step.output.split("\n").length
      await sleep(reduce ? 0 : Math.min(1050, 220 + lines * 34))

      if (step.highlight && !reduce && !skipRef.current) {
        setEntries((p) =>
          p.map((e) => (e.id === id && e.kind === "step" ? { ...e, flash: true } : e)),
        )
        await sleep(760)
        setEntries((p) =>
          p.map((e) => (e.id === id && e.kind === "step" ? { ...e, flash: false } : e)),
        )
      }
      await sleep(reduce ? 0 : 240)
      skipRef.current = false // skip only fast-forwards the step it was pressed on
    }

    if (tokenRef.current !== token) return
    if (opts.closingCta) {
      setEntries((p) => [
        ...p,
        {
          id: `cta${idRef.current++}`,
          kind: "cta",
          text: `# that's ctx — ${INSTALL_CMD}`,
          copy: INSTALL_CMD,
        },
      ])
    }
    setBusy(false)
  }

  async function runManual(line: string) {
    const cmd = line.trim()
    if (!cmd || busy) return
    if (cmd === "clear") {
      reset()
      return
    }
    const token = ++tokenRef.current
    setActiveId(null)
    setBusy(true)
    const id = `e${idRef.current++}`
    setEntries((p) => [...p, { id, kind: "step", cmd, output: null, running: true }])
    const res = await runLine(cmd)
    if (tokenRef.current !== token) return
    setEntries((p) =>
      p.map((e) =>
        e.id === id && e.kind === "step" ? { ...e, output: res.text, running: false } : e,
      ),
    )
    setBusy(false)
  }

  return {
    entries,
    typing,
    busy,
    activeId,
    reduce,
    playFlow,
    runManual,
    skip,
    reset,
  }
}
