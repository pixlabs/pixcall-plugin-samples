# PDF Viewer Sample

A sample Pixcall viewer plugin built with React, Vite, and the Pixcall SDK.

## Development

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

While the server is running, open the entire `pdf-viewer-sample` directory as a
local plugin in Pixcall. Pixcall will use the development manifest and load the
plugin from the local HTTP server.

To try the plugin, open or select a PDF file in Pixcall. The viewer contribution
should be available for PDF files and display the document in the sample viewer.

## Build

```sh
npm run build
```

The production output is written to `dist/`.

Use Pixcall's local or packaged-plugin installation flow to load the generated
`dist/` directory. The packaged output uses `manifest.json` and `index.html`.

## License

This sample is licensed under the MIT License. See [LICENSE](./LICENSE).

Third-party license information is available in
[THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).
