import type { Movie } from '../../types/movie'
import styles from './MovieGrid.module.css'

export interface MovieGridProps {
  movies: Movie[]
  onSelect: (movie: Movie) => void
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const PLACEHOLDER =
  'https://dummyimage.com/500x750/101829/ffffff&text=No+Poster+Available'

const MovieGrid = ({ movies, onSelect }: MovieGridProps) => {
  if (!movies.length) {
    return null
  }

  return (
    <ul className={styles.grid}>
      {movies.map(movie => {
        const posterSrc = movie.poster_path
          ? `${IMAGE_BASE_URL}${movie.poster_path}`
          : PLACEHOLDER

        return (
          <li key={movie.id}>
            <div
              className={styles.card}
              onClick={() => onSelect(movie)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  onSelect(movie)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <img
                className={styles.image}
                src={posterSrc}
                alt={movie.title}
                loading="lazy"
              />
              <h2 className={styles.title}>{movie.title}</h2>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default MovieGrid
