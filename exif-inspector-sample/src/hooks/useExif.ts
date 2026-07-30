import { useEffect, useState } from 'react'
import { parseExif, type ExifData } from '../lib/exif'

export type ExifState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'empty' }
  | { status: 'failed' }
  | { status: 'ready'; exif: ExifData }

export function useExif(originalUrl: string | null): ExifState {
  const [exifState, setExifState] = useState<ExifState>({ status: 'loading' })

  useEffect(() => {
    let disposed = false
    setExifState(originalUrl ? { status: 'loading' } : { status: 'missing' })

    if (!originalUrl) {
      return
    }

    parseExif(originalUrl)
      .then((exif) => {
        if (!disposed) {
          setExifState(exif ? { status: 'ready', exif } : { status: 'empty' })
        }
      })
      .catch(() => {
        if (!disposed) {
          setExifState({ status: 'failed' })
        }
      })

    return () => {
      disposed = true
    }
  }, [originalUrl])

  return exifState
}
