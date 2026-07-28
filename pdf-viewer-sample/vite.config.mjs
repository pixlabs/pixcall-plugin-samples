import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, normalizePath } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const require = createRequire(import.meta.url)
const pdfjsDistPath = dirname(require.resolve('pdfjs-dist/package.json'))
const cMapsDir = normalizePath(join(pdfjsDistPath, 'cmaps'))

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'LICENSE', dest: '.' },
        { src: 'THIRD-PARTY-NOTICES.md', dest: '.' },
        {
          src: 'third-party-licenses/**/*',
          dest: 'third-party-licenses',
          rename: { stripBase: true },
        },
        { src: 'icons/**/*', dest: 'icons', rename: { stripBase: true } },
        ...(mode === 'production'
          ? [{ src: 'l10n/*', dest: 'l10n', rename: { stripBase: true } }]
          : []),
        {
          src: `${cMapsDir}/**/*`,
          dest: 'cmaps',
          rename: { stripBase: true },
        },
      ],
    }),
  ],
  server: {
    strictPort: true,
  },
  base: './',
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    target: 'chrome146',
  },
}))
