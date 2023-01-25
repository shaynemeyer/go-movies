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
import { moviesList } from '../../lib/test/data/mockMovies';

const Movies: FunctionComponent = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setMovies(moviesList);
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
              <TableCell>{m.release_date}</TableCell>
              <TableCell>{m.mpaa_rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Movies;
