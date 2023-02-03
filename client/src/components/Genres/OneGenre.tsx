import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { GenreMovieResponse } from '../../lib/models/genres';
import { ErrorResponse } from '../../lib/models/response';

export const OneGenre: FunctionComponent = () => {
  const location = useLocation();
  const { genreName } = location.state;

  const [movies, setMovies] = useState<GenreMovieResponse[]>([]);

  const { id } = useParams();

  useEffect(() => {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
    };

    fetch(`/movies/genres/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if ((data as ErrorResponse).error) {
            console.log(data.message);
          } else {
            setMovies(data);
          }
        }
      })
      .catch((err) => console.log(err));
  }, [id]);
  return (
    <>
      <h2>{genreName}</h2>
      <hr />
      {movies.length > 0 ? (
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
      ) : (
        <p>No movies in this genre.</p>
      )}
    </>
  );
};
