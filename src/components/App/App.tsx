import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import type { Movie, MovieSearchResponse } from '../../types/movie';
import styles from './App.module.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery<MovieSearchResponse>({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: Boolean(searchQuery),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data && data.results.length === 0 && !isFetching) {
      toast.error('No movies found for your request.');
    }
  }, [data, isFetching]);

  useEffect(() => {
    if (isError) {
      toast.error('There was an error, please try again...');
    }
  }, [isError]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={styles.app}>
      <Toaster
        position="top-center"
        toastOptions={{
          error: {
            duration: 3000,
            style: {
              background: '#fff',
              color: '#212121',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
            },
            iconTheme: {
              primary: '#d32f2f',
              secondary: '#fff',
            },
          },
        }}
      />

      <SearchBar onSubmit={handleSearch} />

      <main className={styles.main}>
        {(isLoading || isFetching) && <Loader />}
        {!isLoading && isError && <ErrorMessage />}
        {movies.length > 0 && (
          <>
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                breakLabel="..."
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
            <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
