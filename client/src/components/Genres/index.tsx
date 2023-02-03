import { List, ListItem, ListItemButton } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenreResponse } from '../../lib/models/genres';
import { ErrorResponse } from '../../lib/models/response';

const Genres: FunctionComponent = () => {
  const [genres, setGenres] = useState<GenreResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
    };

    fetch('/genres', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if ((data as ErrorResponse).error) {
          setError(data?.message);
        } else {
          setGenres(data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (error !== null) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Genres</h2>
      <hr />
      <List>
        {genres.map((g) => (
          <ListItem key={g.id}>
            <ListItemButton
              onClick={() => {
                navigate(`/genres/${g.id}`, {
                  state: {
                    genreName: g.genre,
                  },
                });
              }}
            >
              {g.genre}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Genres;
