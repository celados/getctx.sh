import { createFileRoute } from "@tanstack/react-router"
import { Section } from "@/components/landing/section"
import { getDocs } from "@/lib/docs"
import { cn } from "@/lib/utils"
import styles from "./docs.module.css"

export const Route = createFileRoute("/docs")({
  component: DocsPage,
  loader: () => getDocs(),
  head: () => ({
    meta: [
      { title: "Docs · ctx" },
      {
        name: "description",
        content: "ctx CLI documentation — install, commands, and usage.",
      },
    ],
  }),
})

function DocsPage() {
  const { html } = Route.useLoaderData()
  return (
    <Section title="Docs" intro="The ctx README, straight from the source.">
      <article
        className={cn("lit", styles.prose)}
        // trusted content: our own repo README, rendered server-side (B6)
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Section>
  )
}
