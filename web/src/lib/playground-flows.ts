/* Intent-driven workflows for the playground. Each one is how an agent actually
 * uses ctx — search → docs → read — with REAL output captured from the `ctx`
 * CLI (2026-06-09). `note` is the agent's reasoning; `highlight` is the doc the
 * agent picks before the next `read`. */

export type FlowStep = {
  cmd: string
  /** agent reasoning shown beside the command */
  note: string
  /** real captured output */
  output: string
  /** substring of the output to flash as "the doc the agent picks" */
  highlight?: string
}

export type Flow = {
  id: string
  intent: string
  steps: FlowStep[]
}

export const FLOWS: Flow[] = [
  {
    id: "better-auth",
    intent: "Add an OAuth 2.1 provider with Better Auth",
    steps: [
      {
        cmd: 'ctx search "better auth"',
        note: "find the right library",
        output: `1. /better-auth/better-auth  Better Auth
   Framework-agnostic auth & authorization for TypeScript.
   snippets:5033  score:87  trust:8  stars:13052

2. /websites/better-auth  Better Auth
   snippets:4321  score:78  trust:9  stars:-1`,
      },
      {
        cmd: 'ctx docs better-auth "oauth provider plugin"',
        note: "map the doc sources, pick the one that fits",
        highlight: "oauth-provider.mdx",
        output: `Searched: /better-auth/better-auth

## 1. github://better-auth/better-auth@main/docs/.../plugins/oauth-provider.mdx
- Integrates the OAuth Provider plugin into the Better Auth config.

## 2. [Better Auth 1.5](github://better-auth/.../blogs/1-5.mdx)
- Example of configuring the OAuth 2.1 Provider plugin.`,
      },
      {
        cmd: "ctx read https://better-auth.com/docs/plugins/oauth-provider",
        note: "2627 lines — ctx returns a summary + TOC, not a wall of text",
        output: `[ctx:summary] 2627 lines, 102 sections.
Read sections: ctx read <url> -s <n>   ·   full: ~/.cache/ctx/c2c95608.md

# 1 OAuth 2.1 Provider (2626 lines)
A Better Auth plugin that turns your auth server into an
OAuth 2.1 provider with OIDC compatibility.

## 1.1 Installation (68 lines)
## 1.2 Client Plugins (39 lines)
## 1.3 Usage (825 lines)
…  (102 sections total)`,
      },
      {
        cmd: "ctx read … -s 1.1",
        note: "read only section 1.1 — the install snippet",
        output: `## Installation
### Mount the Plugin

import { betterAuth } from "better-auth"
import { oauthProvider } from "@better-auth/oauth-provider"

const auth = betterAuth({
  plugins: [jwt(), oauthProvider({
    loginPage: "/sign-in",
    consentPage: "/consent",
  })],
})`,
      },
    ],
  },
  {
    id: "tanstack-query",
    intent: "Invalidate cached data after a mutation in TanStack Query",
    steps: [
      {
        cmd: 'ctx search "tanstack query"',
        note: "find the right library",
        output: `1. /tanstack/query  TanStack Query
   Async state management & data fetching for the web.
   snippets:2557  score:90  trust:8  stars:45043

2. /websites/tanstack_query_v5  TanStack Query
   snippets:1949  score:94  trust:10  stars:-1`,
      },
      {
        cmd: 'ctx docs @tanstack/react-query "staleTime caching invalidation"',
        note: "pinpoint the invalidation guide",
        highlight: "query-invalidation.md",
        output: `## 1. github://tanstack/query@main/docs/.../react/guides/query-invalidation.md
- Use invalidateQueries to mark queries stale and trigger a refetch.

## 2. github://tanstack/query@main/docs/reference/QueryClient.md
- invalidateQueries invalidates and refetches queries by key.

---
Use ctx read <url> to fetch full documents.`,
      },
      {
        cmd: "ctx read github://tanstack/query@main/…/query-invalidation.md",
        note: "133 lines — small enough to return in full",
        output: `---
id: query-invalidation
title: Query Invalidation
---

The QueryClient has an invalidateQueries method that marks
queries stale and refetches them.

// Invalidate every query in the cache
queryClient.invalidateQueries()
// Invalidate everything keyed under "todos"
queryClient.invalidateQueries({ queryKey: ['todos'] })

When invalidated, a query is marked stale (overriding staleTime)
and, if mounted, refetched in the background.`,
      },
    ],
  },
  {
    id: "nextjs",
    intent: "Cache and revalidate a fetch in a Next.js app",
    steps: [
      {
        cmd: 'ctx search "next.js"',
        note: "find the right library",
        output: `1. /vercel/next.js  Next.js
   Full-stack React framework.
   snippets:5758  score:94  trust:10  stars:131745

2. /websites/nextjs  Next.js
   snippets:7265  score:76  trust:10  stars:-1`,
      },
      {
        cmd: 'ctx docs next.js "caching revalidate fetch"',
        note: "find the fetch caching reference",
        highlight: "fetch.mdx",
        output: `## 1. github://vercel/next.js@canary/docs/.../functions/fetch.mdx
- Next.js extends fetch() with persistent caching + revalidation.

## 2. github://vercel/next.js@canary/docs/.../caching-without-cache-components.mdx
- Use next.revalidate on a fetch to set a TTL in seconds.

---
Use ctx read <url> to fetch full documents.`,
      },
      {
        cmd: "ctx read github://vercel/next.js@canary/…/functions/fetch.mdx",
        note: "117 lines — returned in full, ready for the agent",
        output: `---
title: fetch
---

Next.js extends the Web fetch() API so each server request sets
its own caching and revalidation semantics.

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', {
    next: { revalidate: 3600 },   // refresh at most hourly
  })
  const posts = await data.json()
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}`,
      },
    ],
  },
]
