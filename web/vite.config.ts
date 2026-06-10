import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { cloudflare } from "@cloudflare/vite-plugin"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Config lives in web/ but is invoked from the repo root (`vite -c web/vite.config.ts`),
// so pin the project root to this directory explicitly.
const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root,
  resolve: { tsconfigPaths: true },
  plugins: [
    // SSR runs in workerd locally + on Cloudflare; reads ./worker.jsonc
    cloudflare({ configPath: "./worker.jsonc", viteEnvironment: { name: "ssr" } }),
    devtools(),
    tanstackStart(),
    viteReact(),
  ],
})
