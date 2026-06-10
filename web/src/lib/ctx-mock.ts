/* Output for the in-browser playground. `search`, `docs`, `read`, and
 * `screenshot` are REAL output captured from the `ctx` CLI (Context7 +
 * Cloudflare Browser Rendering, 2026-06-09). `links`, `scrape`, `json`, and
 * `crawl` are REPRESENTATIVE of the CLI's output shape (deep-linked from the
 * command grid) pending real captures — see .agents/backlog.md.
 * `runLine` resolves a raw `ctx …` line to its output; swap it for a server fn /
 * getctx API to run live against the user's own key. */
import { COMMANDS } from "@/lib/commands"

const SAMPLE_SEARCH = `1. /remix-run/react-router  React Router
   React Router is a multi-strategy router for React, bridging
   React 18 to 19, usable as a framework or a library.
   snippets:2571  score:88  stars:54762

2. /websites/reactrouter_6_30_3  React Router
   A declarative routing library for React applications.
   snippets:1303  score:80  stars:-1

3. /websites/v5_reactrouter  React Router
   A declarative routing library for React applications.
   snippets:27195  score:72  stars:-1

Next: ctx docs <library-name> "<query>" to find relevant documentation.`

export const SAMPLE_DOCS_REACT = `# /reactjs/react.dev

## 1. [<StrictMode>](github://reactjs/react.dev@main/.../StrictMode.md)
- The \`useEffect\` hook with a proper cleanup function added to
  disconnect from the chat, resolving accumulating connections.

## 2. [Synchronizing with Effects](github://reactjs/react.dev@main/.../synchronizing-with-effects.md)
- Adding a cleanup function to the \`useEffect\` to disconnect when
  the component unmounts or before the effect re-runs.

## 3. [useEffect](github://reactjs/react.dev@main/.../react/useEffect.md)
- A symmetrical setup and cleanup example, where cleanup undoes setup.

---
Use \`ctx read <url>\` to fetch full documents.`

export const SAMPLE_DOCS_VITE = `# /vitejs/vite

## 1. [Configuring Vite](github://vitejs/vite@main/docs/config/index.md)
- The most basic config file structure.
- How to explicitly specify a config file using the CLI.

## 2. [Plugin API](github://vitejs/vite@main/docs/guide/api-plugin.md)
- Return a partial config from the \`config\` hook; Vite deep-merges it.`

const SAMPLE_READ = `> ## Documentation Index
> Fetch the complete index at: https://bun.com/docs/llms.txt

# Environment Variables

> Read and configure environment variables in Bun, including
> automatic .env file support

Bun reads your .env files automatically and provides idiomatic
ways to read and write your environment variables programmatically.

## Setting environment variables

Bun reads the following files automatically (increasing precedence):
  .env
  .env.production, .env.development, .env.test
  .env.local`

const SAMPLE_SHOT = `./stripe-com.png
page=14614 viewport=900 screen=1/17 (--scroll 900 for next)`

const SAMPLE_LINKS = `news.ycombinator.com — 31 links

→ https://news.ycombinator.com/newest
→ https://news.ycombinator.com/front
→ https://news.ycombinator.com/ask
→ https://github.com/HackerNews/API
→ https://www.ycombinator.com/apply
…  (31 total)`

const SAMPLE_SCRAPE = `shop.com · selector ".price" · 6 matches

1. $29.00
2. $48.00
3. $12.50
4. $99.00
…  (6 total)`

const SAMPLE_JSON = `{
  "name": "repo",
  "stars": 1423,
  "language": "TypeScript",
  "topics": ["cli", "docs", "agents"]
}`

const SAMPLE_CRAWL = `Crawling docs.bun.sh … 20 pages

✓ /docs/installation
✓ /docs/runtime/env
✓ /docs/api/http
✓ /docs/bundler
…  (20 pages → ~/.cache/ctx/bun-docs/)`

/** ctx --help summary, built from the shared command list so it never drifts. */
function helpText(): string {
  const pad = Math.max(...COMMANDS.map((c) => c.name.length))
  const rows = COMMANDS.map((c) => `  ${c.name.padEnd(pad)}  ${c.args.padEnd(18)}${c.tagline}`)
  return `ctx — fresh context for coding agents\n\n${rows.join("\n")}\n\nRun: ctx <command> <args>`
}

export type LineResult = { ok: boolean; text: string }

/** Split a command line, respecting "double quotes". */
function tokenize(input: string): string[] {
  const out: string[] = []
  const re = /"([^"]*)"|(\S+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(input)) !== null) out.push(m[1] ?? m[2] ?? "")
  return out
}

/** Parse + resolve a raw `ctx …` line to its captured/representative output. */
export async function runLine(input: string): Promise<LineResult> {
  const toks = tokenize(input.trim())
  let i = 0
  if (toks[i] === "ctx") i++
  const name = toks[i++]
  const rest = toks.slice(i).join(" ").toLowerCase()

  await new Promise((r) => setTimeout(r, 550 + Math.random() * 450))

  if (!name || name === "help" || name === "--help" || rest.includes("--help")) {
    return { ok: true, text: helpText() }
  }
  switch (name) {
    case "search":
      return { ok: true, text: SAMPLE_SEARCH }
    case "docs":
      return {
        ok: true,
        text: rest.includes("vite") ? SAMPLE_DOCS_VITE : SAMPLE_DOCS_REACT,
      }
    case "read":
      return { ok: true, text: SAMPLE_READ }
    case "screenshot":
      return { ok: true, text: SAMPLE_SHOT }
    case "links":
      return { ok: true, text: SAMPLE_LINKS }
    case "scrape":
      return { ok: true, text: SAMPLE_SCRAPE }
    case "json":
      return { ok: true, text: SAMPLE_JSON }
    case "crawl":
      return { ok: true, text: SAMPLE_CRAWL }
    default:
      return { ok: false, text: `ctx: unknown command "${name}"\n\n${helpText()}` }
  }
}
