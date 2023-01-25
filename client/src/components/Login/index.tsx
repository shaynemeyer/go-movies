import { Alert, Button, Grid, TextField } from '@mui/material';
import {
  Dispatch,
  FormEvent,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

interface OutletContextType {
  setJwtToken: Dispatch<SetStateAction<string>>;
}

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const { setJwtToken } = useOutletContext<OutletContextType>();

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    setLoginError('');

    if (email === 'admin@password.com') {
      setJwtToken('asldfkjasdlfj');
      setLoginError('');
      navigate('/');
    }

    setLoginError('Bad username or password, please try again');
  };
  return (
    <div>
      <h2>Login</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <Grid
          container
          direction="column"
          spacing={2}
          sx={{ my: '1rem', maxWidth: '300px', margin: 'auto' }}
        >
          <Grid item>
            <TextField
              type="email"
              label="Email"
              placeholder="Email"
              fullWidth
              name="email"
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              type="password"
              placeholder="Password"
              fullWidth
              name="password"
              variant="outlined"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Grid>

          <Grid item>
            {loginError && (
              <Alert severity="error" sx={{ marginBottom: '1rem' }}>
                {loginError}!
              </Alert>
            )}
            <Button variant="contained" type="submit">
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Login;
