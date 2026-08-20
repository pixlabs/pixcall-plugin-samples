import React from 'react'
import pixcall from 'pixcall'
import { loadSlideshowItems, type SlideshowItem } from './initData'

type LoadState =
  | { type: 'loading' }
  | { type: 'ready'; items: SlideshowItem[] }
  | { type: 'error'; message: string }

const COMMANDS = {
  close: 'slideshow.close',
  next: 'slideshow.next',
  previous: 'slideshow.previous',
} as const

export default function App() {
  const [loadState, setLoadState] = React.useState<LoadState>({ type: 'loading' })
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [imageError, setImageError] = React.useState(false)
  const [transitionDirection, setTransitionDirection] = React.useState<'next' | 'previous'>('next')

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const context = await pixcall.getContext()
        const items = await loadSlideshowItems(context)
        if (!cancelled) {
          setLoadState({ type: 'ready', items })
        }
      } catch {
        if (!cancelled) {
          setLoadState({ type: 'error', message: 'Unable to load the selected images.' })
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    if (loadState.type !== 'ready') {
      return
    }

    return pixcall.commands.register({
      [COMMANDS.close]: () => pixcall.window.close(),
      [COMMANDS.previous]: () => {
        setTransitionDirection('previous')
        setImageError(false)
        setCurrentIndex((index) => Math.max(index - 1, 0))
      },
      [COMMANDS.next]: () => {
        setTransitionDirection('next')
        setImageError(false)
        setCurrentIndex((index) => Math.min(index + 1, loadState.items.length - 1))
      },
    })
  }, [loadState])

  if (loadState.type === 'loading') {
    return <StatusMessage message="Loading images…" />
  }

  if (loadState.type === 'error') {
    return <StatusMessage message={loadState.message} />
  }

  if (loadState.items.length === 0) {
    return <StatusMessage message="No selected files to show." />
  }

  const item = loadState.items[currentIndex]
  if (!item) {
    return <StatusMessage message="The selected file is unavailable." />
  }

  const isFirst = currentIndex === 0
  const isLast = currentIndex === loadState.items.length - 1

  return (
    <main className="slideshow" aria-label="Selected files slideshow">
      <div className="stage">
        <div className={`slide slide-${transitionDirection}`} key={item.id}>
          {item.src && !imageError ? (
            // biome-ignore lint/a11y/noNoninteractiveElementInteractions: image load errors need an in-place fallback
            <img
              alt={item.name}
              className={item.kind === 'thumbnail' ? 'thumbnail' : 'image'}
              height={item.height || undefined}
              onError={() => setImageError(true)}
              src={item.src}
              width={item.width || undefined}
            />
          ) : (
            <div className="item-placeholder">
              <span className="placeholder-symbol" aria-hidden="true">
                {item.kind === 'thumbnail' ? '▧' : '!'}
              </span>
              <span>
                {item.kind === 'thumbnail'
                  ? 'Thumbnail unavailable.'
                  : 'Unable to display this image.'}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        aria-label="Previous image"
        className="navigation previous"
        disabled={isFirst}
        onClick={() => {
          setTransitionDirection('previous')
          setImageError(false)
          setCurrentIndex((index) => Math.max(index - 1, 0))
        }}
        type="button"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="28"
          viewBox="0 0 24 24"
          width="28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </svg>
      </button>

      <button
        aria-label="Next image"
        className="navigation next"
        disabled={isLast}
        onClick={() => {
          setTransitionDirection('next')
          setImageError(false)
          setCurrentIndex((index) => Math.min(index + 1, loadState.items.length - 1))
        }}
        type="button"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="28"
          viewBox="0 0 24 24"
          width="28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </svg>
      </button>

      <footer className="footer">
        <span className="filename">{item.name}</span>
        <span className="counter">
          {currentIndex + 1} / {loadState.items.length}
        </span>
      </footer>
    </main>
  )
}

function StatusMessage({ message }: { message: string }) {
  return <main className="slideshow status" aria-live="polite">
    <p>{message}</p>
  </main>
}
