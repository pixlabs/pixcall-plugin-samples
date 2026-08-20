import { useEffect, useRef, useState } from 'react'
import ReactCrop, { type PercentCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import pixcall from 'pixcall'
import { useEditorContext } from './hooks/useEditorContext'
import { cropImage } from './lib/image'
import { resolveMessages } from './lib/l10n'

const defaultCrop: PercentCrop = { unit: '%', x: 10, y: 10, width: 80, height: 80 }

export default function App() {
  const editorState = useEditorContext()
  const messages = resolveMessages(editorState.status === 'ready' ? editorState.value.locale : undefined)

  useEffect(() => {
    const colorMode = editorState.status === 'ready' ? editorState.value.colorMode : 'system'
    const dark =
      colorMode === 'dark' ||
      (colorMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }, [editorState])

  if (editorState.status === 'loading') {
    return <StatusMessage text={messages['editor.loading']} />
  }

  if (editorState.status === 'empty') {
    return <StatusMessage text={messages['editor.no_image']} />
  }

  if (editorState.status === 'failed') {
    return <StatusMessage text={messages['editor.load_failed']} />
  }

  return <Editor context={editorState.value} messages={messages} />
}

function Editor({
  context,
  messages,
}: {
  context: Extract<ReturnType<typeof useEditorContext>, { status: 'ready' }>['value']
  messages: ReturnType<typeof resolveMessages>
}) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<PercentCrop>(defaultCrop)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function saveCrop() {
    if (!imageRef.current || saving) {
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const { response } = await pixcall.window.showMessageBox({
        type: 'warning',
        title: messages['editor.confirm_title'],
        message: messages['editor.confirm_message'],
        buttons: [messages['editor.confirm'], messages['editor.cancel']],
        defaultId: 1,
        cancelId: 1,
      })

      if (response !== 0) {
        return
      }

      const blob = await cropImage(imageRef.current, crop, context.entry.contentType)
      const content = new Uint8Array(await blob.arrayBuffer())
      await pixcall.entries.updateContent(context.entry.id, content)
      setMessage(messages['editor.saved'])
    } catch (_error) {
      setMessage(messages['editor.save_failed'])
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="editor">
      <header className="toolbar">
        <span className="title">{context.entry.name}</span>
      </header>

      <section className="workspace">
        <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)}>
          <img ref={imageRef} src={context.imageUrl} alt={context.entry.name} crossOrigin="anonymous" />
        </ReactCrop>
      </section>

      <footer className="actions">
        <span className="image-info">
          {context.entry.imageWidth} × {context.entry.imageHeight} · {formatFileSize(context.entry.size, context.locale)}
        </span>
        <span className="message">{message}</span>
        <button type="button" onClick={() => pixcall.window.close()}>
          {messages['editor.close']}
        </button>
        <button type="button" disabled={saving} onClick={saveCrop}>
          {saving ? messages['editor.saving'] : messages['editor.save']}
        </button>
      </footer>
    </main>
  )
}

function StatusMessage({ text }: { text: string }) {
  return <div className="status">{text}</div>
}

function formatFileSize(bytes: number, locale: string) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** unitIndex

  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} ${units[unitIndex]}`
}
