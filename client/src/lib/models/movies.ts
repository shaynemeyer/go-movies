export interface Genre {
  id: number;
  genre: string;
  checked: boolean;
}

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  runtime: string;
  mpaa_rating: string;
  description: string;
  genres: Genre[];
  genres_array: number[];
  image: string;
}

export interface MovieRequest {
  id: number;
  title: string;
  release_date: Date;
  runtime: number;
  mpaa_rating: string;
  description: string;
  genres: Genre[];
  genres_array: number[];
  image: string;
}

export interface GraphQLMovieResponse {
  id: number;
  title: string;
  description: string;
  release_date: Date;
  runtime: number;
  mpaa_rating: string;
  created_at: string;
  updated_at: string;
  image: string;
}
