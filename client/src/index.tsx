import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import ManageCatalog from './components/Catalog/ManageCatalog';
import ErrorPage from './components/Error';
import Genres from './components/Genres';
import GraphQL from './components/GraphQL';
import Home from './components/Home';
import Login from './components/Login';
import Movies from './components/Movies';
import EditMovie from './components/Movies/EditMovie';
import Movie from './components/Movies/Movie';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: '/movies', element: <Movies /> },
      { path: '/movies/:id', element: <Movie /> },
      { path: '/genres', element: <Genres /> },
      { path: '/admin/movie/0', element: <EditMovie /> },
      { path: '/admin/movie/:id', element: <EditMovie /> },
      { path: '/manage-catalog', element: <ManageCatalog /> },
      { path: '/graphql', element: <GraphQL /> },
      { path: '/login', element: <Login /> },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
