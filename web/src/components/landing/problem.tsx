import { Terminal } from "@/components/terminal/terminal"
import { SAMPLE_DOCS_VITE } from "@/lib/ctx-mock"
import { Section } from "./section"
import styles from "./problem.module.css"

export function Problem() {
  return (
    <Section
      id="why"
      title="Your agent's knowledge has an expiry date."
      intro="Models are frozen at a training cutoff. The day a library ships a new API, your agent keeps writing the old one, with total confidence."
    >
      <div className={styles.split}>
        <Terminal title="without ctx" className={styles.bad}>
          <span className="t-dim">$</span> "configure vite 8"
          {"\n\n"}
          {"export default defineConfig({"}
          {"\n"}
          {"  optimizeDeps: { disabled: true },"} <span className="t-dim">// removed in v5</span>
          {"\n"}
          {"})"}
          {"\n\n"}
          <span className="t-err">✗ confidently wrong — no warning, no doubt</span>
        </Terminal>

        <Terminal title="with ctx" className={styles.good}>
          <span className="t-ok">$</span> <span className="t-cmd">ctx</span> docs vite{" "}
          <span className="t-str">"config"</span>
          {"\n\n"}
          {SAMPLE_DOCS_VITE}
        </Terminal>
      </div>
    </Section>
  )
}
