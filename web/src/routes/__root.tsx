import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { Footer } from "@/components/landing/footer"
import { NotFound } from "@/components/landing/not-found"
import { SiteHeader } from "@/components/landing/site-header"

import appCss from "../styles/app.css?url"

const TITLE = "ctx · fresh context for coding agents"
const DESCRIPTION =
  "ctx is the fetch layer between your coding agent and the real, current source: library docs, live pages, and structured data, pulled on demand."

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      // social cards (P2 SEO) — text only; og:image tracked in backlog
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "ctx" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico" },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="app-shell">
          <SiteHeader />
          <main className="app-main">{children}</main>
          <Footer />
        </div>
        {/* @tanstack/devtools-vite strips this whole block from production builds */}
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}
