import type { Entry, PluginContext } from 'pixcall'
import pixcall from 'pixcall'

const TRAILING_SLASHES = /\/+$/

export interface SlideshowItem {
  id: string
  kind: 'image' | 'thumbnail'
  name: string
  src: string | null
  width: number
  height: number
}

export async function loadSlideshowItems(context: PluginContext | null): Promise<SlideshowItem[]> {
  const entryIds = context?.invocation?.selection?.entryIds ?? []
  if (entryIds.length === 0) {
    return []
  }

  const entries = await pixcall.entries.getByIds<Entry>(entryIds)
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]))
  const fileServer = context?.library.fileServer?.replace(TRAILING_SLASHES, '')

  return entryIds.flatMap((entryId) => {
    const entry = entriesById.get(entryId)
    if (!entry) {
      return []
    }

    const isImage = entry.mediaType === 'image' || entry.contentType.startsWith('image/')
    const path = isImage
      ? `masters/${encodeURIComponent(entry.id)}`
      : entry.contentHash &&
        `thumbs/${encodeURIComponent(entry.contentHash)}?thumb=${entry.hasThumb}`

    return [
      {
        id: entry.id,
        kind: isImage ? ('image' as const) : ('thumbnail' as const),
        name: entry.name,
        src: fileServer && path ? `${fileServer}/${path}` : null,
        width: isImage ? entry.imageWidth : entry.thumbWidth,
        height: isImage ? entry.imageHeight : entry.thumbHeight,
      },
    ]
  })
}
