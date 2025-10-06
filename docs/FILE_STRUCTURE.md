# Buster Block - Detailed File Structure

This document provides a detailed overview of the project's file structure and the purpose of each component. Each section includes information about the files and their responsibilities within the application.

## Root Directory

```
buster-block/
├── app/                    # Next.js App Router directory
│   ├── api/               # API route handlers
│   ├── (auth)/            # Authentication routes (grouped)
│   ├── movies/            # Movie-related pages
│   ├── favicon.ico        # Website favicon
│   ├── globals.css        # Global styles
│   ├── HomeClient.tsx     # Client-side home component
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage component
├── components/            # Reusable React components
├── docs/                  # Project documentation
├── i18n/                  # Internationalization files
├── lib/                   # Core utilities and models
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── .github/              # GitHub specific files
└── docs/                 # Project documentation
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
│               ├── route.ts       # GET reviews, POST new review
│               └── [reviewId]/
│                   └── route.ts   # DELETE individual review
├── (auth)/
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx          # Sign in page with Clerk
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx          # Sign up page with Clerk
├── movies/
│   ├── [id]/
│   │   ├── page.tsx              # Individual movie page
│   │   └── edit/
│   │       └── page.tsx          # Edit movie page
│   └── new/
│       └── page.tsx              # New movie form page
├── favicon.ico                    # Site favicon
├── globals.css                    # Global styles and design tokens
├── HomeClient.tsx                 # Client-side home page component
├── layout.tsx                     # Root layout with navigation
└── page.tsx                       # Server-side home page
```

### `/components` Directory
Reusable React components used throughout the application.

```
components/
├── DeleteButton.tsx       # Reusable delete button with confirmation
├── EditMovieForm.tsx      # Form for editing existing movies
├── MovieCard.tsx          # Movie preview card component
├── MovieFilters.tsx      # Filtering and sorting interface
├── MovieForm.tsx         # Form for creating new movies
├── ReviewForm.tsx        # Form for submitting movie reviews
└── ReviewList.tsx        # Component to display movie reviews
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
├── icons/                # Icon assets
│   ├── en.png           # English language icon
│   ├── mx.png           # Mexican language icon
│   ├── no.png           # Norwegian language icon
│   ├── tr.png           # Turkish language icon
│   ├── tw.png           # Traditional Chinese language icon
│   └── tz.png           # Swahili language icon
└── images/
    ├── logo.png         # Site logo
    └── MBlogo.png       # Personal logo
```

### `/types` Directory
TypeScript type definitions.

```
types/
└── index.ts              # Shared TypeScript interfaces and types
```

### `/i18n` Directory
Internationalization and translation files.

```
i18n/
├── en.json              # English translations
├── es-MX.json          # Spanish (Mexico) translations
├── no.json             # Norwegian translations
├── sw.json             # Swahili translations
├── tr.json             # Turkish translations
└── zh-TW.json          # Traditional Chinese translations
```

### Configuration Files
Root level configuration files for various tools and frameworks.

```
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── middleware.ts         # Next.js middleware configuration
```

### `/.github` Directory
GitHub specific configuration and templates.

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md     # Bug report template
│   └── feature_request.md # Feature request template
└── pull_request_template.md # PR template
```

## Root Configuration Files

- `middleware.ts` - Clerk authentication middleware
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration
- `CODE_OF_CONDUCT.md` - Project code of conduct
- `CONTRIBUTING.md` - Contribution guidelines
- `DESCRIPTION.md` - Detailed project description
- `LICENSE` - Project license
- `README.md` - Project overview and setup
- `SECURITY.md` - Security policy and guidelines
- `Buster-Block-API.postman_collection.json` - Postman API collection