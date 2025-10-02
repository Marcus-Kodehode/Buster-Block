# Buster Block - Detailed File Structure

This document provides a detailed overview of the project's file structure and the purpose of each component.

## Root Directory

```
buster-block/
├── app/                    # Next.js App Router directory
│   ├── api/               # API route handlers
│   ├── (auth)/            # Authentication routes (grouped)
│   ├── movies/            # Movie-related pages
│   ├── favicon.ico        # Website favicon
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage component
├── components/            # Reusable React components
├── docs/                  # Project documentation
├── lib/                   # Core utilities and models
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Detailed Breakdown

### `/app` Directory
The core of the Next.js application using the App Router.

```
app/
├── api/
│   └── movies/
│       ├── route.ts               # GET all movies, POST new movie
│       └── [id]/
│           ├── route.ts           # GET, PUT, DELETE single movie
│           └── reviews/
│               └── route.ts       # GET reviews, POST new review
├── (auth)/
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx          # Sign in page
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx          # Sign up page
├── movies/
│   ├── [id]/
│   │   └── page.tsx              # Individual movie page
│   └── new/
│       └── page.tsx              # New movie form page
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx
```

### `/components` Directory
Reusable React components used throughout the application.

```
components/
├── MovieCard.tsx          # Movie preview card component
├── MovieForm.tsx          # Form for creating/editing movies
├── ReviewForm.tsx         # Form for submitting reviews
└── ReviewList.tsx         # Component to display movie reviews
```

### `/lib` Directory
Core utilities, database models, and validation schemas.

```
lib/
├── mongodb.ts             # MongoDB connection utility
├── models/
│   ├── Movie.ts          # Movie database model
│   └── Review.ts         # Review database model
└── validations/
    ├── movieSchema.ts    # Movie input validation schema
    └── reviewSchema.ts   # Review input validation schema
```

### `/public` Directory
Static assets served by Next.js.

```
public/
├──
├──
├──
├──
└──
```

### `/types` Directory
TypeScript type definitions.

```
types/
└── index.ts              # Shared TypeScript interfaces and types
```

## Root Configuration Files

- `middleware.ts` - Clerk authentication middleware
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration