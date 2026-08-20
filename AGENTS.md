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

- Use Node.js 22.12 or later and npm for local development.
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

All samples use `127.0.0.1:5173` for the development server. Run only one
sample's development server at a time unless you intentionally change the
sample's port configuration and its development manifest together.

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

## Contribution reference

Start from the contribution type that matches the plugin behavior:

| Need | Manifest contribution | Reference sample |
| --- | --- | --- |
| Replace or add a file viewer | `contributes.viewers` | `pdf-viewer-sample` |
| Show metadata for a selected file | `contributes.inspectors` | `exif-inspector-sample` |
| Add an action for selected files | `contributes.commands` and, when needed, `context_menus` | `image-editor-sample` |
| Open selected files in a fullscreen window | `contributes.commands`, `context_menus`, and optionally `keybindings` | `slideshow-sample` |

Use the narrowest file types and extensions that the feature actually handles.
For multi-selection commands, read `context.invocation.selection.entryIds` before
loading entries and preserve the user's selection order when rendering. Request
only the permissions required by the implementation. Add localization keys to
every locale file when manifest or UI text is user-facing.

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

- Check `git status` before starting and preserve unrelated user changes.
- Work only in the sample or documentation area relevant to the request.
- Before changing code or configuration, inspect the relevant sample's
  `package.json`, manifests, `src/`, and `vite.config.mjs`.
- Prefer existing scripts, project conventions, and focused changes over
  introducing new abstractions or rewriting unrelated files.
- For user-facing documentation, follow the repository's existing English
  style and avoid guessing Pixcall UI labels or workflows.
- Distinguish diagnosis from implementation: do not change code when the user
  only asks for an explanation or review.
- Before completing a change, run the affected sample's build, run
  `git diff --check`, and review the final diff for unrelated changes.
- Do not commit, push, or publish changes unless the user explicitly requests
  it.

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
4. For runtime changes, start `npm run dev`, load the sample directory as a
   local plugin in Pixcall, and test the contribution with a matching file or
   selection. Keep the server running while testing.
