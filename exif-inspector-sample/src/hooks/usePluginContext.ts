import type { ColorMode, PluginContext, PreferenceChangeEvent } from 'pixcall'
import pixcall from 'pixcall'
import { useEffect, useState } from 'react'

export interface PluginContextData {
  colorMode: ColorMode
  locale: string
  originalUrl: string | null
}

function toPluginContextData(context: PluginContext | null): PluginContextData | null {
  if (!context) {
    return null
  }

  return {
    colorMode: context.preferences.colorMode,
    locale: context.preferences.locale,
    originalUrl: context.current.originalUrl ?? null,
  }
}

export function usePluginContext(): PluginContextData | null {
  const [pluginContext, setPluginContext] = useState<PluginContextData | null>(null)

  useEffect(() => {
    let disposed = false

    pixcall.getContext<PluginContext>().then((context) => {
      if (!disposed) {
        setPluginContext(toPluginContextData(context))
      }
    })

    const dispose = pixcall.preferences.onDidChange(({ key, value }: PreferenceChangeEvent) => {
      if (disposed) {
        return
      }

      if (key === 'locale') {
        setPluginContext((current) => (current ? { ...current, locale: value } : current))
      }

      if (key === 'colorMode') {
        setPluginContext((current) => (current ? { ...current, colorMode: value } : current))
      }
    })

    return () => {
      disposed = true
      dispose()
    }
  }, [])

  return pluginContext
}
