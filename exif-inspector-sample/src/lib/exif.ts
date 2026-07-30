import exifr from 'exifr'

export const EXIF_TAGS = [
  'Make',
  'Model',
  'LensModel',
  'DateTimeOriginal',
  'ExposureTime',
  'FNumber',
  'ISO',
  'FocalLength',
  'FocalLengthIn35mmFilm',
  'Orientation',
  'PixelXDimension',
  'PixelYDimension',
] as const

export type ExifData = Record<string, unknown>

export type ExifLabels = {
  'exif.make': string
  'exif.model': string
  'exif.lens': string
  'exif.date_taken': string
  'exif.exposure_time': string
  'exif.aperture': string
  'exif.iso': string
  'exif.focal_length': string
  'exif.focal_length_35mm': string
  'exif.orientation': string
  'exif.dimensions': string
}

type ExifField = {
  label: keyof ExifLabels
  tags: readonly string[]
}

const fields: readonly ExifField[] = [
  { label: 'exif.make', tags: ['Make'] },
  { label: 'exif.model', tags: ['Model'] },
  { label: 'exif.lens', tags: ['LensModel'] },
  { label: 'exif.date_taken', tags: ['DateTimeOriginal'] },
  { label: 'exif.exposure_time', tags: ['ExposureTime'] },
  { label: 'exif.aperture', tags: ['FNumber'] },
  { label: 'exif.iso', tags: ['ISO'] },
  { label: 'exif.focal_length', tags: ['FocalLength'] },
  { label: 'exif.focal_length_35mm', tags: ['FocalLengthIn35mmFilm'] },
  { label: 'exif.orientation', tags: ['Orientation'] },
  { label: 'exif.dimensions', tags: ['PixelXDimension', 'PixelYDimension'] },
]

export async function parseExif(url: string): Promise<ExifData | undefined> {
  return exifr.parse(url, { pick: [...EXIF_TAGS] }) as Promise<ExifData | undefined>
}

export function getExifRows(
  exif: ExifData,
  labels: ExifLabels,
  locale: string
): Array<{ label: string; value: string }> {
  return fields.flatMap(({ label, tags }) => {
    const value = getFieldValue(exif, tags)
    if (value === undefined) {
      return []
    }

    const formatted = formatValue(label, value, locale)
    return formatted ? [{ label: labels[label], value: formatted }] : []
  })
}

function getFieldValue(exif: ExifData, tags: readonly string[]) {
  if (tags.length === 2) {
    const [width, height] = tags.map((tag) => exif[tag])
    return typeof width === 'number' && typeof height === 'number'
      ? `${formatNumber(width)} × ${formatNumber(height)}`
      : undefined
  }

  return exif[tags[0]]
}

function formatValue(label: keyof ExifLabels, value: unknown, locale: string): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (label === 'exif.date_taken' && value instanceof Date) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(value)
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return ''
  }

  switch (label) {
    case 'exif.exposure_time':
      return value > 0 && value < 1 ? `1/${Math.round(1 / value)} s` : `${formatNumber(value)} s`
    case 'exif.aperture':
      return `f/${formatNumber(value)}`
    case 'exif.focal_length':
    case 'exif.focal_length_35mm':
      return `${formatNumber(value)} mm`
    case 'exif.orientation':
      return formatOrientation(value)
    default:
      return formatNumber(value)
  }
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)))
}

function formatOrientation(value: number): string {
  return (
    {
      1: 'Horizontal',
      3: 'Rotate 180°',
      6: 'Rotate 90° clockwise',
      8: 'Rotate 270° clockwise',
    }[value] ?? String(value)
  )
}
