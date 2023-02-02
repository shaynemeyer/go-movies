import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Genre, Movie, MovieRequest } from '../../lib/models/movies';
import Dropdown from '../form/Dropdown';
import Input from '../form/Input';
import TextArea from '../form/TextArea';

interface OutletContextType {
  jwtToken: string;
}

const EditMovie: FunctionComponent = () => {
  const navigate = useNavigate();
  const { jwtToken } = useOutletContext<OutletContextType>();

  const initialMovie: Movie = {
    id: 0,
    title: '',
    release_date: '',
    runtime: '',
    mpaa_rating: '',
    description: '',
    genres: [],
    genres_array: [],
    image: '',
  };

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [movie, setMovie] = useState<Movie>({ ...initialMovie });

  interface MPAAOption {
    id: string;
    value: string;
  }
  const mpaaOptions: MPAAOption[] = [
    { id: 'G', value: 'G' },
    { id: 'PG', value: 'PG' },
    { id: 'PG-13', value: 'PG-13' },
    { id: 'R', value: 'R' },
    { id: 'NC17', value: 'NC17' },
    { id: '18A', value: '18A' },
  ];

  const hasError = (key: string) => {
    return errors.indexOf(key) !== -1;
  };

  // get id from the URL
  let { id } = useParams();
  if (id === undefined) {
    id = '0';
  }

  useEffect(() => {
    if (jwtToken === '') {
      navigate('/login');
      return;
    }

    if (id === '0') {
      // adding a movie
      setMovie({
        id: 0,
        title: '',
        release_date: '',
        runtime: '',
        mpaa_rating: '',
        description: '',
        genres: [],
        genres_array: [],
        image: '',
      });

      const headers = new Headers({ 'Content-Type': 'application/json' });

      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
      };

      fetch(`/genres`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const checks: Genre[] = [];
          data.forEach((g: Genre) => {
            checks.push({ id: g.id, checked: false, genre: g.genre });
          });

          setMovie((m) => ({
            ...m,
            genres: checks,
            genres_array: [],
          }));
        })
        .catch((err) => console.error(err));
    } else {
      // editing a movie
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${jwtToken}`);

      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
      };

      fetch(`/admin/movies/${id}`, requestOptions)
        .then((response) => {
          if (response.status !== 200) {
            setError(`Invalid response code: ${response.status}`);
          }
          return response.json();
        })
        .then(({ movie, genres }: { movie: MovieRequest; genres: Genre[] }) => {
          const newMovie: Movie = {
            id: movie.id,
            title: movie.title,
            release_date: new Date(movie.release_date)
              .toISOString()
              .split('T')[0],
            runtime: `${movie.runtime}`,
            mpaa_rating: movie.mpaa_rating,
            description: movie.description,
            genres: movie.genres,
            genres_array: movie.genres_array,
            image: movie.image,
          };

          const checks: Genre[] = [];

          genres.forEach((g) => {
            if (movie.genres_array.indexOf(g.id) !== -1) {
              checks.push({ id: g.id, checked: true, genre: g.genre });
            } else {
              checks.push({ id: g.id, checked: false, genre: g.genre });
            }
          });

          setMovie({
            ...newMovie,
            genres: checks,
          });
        })
        .catch((err) => console.log(err));
    }
  }, [id, jwtToken, navigate]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    let errors: string[] = [];

    let required = [
      { field: movie.title, name: 'title' },
      { field: movie.release_date, name: 'release_date' },
      { field: movie.runtime, name: 'runtime' },
      { field: movie.description, name: 'description' },
      { field: movie.mpaa_rating, name: 'mpaa_rating' },
    ];

    required.forEach(function (obj) {
      if (obj.field === '') {
        errors.push(obj.name);
      }
    });

    let tmpArr = movie.genres;
    const genresSelected = tmpArr.filter((genre) => genre.checked);

    if (genresSelected.length === 0) {
      errors.push('genres');
    }

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    }

    // passed validation, now save changes
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${jwtToken}`);

    // assume we are adding a new movie
    let method = 'PUT';

    if (movie.id > 0) {
      method = 'PATCH';
    }

    const requestBody: MovieRequest = {
      id: movie.id,
      title: movie.title,
      release_date: new Date(movie.release_date),
      runtime: parseInt(movie.runtime, 10),
      mpaa_rating: movie.mpaa_rating,
      description: movie.description,
      genres: movie.genres,
      genres_array: movie.genres_array,
      image: movie.image,
    };

    let requestOptions: RequestInit = {
      body: JSON.stringify(requestBody),
      method,
      headers,
      credentials: 'include',
    };

    fetch(`/admin/movies/${movie.id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          console.log(data);
        } else {
          navigate('/manage-catalog');
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange =
    (_: string) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value = event.target.value;
      let name = event.target.name;

      setMovie({
        ...movie,
        [name]: value,
      });
    };
  const handleChecked = (
    event: ChangeEvent<HTMLInputElement>,
    position: number
  ) => {
    let tmpArr = movie.genres;
    tmpArr[position].checked = !tmpArr[position].checked;

    let tmpIDs = movie.genres_array;
    if (!event.target.checked) {
      tmpIDs.splice(tmpIDs.indexOf(parseInt(event.target.value, 10)));
    } else {
      tmpIDs.push(parseInt(event.target.value, 10));
    }

    setMovie({
      ...movie,
      genres: tmpArr,
      genres_array: tmpIDs,
    });
  };

  if (error !== null) {
    return <div>Error: {error}</div>;
  } else {
    return (
      <div>
        <h2>{id === '0' ? 'Add' : 'Edit'} Movie</h2>

        <hr />
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={movie.id} id="id" />

          <Input
            title={'Title'}
            type={'text'}
            name={'title'}
            value={movie.title}
            testId="movie-title"
            onChange={handleChange('title')}
            errorMsg={'Please enter a title'}
            hasError={hasError('title')}
          />
          <br />
          <Input
            title={'Release Date'}
            type={'date'}
            name={'release_date'}
            value={movie.release_date}
            testId="movie-release-date"
            onChange={handleChange('release_date')}
            errorMsg={'Please enter a release date'}
            hasError={hasError('release_date')}
          />

          <Input
            title={'Runtime'}
            type={'text'}
            name={'runtime'}
            value={movie.runtime}
            testId="movie-runtime"
            onChange={handleChange('runtime')}
            errorMsg={'Please enter a runtime'}
            hasError={hasError('runtime')}
          />

          <Dropdown
            title="MPAA Rating"
            name={'mpaa_rating'}
            value={movie.mpaa_rating}
            onChange={handleChange('mpaa_rating')}
            options={mpaaOptions}
            hasError={hasError('mpaa_rating')}
            errorMsg={'Please choose'}
            testId="mpaa-rating"
          />

          <TextArea
            title={'Description'}
            name={'description'}
            value={`${movie.description}`}
            testId="movie-description"
            onChange={handleChange('description')}
            hasError={hasError('description')}
            errorMsg={'Please enter a description'}
            rows={4}
          />
          <br />
          <br />
          <hr />

          <h3>Genres</h3>

          {movie.genres && movie.genres.length > 1 && (
            <>
              {Array.from(movie.genres).map((g, index) => (
                <FormControlLabel
                  sx={{ width: '100%' }}
                  key={index}
                  label={g.genre}
                  control={
                    <Checkbox
                      checked={movie.genres[index].checked}
                      name={'genre'}
                      onChange={(event) => handleChecked(event, index)}
                      value={g.id}
                    />
                  }
                />
              ))}
            </>
          )}

          {hasError('genres') && (
            <Typography sx={{ color: 'red' }}>
              You must select at least 1 genre.
            </Typography>
          )}
          <br />
          <hr />
          <br />
          <Button type="submit" variant="contained">
            Save
          </Button>
        </form>
      </div>
    );
  }
};

export default EditMovie;
