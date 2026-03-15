import { useEffect } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Movie } from '../../types/movie'
import styles from './MovieModal.module.css'

export interface MovieModalProps {
  movie: Movie
  onClose: () => void
}

const BACKDROP_URL = 'https://image.tmdb.org/t/p/original'
const BACKDROP_PLACEHOLDER =
  'https://dummyimage.com/1200x675/0b1224/ffffff&text=Backdrop+Not+Available'

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const backdropSrc = movie.backdrop_path
    ? `${BACKDROP_URL}${movie.backdrop_path}`
    : BACKDROP_PLACEHOLDER

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          type="button"
          onClick={onClose}
        >
          &times;
        </button>

        <img
          src={backdropSrc}
          alt={movie.title}
          className={styles.image}
          loading="lazy"
        />

        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default MovieModal
