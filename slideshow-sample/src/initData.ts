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
  const entries = context?.invocation?.selection?.entryIds
    ? await pixcall.entries.getByIds<Entry>(context.invocation.selection.entryIds)
    : await getSelectedEntries()
  if (entries.length === 0) {
    return []
  }

  const fileServer = context?.library.fileServer?.replace(TRAILING_SLASHES, '')

  return entries.flatMap((entry) => {
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

async function getSelectedEntries(): Promise<Entry[]> {
  const entries: Entry[] = []
  let cursor: string | undefined
  do {
    const page = await pixcall.entries.getSelected<Entry>({ cursor })
    entries.push(...page.entries)
    cursor = page.nextCursor ?? undefined
  } while (cursor)
  return entries
}
