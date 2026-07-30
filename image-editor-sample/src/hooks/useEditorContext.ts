import type { ColorMode, Entry, PluginContext, PreferenceChangeEvent } from 'pixcall'
import pixcall from 'pixcall'
import { useEffect, useState } from 'react'

export type EditorContext = {
  colorMode: ColorMode
  locale: string
  entry: Entry
  imageUrl: string
}

type EditorState =
  | { status: 'loading' }
  | { status: 'ready'; value: EditorContext }
  | { status: 'empty' }
  | { status: 'failed' }

export function useEditorContext(): EditorState {
  const [state, setState] = useState<EditorState>({ status: 'loading' })

  useEffect(() => {
    let disposed = false

    async function load() {
      const context = await pixcall.getContext<PluginContext>()
      const entryId = context?.invocation?.selection?.entryIds[0]
      const fileServer = context?.library.fileServer

      if (!entryId || !fileServer) {
        setState({ status: 'empty' })
        return
      }

      const [entry] = await pixcall.entries.getByIds<Entry>([entryId])
      if (!entry || !entry.contentType.startsWith('image/')) {
        setState({ status: 'empty' })
        return
      }

      if (!disposed) {
        setState({
          status: 'ready',
          value: {
            colorMode: context.preferences.colorMode,
            locale: context.preferences.locale,
            entry,
            imageUrl: `${fileServer}/masters/${entry.id}`,
          },
        })
      }
    }

    load().catch(() => {
      if (!disposed) {
        setState({ status: 'failed' })
      }
    })

    const dispose = pixcall.preferences.onDidChange(({ key, value }: PreferenceChangeEvent) => {
      setState((current) => {
        if (current.status !== 'ready') {
          return current
        }

        if (key === 'locale') {
          return { ...current, value: { ...current.value, locale: value } }
        }

        if (key === 'colorMode') {
          return { ...current, value: { ...current.value, colorMode: value } }
        }

        return current
      })
    })

    return () => {
      disposed = true
      dispose()
    }
  }, [])

  return state
}
