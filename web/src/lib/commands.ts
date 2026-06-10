/** The ctx command surface (from `ctx --help`). Shared by the landing grid and
    the playground so the two never drift. */
export type CtxCommand = {
  name: string
  args: string
  tagline: string
  example: string
  blurb: string
  /** terminal accent class key */
  accent: "green" | "cyan" | "blue" | "yellow" | "purple" | "red"
}

export const COMMANDS: CtxCommand[] = [
  {
    name: "search",
    args: "<library>",
    tagline: "find a library",
    example: "ctx search react-router",
    blurb: "Resolve a package name to its indexed docs on Context7.",
    accent: "green",
  },
  {
    name: "docs",
    args: "<library> <topic>",
    tagline: "topic-scoped docs",
    example: 'ctx docs drizzle "migrations"',
    blurb: "Pull the doc sources for a library, narrowed to a topic.",
    accent: "cyan",
  },
  {
    name: "read",
    args: "<url>",
    tagline: "URL to markdown",
    example: "ctx read https://x.com/post",
    blurb: "Turn any page (https:// or github://) into clean markdown.",
    accent: "blue",
  },
  {
    name: "screenshot",
    args: "<url>",
    tagline: "capture a page",
    example: "ctx screenshot stripe.com",
    blurb: "Render a full page to an image via headless browser.",
    accent: "purple",
  },
  {
    name: "links",
    args: "<url>",
    tagline: "extract links",
    example: "ctx links news.ycombinator.com",
    blurb: "List every link on a page for the agent to follow.",
    accent: "yellow",
  },
  {
    name: "scrape",
    args: "<url> <selector>",
    tagline: "selector scrape",
    example: 'ctx scrape shop.com ".price"',
    blurb: "Pull elements matching a CSS selector, structured for parsing.",
    accent: "green",
  },
  {
    name: "json",
    args: "<url> --schema",
    tagline: "structured extract",
    example: "ctx json repo.com --schema",
    blurb: "Extract typed JSON from a page against a schema, with AI.",
    accent: "cyan",
  },
  {
    name: "crawl",
    args: "<url> [--limit]",
    tagline: "crawl a doc site",
    example: "ctx crawl docs.bun.sh",
    blurb: "Walk a documentation site and collect every page.",
    accent: "blue",
  },
]
