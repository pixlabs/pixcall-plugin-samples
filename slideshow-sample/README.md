# Slideshow Sample

An example [Pixcall](https://pixcall.com/) command plugin that opens selected
files in a fullscreen slideshow. Images use their original content when
available; other selected files use their thumbnails.

## Development

```sh
npm install
npm run dev
```

While the server is running, open the entire `slideshow-sample` directory as a
local plugin in Pixcall. Pixcall will use the development manifest and load the
plugin from `http://127.0.0.1:5173/`.

To try the plugin, select one or more files and invoke the slideshow command
from the available context menu. Use the previous and next controls or the
left and right keys to move between files. Press `Esc` to close the slideshow.

## Build

```sh
npm run build
```

The production output is written to `dist/`. Use Pixcall's local or
packaged-plugin installation flow to load the generated `dist/` directory.
