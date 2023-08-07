import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../lib/models/movies';

const Movies: FunctionComponent = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const requestOptions = {
      method: 'GET',
      headers,
    };

    fetch(`${process.env.REACT_APP_BACKEND}/movies`, requestOptions)
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Movies</h2>
      <hr />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Movie</TableCell>
            <TableCell>Release Date</TableCell>
            <TableCell>Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <Link to={`/movies/${m.id}`}>{m.title}</Link>
              </TableCell>
              <TableCell>
                {new Date(m.release_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{m.mpaa_rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Movies;
