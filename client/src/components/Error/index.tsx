import { Box, Container } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <Container maxWidth="md">
      <Box>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred! </p>
        <p>
          <em>
            {(isRouteErrorResponse(error) && error.statusText) ||
              (error instanceof Error && error.message)}
          </em>
        </p>
      </Box>
    </Container>
  );
};

export default ErrorPage;
