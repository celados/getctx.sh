import { createFileRoute } from "@tanstack/react-router"
import { Commands } from "@/components/landing/commands"
import { CtaBand } from "@/components/landing/cta-band"
import { Hero } from "@/components/landing/hero"
import { Integrations } from "@/components/landing/integrations"
import { Pricing } from "@/components/landing/pricing"
import { Problem } from "@/components/landing/problem"
import { WatchItWork } from "@/components/landing/watch-it-work"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  return (
    <>
      <Hero />
      <Integrations />
      <Problem />
      <Commands />
      <WatchItWork />
      <Pricing />
      <CtaBand />
    </>
  )
}
