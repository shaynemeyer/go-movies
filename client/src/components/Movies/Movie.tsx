import { Chip, dividerClasses } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Movie as MovieType } from '../../lib/models/movies';
import { moviesList } from '../../lib/test/data/mockMovies';

const Movie: FunctionComponent = () => {
  const [movie, setMovie] = useState<MovieType>();
  const { id } = useParams();

  useEffect(() => {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
    };

    fetch(`${process.env.REACT_APP_BACKEND}/movies/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setMovie(data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (movie && movie?.genres) {
    movie.genres = Object.values(movie.genres);
  } else {
    if (movie) {
      movie.genres = [];
    }
  }
  return (
    <div>
      <h2>Movie: {movie && movie.title}</h2>
      {movie && (
        <>
          <small>
            <em>
              {movie.release_date}, {movie.runtime} minutes, Rated{' '}
              {movie.mpaa_rating}
            </em>
          </small>
          <br />
        </>
      )}
      {movie?.genres.map((g) => (
        <Chip key={g.genre} label={g.genre} />
      ))}
      <hr />

      {movie?.image !== '' && (
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w200/${movie?.image}`}
            alt="poster"
          />
        </div>
      )}

      {movie && <p>{movie.description}</p>}
    </div>
  );
};

export default Movie;
