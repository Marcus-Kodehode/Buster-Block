// types/index.ts
export type Movie = {
  _id: string;
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
  description?: string; // NY
  runtime?: number; // NY
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  _id: string;
  movieId: string;
  userId: string;
  reviewAuthor: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
