# EXIF Inspector Sample

A minimal [Pixcall](https://pixcall.com/) inspector plugin that reads the
selected image's original file with [`exifr`](https://github.com/MikeKovarik/exifr)
and displays important EXIF metadata as label/value pairs.

## Development

```sh
npm install
npm run dev
```

While the server is running, open the entire `exif-inspector-sample` directory
as a local plugin in Pixcall. Pixcall will use the development manifest and
load the plugin from the local HTTP server.

## Build

```sh
npm run build
```

The production output is written to `dist/`.
