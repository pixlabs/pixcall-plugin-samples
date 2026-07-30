import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'LICENSE', dest: '.' },
        { src: 'THIRD-PARTY-NOTICES.md', dest: '.' },
        { src: 'icons/**/*', dest: 'icons', rename: { stripBase: true } },
        ...(mode === 'production'
          ? [{ src: 'l10n/*', dest: 'l10n', rename: { stripBase: true } }]
          : []),
        {
          src: 'third-party-licenses/react/**/*',
          dest: 'third-party-licenses/react',
          rename: { stripBase: true },
        },
        {
          src: 'third-party-licenses/react-image-crop/**/*',
          dest: 'third-party-licenses/react-image-crop',
          rename: { stripBase: true },
        },
      ],
    }),
  ],
  server: {
    strictPort: true,
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    target: 'chrome146',
  },
}))
