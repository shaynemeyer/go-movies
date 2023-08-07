import {
  Button,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { request } from './lib/fetch/request';

interface TokenResponse {
  access_token: string;
}

function App() {
  const [jwtToken, setJwtToken] = useState('');

  const [tickInterval, setTickInterval] = useState<
    number | NodeJS.Timer | null
  >(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    const requestOptions: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };

    fetch(`${process.env.REACT_APP_BACKEND}/logout`, requestOptions)
      .catch((error) => console.log('error logging out', error))
      .finally(() => {
        setJwtToken('');
        toggleRefresh(false);
      });

    navigate('/login');
  };

  const toggleRefresh = useCallback(
    (status: boolean) => {
      console.log('clicked');

      if (status) {
        console.log('turning on ticking');
        let i = setInterval(() => {
          const requestOptions: RequestInit = {
            method: 'GET',
            credentials: 'include',
          };

          fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
              if (data.access_token) {
                setJwtToken(data.access_token);
              }
            })
            .catch((error) => console.log('user is not logged in'));
        }, 600000);
        setTickInterval(i);
        console.log('setting tick interval to', i);
      } else {
        console.log('turning off ticking');
        console.log('turning off tickInterval', tickInterval);
        if (tickInterval) {
          clearInterval(tickInterval);
        }

        setTickInterval(null);
      }
    },
    [tickInterval]
  );

  useEffect(() => {
    if (jwtToken === '') {
      const requestOptions: RequestInit = {
        method: 'GET',
        credentials: 'include',
      };

      request<TokenResponse>(
        `${process.env.REACT_APP_BACKEND}/refresh`,
        requestOptions
      )
        .then((token) => {
          if (token.access_token) {
            setJwtToken(token.access_token);
            toggleRefresh(true);
          }
        })
        .catch((error) => {
          console.log('user is not logged in', error);
        });
    }
  }, [jwtToken, toggleRefresh]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ my: 4 }} justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" component="h1" gutterBottom>
            Go Watch a Movie
          </Typography>
        </Grid>
        <Grid item alignContent="right">
          {jwtToken === '' ? (
            <Button variant="contained" onClick={() => navigate('/login')}>
              Login
            </Button>
          ) : (
            <Button color="warning" variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <List
            sx={{
              maxWidth: '200px',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              borderRadius: '5px',
            }}
          >
            <ListItemButton onClick={() => navigate('/')}>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/movies')}>
              <ListItemText primary="Movies" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/genres')}>
              <ListItemText primary="Genres" />
            </ListItemButton>
            {jwtToken !== '' && (
              <>
                <ListItemButton onClick={() => navigate('/admin/movie/0')}>
                  <ListItemText primary=" Add Movie" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/manage-catalog')}>
                  <ListItemText primary="Manage Catalog" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/graphql')}>
                  <ListItemText primary="GraphQL" />
                </ListItemButton>
              </>
            )}
          </List>
        </Grid>
        <Grid item xs={6} md={8}>
          <Outlet
            context={{
              jwtToken,
              setJwtToken,
              toggleRefresh,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
