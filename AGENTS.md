# AGENTS.md

Applies to all files in this repository. A more specific `AGENTS.md` inside a
sample directory may add or override rules for that sample.

## Area overview

This repository contains independent sample plugins for Pixcall. Each sample
is a self-contained project that demonstrates a focused plugin capability.

## Quick orientation

- Work inside the sample directory you are changing; each sample has its own
  dependencies, development server, and production build.
- Read `package.json`, `manifest.json`, `manifest.dev.json`, `src/`, and
  `vite.config.mjs` before making changes.
- During local development, `manifest.dev.json` points contributions to the
  Vite development server. For packaged builds, `manifest.json` points to
  `index.html`, and Vite copies runtime assets, localization files, icons, and
  license notices into `dist/`.
- When changing a feature, start with its manifest contribution, then trace
  its UI entry point and the Pixcall SDK context it consumes.

Typical sample contents include:

- `src/`: plugin source code;
- `manifest.json` and `manifest.dev.json`: production and local-development
  plugin manifests;
- `l10n/`: locale JSON files referenced by the manifest's `l10n` field. Keep
  all plugin localization files inside this directory;
- `icons/`: plugin icons referenced by the manifest;
- `vite.config.mjs`: Vite build configuration and packaged-asset copy rules;
- `third-party-licenses/` and `THIRD-PARTY-NOTICES.md`: dependency notices.

See [`docs/manifest.md`](docs/manifest.md) for the manifest fields, directory
layout, localization format, permissions, and contribution definitions.

The Pixcall Plugin SDK is provided by the [`pixcall`](https://www.npmjs.com/package/pixcall)
npm package.

## Environment and tooling

- Use a current Node.js LTS release and npm for local development.
- The current sample uses React, TypeScript, and Vite. Follow the existing
  scripts and configuration before introducing new tooling.
- Keep browser-facing code compatible with the Pixcall plugin runtime. Avoid
  adding Node.js-only APIs to code that runs inside the plugin UI.

## Local commands

Run these commands from the sample directory you are working in:

```sh
npm install       # Install dependencies
npm run dev       # Start the local development server
npm run build     # Check types and build the production output into dist/
```

## Manifest and release rules

- Treat the plugin `id` as a stable public identifier. Do not change it after
  a plugin has been published.
- Keep `manifest.json` for packaged builds and `manifest.dev.json` for local
  development. Update both when a manifest field is intentionally shared.
- Keep the `version` in `manifest.json`, `manifest.dev.json`, and
  `package.json` synchronized.
- Keep manifest contribution IDs, command IDs, and localization keys stable
  once they are used by consumers.
- Treat the top-level `manifest.icon` as the plugin icon. Command `icon` paths
  are for command and context-menu icons: use a 16×16 base PNG and provide a
  matching 32×32 `@2x` asset with the same basename when needed. See
  [`docs/manifest.md`](docs/manifest.md) for the full convention.
- Build output should contain the plugin files, manifest, icons, localization
  files, license files, and third-party notices required by the plugin. Do not
  include source-only or development files unless the runtime requires them.

## Change rules

1. Keep each plugin sample self-contained. Place sample-specific source code,
   manifests, assets, scripts, documentation, and dependency files inside the
   sample directory.
2. Keep `manifest.json`, `manifest.dev.json`, and `package.json` plugin
   versions synchronized unless there is a documented reason not to.
3. Keep `package.json` and the sample lockfile synchronized when changing
   dependencies.
4. Prefer the existing project conventions and avoid unrelated refactoring.
5. Do not commit `node_modules/`, `dist/`, local environment files, or
   editor-specific workspace files.

## Security and dependencies

- Request only the permissions required by the plugin's features.
- Never commit private keys, access tokens, credentials, or other secrets.
- Do not add network requests, telemetry, or external services without a clear
  user-facing reason and corresponding documentation.
- Prefer browser-compatible dependencies for plugin UI code and keep the
  dependency footprint focused.
- When adding or updating third-party dependencies, keep their license files
  and notices accurate.

## Agent guidelines

- Inspect the relevant sample and its manifest before changing code or
  configuration.
- Prefer existing scripts, project conventions, and focused changes over
  introducing new abstractions.
- When changing a sample, verify the affected build or package workflow and
  review the final diff for unrelated changes.

## License and third-party notices

- Preserve the repository and sample license files when modifying or
  redistributing samples.
- Preserve `third-party-licenses/` and `THIRD-PARTY-NOTICES.md` when changing
  or redistributing code that includes third-party dependencies.
- Do not replace or remove third-party license notices without verifying the
  corresponding dependency's licensing requirements.

## Validation checklist

Before completing a code or configuration change:

1. Run the relevant sample's build command.
2. Run `git diff --check`.
3. Review the final diff and avoid unrelated changes.
