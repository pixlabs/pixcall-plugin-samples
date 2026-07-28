import pixcall from 'pixcall'
import { useEffect, useMemo } from 'react'
import PdfDocument from './components/PdfDocument'
import { usePluginContext } from './hooks/usePluginContext'
import { resolveMessages } from './lib/l10n'
import './styles/global.css'

export default function App() {
  const viewerContext = usePluginContext()
  const fileUrl = viewerContext?.masterUrl
  const locale = viewerContext?.locale
  const colorMode = viewerContext?.colorMode ?? 'light'
  const messages = useMemo(() => resolveMessages(locale), [locale])
  const title = useMemo(
    () => viewerContext?.fileName || messages['viewer.fallback_title'],
    [viewerContext?.fileName, messages]
  )

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      const selection = window.getSelection()?.toString().trim() ?? ''
      event.preventDefault()

      if (selection.length > 0) {
        pixcall.menu.openTextAt({ x: event.clientX, y: event.clientY })
        return
      }

      pixcall.menu.openDefaultAt({ x: event.clientX, y: event.clientY })
    }

    document.body.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.body.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  useEffect(() => {
    const handleDoubleClick = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) {
        return
      }

      if (event.target.closest('.react-pdf__Page')) {
        return
      }

      pixcall.window.close()
    }

    document.body.addEventListener('dblclick', handleDoubleClick)

    return () => {
      document.body.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [])

  if (!viewerContext) {
    return <div className="state">{messages['viewer.waiting_context']}</div>
  }

  if (!fileUrl) {
    return <div className="state">{messages['viewer.missing_pdf_url']}</div>
  }

  return (
    <main className="viewer" data-color-mode={colorMode}>
      <header className="toolbar">
        <strong className="title">{title}</strong>
      </header>
      <section className="document">
        <PdfDocument fileUrl={fileUrl} colorMode={colorMode} messages={messages} />
      </section>
    </main>
  )
}
