export interface GenreResponse {
  id: number;
  genre: string;
  checked: boolean;
}

export interface GenreMovieResponse {
  id: number;
  title: string;
  release_date: string;
  runtime: number;
  mpaa_rating: string;
  description: string;
  image: string;
}
