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
  image: string;
}
