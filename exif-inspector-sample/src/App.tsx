import React from 'react'
import { getExifRows } from './lib/exif'
import { resolveMessages } from './lib/l10n'
import { useExif } from './hooks/useExif'
import { usePluginContext } from './hooks/usePluginContext'

export default function App() {
  const pluginContext = usePluginContext()
  const exifState = useExif(pluginContext?.originalUrl ?? null)

  React.useEffect(() => {
    const dark =
      pluginContext?.colorMode === 'dark' ||
      (pluginContext?.colorMode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }, [pluginContext?.colorMode])

  const messages = resolveMessages(pluginContext?.locale)

  if (!pluginContext) {
    return <StatusMessage text={messages['exif.loading']} />
  }

  if (exifState.status !== 'ready') {
    const text = {
      loading: messages['exif.loading'],
      missing: messages['exif.no_original'],
      empty: messages['exif.no_exif'],
      failed: messages['exif.parse_failed'],
    }[exifState.status]

    return <StatusMessage text={text} />
  }

  const rows = getExifRows(exifState.exif, messages, pluginContext.locale)
  return rows.length > 0 ? (
    <Details rows={rows} />
  ) : (
    <StatusMessage text={messages['exif.no_exif']} />
  )
}

function Details({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <dl className="details">
      {rows.map((row) => (
        <div className="detail" key={row.label}>
          <dt>{row.label}</dt>
          <dd title={row.value}>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function StatusMessage({ text }: { text: string }) {
  return <div className="status">{text}</div>
}
