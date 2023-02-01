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
