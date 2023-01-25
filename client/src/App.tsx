import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function App() {
  const [jwtToken, setJwtToken] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    setJwtToken('');
    navigate('/login');
  };

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
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
