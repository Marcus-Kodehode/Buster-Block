// types/index.ts

// Frontend-vennlige typer (uten Mongoose-spesifikke ting)
export type Movie = {
  _id: string;
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
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

// API response types
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
