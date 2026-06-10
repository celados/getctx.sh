import { TerminalPlayer } from "./terminal-player"

/** The full playground: every flow as a chip, manual input, autoplay on load,
 * and a closing install CTA. The shared engine lives in TerminalPlayer. */
export function Playground({ initialCmd }: { initialCmd?: string }) {
  return (
    <TerminalPlayer
      showChips
      showInput
      autoplay={initialCmd ? false : "delay"}
      initialCmd={initialCmd}
      closingCta
    />
  )
}
