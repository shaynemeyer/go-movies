import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Movie } from '../../lib/models/movies';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';
import Swal from 'sweetalert2';

interface OutletContextType {
  jwtToken: string;
}

const ManageCatalog: FunctionComponent = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { jwtToken } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtToken === '') {
      navigate('/login');
      return;
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + jwtToken);

    const requestOptions = {
      method: 'GET',
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_BACKEND}/admin/movies`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [jwtToken, navigate]);

  const handleEdit = (id: number) => {
    navigate(`/admin/movie/${id}`);
  };

  const confirmDelete = (id: number) => {
    Swal.fire({
      title: 'Delete movie?',
      text: 'You cannot undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + jwtToken);

        const requestOptions: RequestInit = {
          method: 'DELETE',
          headers: headers,
        };

        fetch(
          `${process.env.REACT_APP_BACKEND}/admin/movies/${id}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              console.log(data.error);
            } else {
              navigate('/movies');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div>
      <h2>Manage Catalog</h2>
      <hr />
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Movie</th>
            <th>Release Date</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.id}>
              <td>
                <IconButton
                  aria-label="Edit Movie"
                  title="Edit Movie"
                  onClick={() => handleEdit(m.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="Edit Movie"
                  title="Delete Movie"
                  onClick={() => confirmDelete(m.id)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </td>
              <td>{m.title}</td>
              <td style={{ textAlign: 'center', margin: '0 2rem' }}>
                {new Date(m.release_date).toLocaleDateString()}
              </td>
              <td>{m.mpaa_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCatalog;
