import { useState, useEffect } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import fetchMovies from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { type Movie } from '../../types/movie';
import { toast, Toaster } from 'react-hot-toast';
import css from './App.module.css'

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setQuery(query);
  }
  useEffect(() => {
    if (!query) return;
    setMovies([]);
    setIsError(false);
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchMovies(query);
        if (data.results.length === 0) {
          toast.error("No movies found for your request.");
        }
        setMovies(data.results)
      } catch (error) {
        setIsError(true);
        if (error instanceof Error) console.log(error.message);
        
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query])

  const handleSelect = (movie: Movie) => { 
    setSelectedMovie(movie);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const handleClose = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
    document.body.style.overflow = "";
  }


  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />
      {isError? <ErrorMessage/> :
        isLoading? <Loader/> : (movies.length > 0 &&
        <MovieGrid movies={movies} onSelect={handleSelect} />
        )}
      {isModalOpen && selectedMovie && <MovieModal movie={selectedMovie} onClose={handleClose}/>
      }
    </div>
  )
}

export default App
