# Image Editor Sample

A minimal [Pixcall](https://pixcall.com/) command plugin that opens an
independent window for cropping a selected image. It uses
[`react-image-crop`](https://github.com/dominictobias/react-image-crop) for the
crop interaction and overwrites the original file after confirmation.

## Development

```sh
npm install
npm run dev
```

While the server is running, open the entire `image-editor-sample` directory as
a local plugin in Pixcall. Pixcall will use the development manifest and load
the plugin from the local HTTP server.

## Build

```sh
npm run build
```

The production output is written to `dist/`.
