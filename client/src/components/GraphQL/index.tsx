import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { GraphQLMovieResponse } from '../../lib/models/movies';
import Input from '../form/Input';

const GraphQL: FunctionComponent = () => {
  const [movies, setMovies] = useState<GraphQLMovieResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fullList, setFullList] = useState<GraphQLMovieResponse[]>([]);

  const performSearch = () => {
    const payload = `
      {
        search(titleContains: "${searchTerm}") {
          id
          title
          runtime
          release_date
          mpaa_rating
        }
      }`;

    const headers = new Headers({ 'Content-Type': 'application/graphql' });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      body: payload,
    };

    fetch(`${process.env.REACT_APP_BACKEND}/graph`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        let theList = Object.values(
          response.data.search
        ) as unknown as GraphQLMovieResponse[];
        setMovies(theList);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const payload = `
      {
        list {
          id
          title
          runtime
          release_date
          mpaa_rating
        }
      }
    `;

    const headers = new Headers({ 'Content-Type': 'application/graphql' });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      body: payload,
    };

    fetch(`${process.env.REACT_APP_BACKEND}/graph`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let theList = Object.values(
          data.data.list
        ) as unknown as GraphQLMovieResponse[];
        setMovies(theList);
        setFullList(theList);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    let value = event.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      performSearch();
    } else {
      setMovies(fullList);
    }
  };

  return (
    <div>
      <h2>GraphQL</h2>
      <hr />

      <form onSubmit={handleSubmit}>
        <Input
          title="Search"
          type="search"
          name="search"
          value={searchTerm}
          testId="search-input"
          onChange={handleChange}
          errorMsg="Please enter a search term"
        />
      </form>

      {movies ? (
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
                  {new Date(m.release_date).toLocaleString()}
                </TableCell>
                <TableCell>{m.mpaa_rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No movies</p>
      )}
    </div>
  );
};

export default GraphQL;
