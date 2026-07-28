import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import type { Messages } from '../lib/l10n'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

const pdfOptions = {
  cMapUrl: '/cmaps/',
  cMapPacked: true,
}

interface Props {
  fileUrl: string
  colorMode: 'light' | 'dark'
  messages: Messages
}

export default function PdfDocument({ fileUrl, colorMode, messages }: Props) {
  const [numPages, setNumPages] = useState(0)

  return (
    <Document
      error={<div className="state">{messages['viewer.failed_to_load']}</div>}
      file={fileUrl}
      loading={<div className="state">{messages['viewer.loading_pdf']}</div>}
      options={pdfOptions}
      onLoadSuccess={({ numPages: nextNumPages }) => {
        setNumPages(nextNumPages)
      }}
    >
      <div className="pages" data-color-mode={colorMode}>
        {Array.from({ length: numPages }, (_, index) => index + 1).map((pageNumber) => (
          <Page key={pageNumber} pageNumber={pageNumber} renderAnnotationLayer renderTextLayer />
        ))}
      </div>
    </Document>
  )
}
