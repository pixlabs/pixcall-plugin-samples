# Getting Started with Pixcall Plugin Samples

Welcome! This guide takes you from a fresh checkout to your first running
Pixcall sample plugin. The samples are independent projects, so each one has
its own dependencies and development server.

## Prerequisites

Before you begin, install:

- [Pixcall](https://pixcall.com/), to load and test a plugin.
- [Git](https://git-scm.com/), to download the samples.
- Node.js 22.12 or later. npm is included with Node.js and is used to install
  dependencies and run the sample scripts.

Check that Node.js and npm are available:

```sh
node --version
npm --version
```

## Get the samples

Clone the repository and enter it:

```sh
git clone https://github.com/pixlabs/pixcall-plugin-samples.git
cd pixcall-plugin-samples
```

You can try any of these samples:

| Sample | Demonstrates | Development port |
| --- | --- | --- |
| [`exif-inspector-sample`](../exif-inspector-sample/) | Reading and displaying image EXIF metadata | `5173` |
| [`image-editor-sample`](../image-editor-sample/) | Opening an image editor window from a context menu | `5173` |
| [`pdf-viewer-sample`](../pdf-viewer-sample/) | Registering a PDF viewer contribution | `5173` |
| [`slideshow-sample`](../slideshow-sample/) | Opening selected files in a fullscreen slideshow | `5173` |

All samples use port `5173` by default, so run only one development server at a
time.

## Run your first sample

Let's start with the PDF viewer. From the repository root, run:

```sh
cd pdf-viewer-sample
npm install
npm run dev
```

Keep this terminal running. Vite serves the sample at
`http://127.0.0.1:5173/`.

To try another sample, stop the server with `Ctrl+C`, change into that sample's
directory, and run the same `npm install` and `npm run dev` commands.

## Open the sample in Pixcall

With the development server running, open the entire sample directory as a
local plugin in Pixcall. For this example, select the
`pixcall-plugin-samples/pdf-viewer-sample` directory, not just its `src`
directory.

Pixcall uses `manifest.dev.json` during local development. That manifest points
to the Vite development server, which is why the terminal must stay open.

After changing source files, reload or reopen the plugin in Pixcall if the
change does not appear immediately.

## Try it out

### PDF viewer

Open or select a PDF file in Pixcall. The PDF viewer contribution should be
available for PDF files and display the document in the sample viewer.

See the [PDF viewer README](../pdf-viewer-sample/README.md) for more details.

### EXIF inspector

Open or select an image file with EXIF metadata. The inspector contribution
should display the metadata exposed by the sample, such as camera, lens,
exposure, and location fields when those fields are present in the source file.

See the [EXIF inspector README](../exif-inspector-sample/README.md) for more
details and supported image types.

### Image editor

Select an image file and invoke the sample's image-editor command from the
available context menu. Adjust the crop and confirm it to write the cropped
image back to the original file.

This sample modifies the original image after confirmation. Use a disposable
copy while learning or testing it.

See the [Image editor README](../image-editor-sample/README.md) for more
details.

### Slideshow

Select one or more files and invoke the slideshow command from the available
context menu. Use the previous and next controls or the left and right keys to
move between files, and press `Esc` to close the slideshow.

See the [Slideshow README](../slideshow-sample/README.md) for more details.

## Build and install a packaged plugin

When you are ready to try the packaged version, stop the development server and
run the production build from the sample directory:

```sh
npm run build
```

The build checks the TypeScript code and writes the packaged output to the
sample's `dist/` directory. The output includes the built page, production
`manifest.json`, icons, localization files, and license notices.

To test it, use Pixcall's local or packaged-plugin installation flow and select
the sample's `dist/` directory. The packaged manifest uses `index.html` instead
of the Vite development-server URL.

Do not commit `dist/`; it is generated output and is ignored by the repository.

## Common problems

### The development server cannot start because the port is in use

Stop the other sample using that port, then run `npm run dev` again. The sample
servers use strict port checking, so they report the conflict instead of
silently choosing another port.

### npm reports an unsupported Node.js version

Install Node.js 22.12 or later, then run `npm install` again in the sample
directory.

### The plugin does not appear in Pixcall

Check that the development server is still running, that you selected the
sample's top-level directory, and that the file you are testing matches the
sample's contribution type. During development, Pixcall must load the sample
directory containing `manifest.dev.json`.

### The plugin still shows an older version

Reload or reopen the local plugin in Pixcall. For a packaged build, run
`npm run build` again and select the updated `dist/` directory.

## What to read next

- Read the sample README for feature-specific usage.
- Read the [Plugin Manifest guide](manifest.md) to understand
  `manifest.json`, `manifest.dev.json`, contributions, permissions, and
  localization.
- Inspect `src/` to see how each sample consumes the Pixcall SDK context.
