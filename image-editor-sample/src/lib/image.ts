import type { PercentCrop } from 'react-image-crop'

export function cropImage(
  image: HTMLImageElement,
  crop: PercentCrop,
  mimeType = 'image/png',
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const width = image.naturalWidth * (crop.width / 100)
  const height = image.naturalHeight * (crop.height / 100)

  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))

  const context = canvas.getContext('2d')
  if (!context) {
    return Promise.reject(new Error('Canvas is not available'))
  }

  context.drawImage(
    image,
    image.naturalWidth * (crop.x / 100),
    image.naturalHeight * (crop.y / 100),
    width,
    height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to create image'))
      }
    }, mimeType)
  })
}
