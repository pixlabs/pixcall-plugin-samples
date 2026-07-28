import type { ColorMode, PreferenceChangeEvent } from 'pixcall'
import pixcall from 'pixcall'
import { useEffect, useState } from 'react'

export interface ViewerContext {
  colorMode: 'light' | 'dark'
  fileName?: string
  locale?: string
  masterUrl?: string
}

function resolveColorMode(colorMode?: ColorMode): ViewerContext['colorMode'] {
  return colorMode === 'dark' ? 'dark' : 'light'
}

export function usePluginContext(): ViewerContext | null {
  const [viewerContext, setViewerContext] = useState<ViewerContext | null>(null)

  useEffect(() => {
    let disposed = false

    const load = async () => {
      const context = await pixcall.getContext()

      if (context && !disposed) {
        setViewerContext({
          colorMode: resolveColorMode(context.preferences.colorMode),
          fileName: context.current?.fileName,
          locale: context.preferences.locale,
          masterUrl: context.current?.masterUrl,
        })
      }
    }

    load()

    const disposable = pixcall.preferences.onDidChange(({ key, value }: PreferenceChangeEvent) => {
      if (disposed) {
        return
      }

      if (key === 'colorMode' || key === 'locale') {
        setViewerContext((context) =>
          context
            ? {
                ...context,
                [key]: key === 'colorMode' ? resolveColorMode(value as ColorMode) : value,
              }
            : context
        )
      }
    })

    return () => {
      disposed = true
      disposable()
    }
  }, [])

  return viewerContext
}
