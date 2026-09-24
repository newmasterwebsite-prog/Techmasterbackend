# TechMaster CMS Backend (Phase 1 Foundation)

This is the production-ready backend foundation for TechMaster CMS built with Node.js, Express, TypeScript, and MongoDB.

## Features (Phase 1)
- **TypeScript Foundation**: Fully typed application with compilation scripts.
- **Security Middlewares**: Integrated `helmet`, `cors`, and `express-rate-limit`.
- **Global Error Handling**: Centralized error middleware with structured `AppError` responses.
- **Standardized API Responses**: Centralized response formatting with the `ApiResponse` helper.
- **Database & Cloud Storage Configuration**: Mongoose connection management and Cloudinary configurations.
- **Robust Environmental Variable Loader**: Safe loading and validation of configurations.

## Folder Structure
```text
techmasterbackend/
├── src/
│   ├── config/          # Centralized configuration (db, cloudinary)
│   ├── controllers/     # MVC Controllers (Phase 2)
│   ├── middlewares/     # Custom Express middlewares (errorHandler)
│   ├── models/          # Mongoose database models (Phase 2)
│   ├── repositories/    # Data Access Layer / Repository Pattern (Phase 2)
│   ├── routes/          # Express API route declarations (Phase 2)
│   ├── services/        # Business logic layer (Phase 2)
│   ├── validators/      # Request validation schemas (Phase 2)
│   ├── interfaces/      # TypeScript interfaces
│   ├── types/           # Custom type definitions
│   ├── helpers/         # Auxiliary helper functions
│   ├── constants/       # Global constants
│   ├── utils/           # Shared utilities (apiResponse)
│   ├── app.ts           # Express Application definition
│   └── server.ts        # Server entrypoint & DB listener
├── .env.example         # Template configuration file
├── tsconfig.json        # TypeScript configuration compiler rules
├── package.json         # Dependencies and scripts
└── README.md            # Document instructions
```

## Setup & Running

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Running locally or a MongoDB Atlas URI)

### Installation
1. Navigate to the backend directory:
   ```bash
   cd TechMasterBackend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your MongoDB URI, Cloudinary credentials, and JWT secrets.

### Scripts
- **Start Development Mode** (starts hot-reloading server):
  ```bash
  npm run dev
  ```
- **Compile TypeScript**:
  ```bash
  npm run build
  ```
- **Run Production Build** (after compilation):
  ```bash
  npm run start
  ```
