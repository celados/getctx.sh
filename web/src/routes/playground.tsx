import { createFileRoute } from "@tanstack/react-router"
import { Section } from "@/components/landing/section"
import { Playground } from "@/components/playground/playground"

type PlaygroundSearch = { cmd?: string }

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
  // ?cmd= lets the command grid deep-link a ready-to-run example (1.3)
  validateSearch: (s: Record<string, unknown>): PlaygroundSearch =>
    typeof s.cmd === "string" ? { cmd: s.cmd } : {},
  head: () => ({
    meta: [{ title: "Playground · ctx" }],
  }),
})

function PlaygroundPage() {
  const { cmd } = Route.useSearch()
  return (
    <Section
      title="Watch an agent use ctx."
      intro="Pick an intent and watch the real search → docs → read workflow play out, or type a command yourself. Every result is captured from the live ctx CLI."
    >
      <Playground initialCmd={cmd} />
    </Section>
  )
}
