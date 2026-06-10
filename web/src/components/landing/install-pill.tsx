import { CopyButton } from "@/components/terminal/copy-button"
import { INSTALL_CMD } from "@/lib/install"
import { cn } from "@/lib/utils"
import styles from "./install-pill.module.css"

/** The one install pill, used by hero (quiet) and cta-band (emphasis). Page-level
 * button hierarchy stays explicit: exactly one accent-filled copy button, in the
 * CTA band; the hero stays low-key (4.2). */
export function InstallPill({
  emphasis = false,
  className,
}: {
  emphasis?: boolean
  className?: string
}) {
  return (
    <div className={cn("lit", styles.pill, className)}>
      <span className={styles.dollar}>$</span>
      <code className={styles.code}>{INSTALL_CMD}</code>
      <CopyButton
        value={INSTALL_CMD}
        className={cn(styles.copy, emphasis && styles.copyEmphasis)}
      />
    </div>
  )
}
