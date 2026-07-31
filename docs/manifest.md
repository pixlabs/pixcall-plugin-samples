# Pixcall Plugin Manifest

Every Pixcall plugin uses a JSON manifest to describe the plugin and the
capabilities it provides.

A plugin usually contains two manifest files:

- `manifest.json`: used for the packaged plugin;
- `manifest.dev.json`: used when developing the plugin locally.

The two files should describe the same plugin. In most cases, the only
difference is the entry URL used by a contribution.

## Basic manifest

```json
{
  "id": "pdf-viewer-sample",
  "name": "%name%",
  "description": "%description%",
  "version": "0.1.0",
  "author": "Pixcall",
  "homepage": "https://pixcall.com/",
  "icon": "icons/icon.png",
  "categories": ["viewer"],
  "minimum_core_version": "0.9.6",
  "platform_arch": ["macos-arm64", "windows-x64"],
  "permissions": {},
  "contributes": {},
  "l10n": "./l10n",
  "default_locale": "en"
}
```

## Top-level fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | A stable, unique identifier for the plugin. Do not change it after publishing. |
| `name` | string | Yes | The plugin display name. It can contain a localization placeholder such as `%name%`. |
| `description` | string | Yes | A short description of the plugin. It can contain a localization placeholder. |
| `version` | string | Yes | The plugin version. Use a consistent version format and keep it synchronized with `package.json`. |
| `author` | string | Yes | The plugin author or publisher. |
| `homepage` | string | No | A project, documentation, or support URL. |
| `icon` | string | No | Path to the plugin icon, relative to the plugin directory. |
| `categories` | string[] | No | Categories used to group or filter the plugin. |
| `minimum_core_version` | string | No | The minimum Pixcall version required by the plugin. |
| `platform_arch` | string[] | No | Platform and architecture combinations supported by the plugin. Omit it to support all platforms. |
| `permissions` | object | No | Access permissions requested by the plugin. |
| `contributes` | object | No | Capabilities provided by the plugin. |
| `l10n` | string | No | Path to the directory containing locale JSON files. |
| `default_locale` | string | No | Default locale used when the requested locale is unavailable. |

Use `/` in manifest paths, including on Windows. Relative paths are resolved
from the plugin directory.

Supported platform and architecture identifiers use the format
`<platform>-<architecture>`, for example:

```text
macos-arm64
macos-x64
windows-x64
linux-x64
```

## Localization

Set `l10n` to a directory containing one JSON file per locale:

```text
l10n/
├── en.json
├── zh-CN.json
└── zh-TW.json
```

Each locale file is a string map:

```json
{
  "name": "PDF Viewer",
  "description": "View PDF files in Pixcall",
  "viewer_title": "PDF Viewer"
}
```

Reference localized values in the manifest with `%key%` placeholders:

```json
{
  "name": "%name%",
  "description": "%description%"
}
```

Pixcall uses the requested locale first, then falls back to `default_locale`,
and finally to `en` when no default locale is specified.

## Permissions

Only request permissions that the plugin actually needs. Omitted permissions
are disabled by default.

```json
{
  "permissions": {
    "fs": {
      "read": true,
      "write": false
    },
    "sqlite": {
      "read": true,
      "write": false
    },
    "storage": true
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `fs.read` | boolean | Allows the plugin to read files. |
| `fs.write` | boolean | Allows the plugin to write files. |
| `sqlite.read` | boolean | Allows the plugin to read SQLite data. |
| `sqlite.write` | boolean | Allows the plugin to write SQLite data. |
| `storage` | boolean | Allows the plugin to use plugin storage. |

## Contributions

Declare plugin capabilities under `contributes`. All contribution types are
optional.

```json
{
  "contributes": {
    "commands": [],
    "app_menus": [],
    "context_menus": [],
    "keybindings": [],
    "viewers": [],
    "inspectors": [],
    "importer": {},
    "page": {}
  }
}
```

### Viewers and inspectors

`viewers` and `inspectors` register UI pages that can handle specific files:

```json
{
  "title": "%inspector_title%",
  "when": "has_exif_gps",
  "entry": "index.html",
  "file_types": ["image/jpeg", "image/tiff"],
  "extensions": ["jpg", "jpeg", "tif", "tiff"]
}
```

The `when` condition should be consistent with the contribution's file types.
For example, `has_exif_gps` is suitable for an image EXIF inspector.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | No | Display title. It can be a localization placeholder. |
| `when` | string | No | A host condition used to decide whether the contribution is available. |
| `entry` | string | Yes | An HTTP(S) URL or a page path relative to the plugin directory. |
| `file_types` | string[] | No | MIME types handled by the contribution. |
| `extensions` | string[] | No | File extensions handled by the contribution, without the leading dot. |

`file_types` and `extensions` use OR matching: a file matches when it matches
an item in either list.

In `manifest.json`, use the packaged page:

```json
{
  "entry": "index.html"
}
```

In `manifest.dev.json`, use the local development server:

```json
{
  "entry": "http://127.0.0.1:5173/"
}
```

### Commands

Commands can be triggered by menus or keyboard shortcuts:

```json
{
  "command": "pdf-viewer.open",
  "title": "%open_command%",
  "icon": {
    "light": "icons/open-light.png",
    "dark": "icons/open-dark.png"
  },
  "file_types": ["application/pdf"],
  "extensions": ["pdf"],
  "kind": "window",
  "entry": "command.html",
  "window": {
    "width": 800,
    "height": 600,
    "resizable": true,
    "movable": true,
    "modal": false
  }
}
```

The `icon` inside a command contribution is the command and context-menu icon,
not the plugin's main icon. Use a 16×16 base icon and place its high-density
variant beside it with the `@2x` suffix:

```text
icons/open-light.png       # 16×16
icons/open-light@2x.png    # 32×32
icons/open-dark.png        # 16×16
icons/open-dark@2x.png     # 32×32
```

Reference only the base icon path in the manifest. Pixcall automatically looks
for the matching `@2x` asset on high-density displays. The top-level
`manifest.icon` is the plugin icon and follows a separate asset convention.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `command` | string | Yes | Stable command identifier. |
| `title` | string | Yes | Display title. |
| `icon` | object | No | Theme-specific command and context-menu icon paths. Reference the 16×16 base asset; Pixcall automatically uses the matching `@2x` asset on high-density displays. |
| `file_types` | string[] | No | MIME types associated with the command. |
| `extensions` | string[] | No | File extensions associated with the command. |
| `kind` | `"window"` | No | Window command execution type. |
| `entry` | string | No | Page URL or path for a window command. |
| `window` | object | No | Window configuration for a window command. |

When `window` is provided, `width` and `height` are required. The optional
fields are `min_width`, `min_height`, `max_width`, `max_height`, `resizable`,
`movable`, and `modal`.

`window` fields use pixels for dimensions. A value of `0` for a minimum or
maximum dimension means no limit:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `width` | number | Yes | Initial window width in pixels. |
| `height` | number | Yes | Initial window height in pixels. |
| `min_width` | number | No | Minimum window width in pixels. `0` means no limit. |
| `min_height` | number | No | Minimum window height in pixels. `0` means no limit. |
| `max_width` | number | No | Maximum window width in pixels. `0` means no limit. |
| `max_height` | number | No | Maximum window height in pixels. `0` means no limit. |
| `resizable` | boolean | No | Whether the user can resize the window. |
| `movable` | boolean | No | Whether the user can move the window. |
| `modal` | boolean | No | Whether the window is modal. |

### Menus and keybindings

Declare the file types and extensions on the command contribution:

```json
{
  "command": "pdf-viewer.open",
  "title": "%open_command%",
  "file_types": ["application/pdf"],
  "extensions": ["pdf"]
}
```

`app_menus` and `context_menus` connect the command to menus:

```json
{
  "command": "pdf-viewer.open",
  "location": "file",
  "submenu": [
    { "command": "pdf-viewer.open" }
  ]
}
```

`command` is required. `location`, `when`, and `submenu` are optional. File type
matching is declared on the corresponding command with `file_types` and
`extensions`. Each submenu item requires `command` and may contain `when`.

`keybindings` connect commands to keyboard shortcuts:

```json
{
  "command": "pdf-viewer.open",
  "key": "ctrl+alt+p",
  "macos": "cmd+alt+p",
  "windows": "ctrl+alt+p"
}
```

`command` and `key` are required. `macos`, `windows`, and `when` are optional.
File type matching is inherited from the corresponding command definition.

### Importer and page

An `importer` contribution has a required `entry` and `window`:

```json
{
  "entry": "import.html",
  "window": {
    "width": 720,
    "height": 480
  }
}
```

A `page` contribution has a required `entry`:

```json
{
  "entry": "index.html"
}
```

## Production and development manifests

Keep these values synchronized between `manifest.json` and
`manifest.dev.json`:

- `id`;
- `name` and `description`;
- `version`;
- `author`;
- `homepage`, `icon`, and localization settings;
- permissions and contribution types;
- supported file types and extensions.

Normally, only development-specific entry URLs should differ.

## Validation checklist

Before packaging a plugin, verify that:

1. The manifest is valid JSON.
2. All required fields are present.
3. Every referenced runtime resource exists in the plugin package, including
   icons, entry pages, locale files, workers, and other assets loaded by the
   plugin.
4. Third-party license texts and notices are copied into the package without
   flattening files with the same name or changing the paths referenced by the
   notices.
5. Localization placeholders have matching keys in the locale files.
6. Requested permissions match the plugin's actual behavior.
7. Shared fields in `manifest.json` and `manifest.dev.json` are synchronized;
   only development-specific entry URLs should differ.
8. The production manifest points to packaged entries and the development
   manifest points to the local development server.

The Pixcall Plugin SDK used by the samples is available as the
[`pixcall`](https://www.npmjs.com/package/pixcall) npm package.
