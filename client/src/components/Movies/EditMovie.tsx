import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Genre, Movie } from '../../lib/models/movies';
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
    image: '',
  };

  const [error, setError] = useState(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [movie, setMovie] = useState<Movie>({ ...initialMovie });

  interface MPAAOption {
    id: string;
    value: string;
  }
  const mpaaOptions: MPAAOption[] = [
    { id: 'G', value: 'G' },
    { id: 'PG', value: 'PG' },
    { id: 'PG13', value: 'PG13' },
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
          }));
        })
        .catch((err) => console.error(err));
    } else {
      // editing a movie
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

    setMovie({
      ...movie,
      genres: tmpArr,
    });
  };

  return (
    <div>
      <h2>Add/Edit Movie</h2>

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
};

export default EditMovie;
