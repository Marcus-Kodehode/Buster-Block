// lib/genres.ts
export const GENRES = [
  "Action",
  "Animation",
  "Comedy",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

export type Genre = (typeof GENRES)[number];

const GENRE_VALUES = GENRES as readonly string[];
export const isGenre = (g: string): g is Genre => GENRE_VALUES.includes(g);
