<div align="center">
  <p>
    <img src="/public/images/personal-logo.png" alt="Personal Logo" width="150" />
  </p>
  <p>
    <img src="/public/images/buster-block-logo.png" alt="Buster Block Logo" width="150" />
  </p>
  
  # Buster Block
  
  > A full-stack movie review platform where film enthusiasts share their passion – Rate, review, and discover cinema!
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-000000.svg)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7-47a248.svg)](https://www.mongodb.com)
  [![Clerk](https://img.shields.io/badge/Clerk-Auth-6c47ff.svg)](https://clerk.com)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

## Features

- 🎬 Full CRUD operations for movies
- ⭐ Star-based rating system (1-5 stars)
- ✍️ Write and read detailed reviews
- 🔒 Secure authentication with Clerk
- 📝 Input validation with Zod schemas
- 🌐 RESTful API with proper status codes
- 📱 Fully responsive design
- 🎨 Dark mode optimized
- 🚀 Deployed on Vercel

## Screenshot

<div align="center">
  <img src="/public/images/buster-block-screenshot.png" alt="Buster Block Screenshot" width="900" />
</div>

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/Marcus-Kodehode/Buster-Block.git
cd Buster-Block
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

```
http://localhost:3000
```

## Built With

- **[Next.js](https://nextjs.org)** - React framework with App Router
- **[React](https://react.dev)** - JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org)** - Typed superset of JavaScript
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[MongoDB](https://www.mongodb.com)** - NoSQL database
- **[Mongoose](https://mongoosejs.com)** - MongoDB object modeling
- **[Clerk](https://clerk.com)** - Authentication and user management
- **[Zod](https://zod.dev)** - TypeScript-first schema validation

## Project Structure

```
buster-block/
├── app/
│   ├── api/
│   │   └── movies/          # API routes
│   │       ├── route.ts     # GET all, POST new
│   │       └── [id]/
│   │           ├── route.ts       # GET one, PUT update
│   │           └── reviews/
│   │               └── route.ts   # GET/POST reviews
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── movies/
│   │   ├── new/            # Add movie page
│   │   └── [id]/           # Movie details page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── MovieCard.tsx       # Movie card component
│   ├── MovieForm.tsx       # Add/edit movie form
│   ├── ReviewForm.tsx      # Add review form
│   └── ReviewList.tsx      # Reviews display component
├── lib/
│   ├── mongodb.ts          # Database connection
│   ├── models/
│   │   ├── Movie.ts        # Movie schema
│   │   └── Review.ts       # Review schema
│   └── validations/
│       ├── movieSchema.ts   # Movie validation
│       └── reviewSchema.ts  # Review validation
```

## API Documentation

### Movies Endpoints

#### `GET /api/movies`
Fetch all movies.
- **Response**: 200 OK
```json
{
  "success": true,
  "data": [
    {
      "title": "string",
      "director": "string",
      "releaseYear": "number",
      "genre": "string",
      "reviews": "array"
    }
  ]
}
```

#### `POST /api/movies`
Create a new movie (requires authentication).
- **Request Body**:
```json
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "releaseYear": 2010,
  "genre": "Sci-Fi"
}
```
- **Response**: 201 Created | 401 Unauthorized

#### `GET /api/movies/:id`
Fetch a single movie by ID.
- **Response**: 200 OK | 404 Not Found

#### `PUT /api/movies/:id`
Update a movie (requires authentication + ownership).
- **Response**: 200 OK | 403 Forbidden

### Reviews Endpoints

#### `GET /api/movies/:id/reviews`
Fetch all reviews for a movie.
- **Response**: 200 OK

#### `POST /api/movies/:id/reviews`
Create a review (requires authentication).
- **Request Body**:
```json
{
  "reviewText": "Amazing movie with great visuals!",
  "rating": 5
}
```
- **Response**: 201 Created | 409 Conflict

## Testing with Postman

A Postman collection is included for testing all API endpoints: `Buster-Block-API.postman_collection.json`

To import and use:
1. Open Postman
2. Click "Import"
3. Select the `Buster-Block-API.postman_collection.json` file
4. Test all endpoints with the provided examples

## Deployment

The application is deployed on Vercel with automatic CI/CD from GitHub.

### Environment Variables Required:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
```

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

The optimized build will be available in the `.next/` directory.

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <i>"All we have to decide is what to do with the films that are given to us."</i>
  <br>
  <sub>Built with ❤️ by Marcus-Kodehode</sub>
</div>
```