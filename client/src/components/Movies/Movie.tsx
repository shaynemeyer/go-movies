import { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Movie as MovieType } from '../../lib/models/movies';
import { moviesList } from '../../lib/test/data/mockMovies';

const Movie: FunctionComponent = () => {
  const [movie, setMovie] = useState<MovieType>();
  const { id } = useParams();

  useEffect(() => {
    const movie = moviesList.find((movie) => movie.id === Number(id));
    setMovie(movie);
  }, [id]);

  return (
    <div>
      <h2>Movie: {movie && movie.title}</h2>
      {movie && (
        <small>
          <em>
            {movie.release_date}, {movie.runtime} minutes, Rated{' '}
            {movie.mpaa_rating}
          </em>
        </small>
      )}
      <hr />
      {movie && <p>{movie.description}</p>}
    </div>
  );
};

export default Movie;
