import { createServerFn } from "@tanstack/react-start"
import { marked } from "marked"

/** Decision B6: /docs renders the ctx repo README directly (single source of
 * truth, no doc drift). Fetched + parsed on the server so marked never ships to
 * the client and the HTML is in the SSR payload for SEO. */
const README_URL = "https://raw.githubusercontent.com/ethan-huo/ctx/main/README.md"

const FALLBACK_HTML =
  "<p>Docs are temporarily unavailable. Read them on " +
  '<a href="https://github.com/ethan-huo/ctx">GitHub</a>.</p>'

export const getDocs = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const res = await fetch(README_URL, { headers: { accept: "text/plain" } })
    if (!res.ok) return { html: FALLBACK_HTML }
    // README is our own repo, so marked's raw-HTML passthrough is acceptable here.
    const html = await marked.parse(await res.text(), { gfm: true })
    return { html }
  } catch {
    return { html: FALLBACK_HTML }
  }
})
