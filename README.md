# GitHub Actions Demo with Express, TypeScript, and Jest

A comprehensive Node.js application demonstrating GitHub Actions CI/CD workflows using Express.js, TypeScript, and Jest testing framework with ESM modules.

## Features

- ✅ **Express.js API Server** - RESTful API with mathematical operations and string utilities
- ✅ **TypeScript** - Full type safety with strict mode enabled
- ✅ **ESM Modules** - Modern ES module support throughout the project
- ✅ **Jest Testing** - Comprehensive unit and integration tests with 100% coverage
- ✅ **GitHub Actions** - CI/CD pipelines for testing, linting, and coverage reporting
- ✅ **ESLint & Prettier** - Code quality and formatting enforcement
- ✅ **Multi-version Testing** - Tests run on Node.js 18.x, 20.x, and 22.x

## Project Structure

```
├── src/
│   ├── server.ts              # Express server with API routes
│   ├── utils.ts               # Utility functions (math, string operations)
│   └── __tests__/
│       ├── server.test.ts     # Integration tests for Express routes
│       └── utils.test.ts      # Unit tests for utility functions
├── .github/
│   └── workflows/
│       ├── ci.yml             # CI/CD workflow (test & coverage)
│       └── lint.yml           # Linting workflow (ESLint & type-check)
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest configuration for TypeScript & ESM
├── .eslintrc.json             # ESLint rules
├── .prettierrc.json           # Prettier formatting rules
└── package.json               # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm 10.x or higher

### Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

### Development

```bash
# Start development server with tsx (hot-reload TypeScript)
pnpm dev

# Start production server
pnpm start

# Watch mode for tests
pnpm test:watch

# Type checking
pnpm type-check

# Linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format
```

The development server uses **tsx** for fast TypeScript execution with zero-config support. This allows you to write TypeScript code and run it directly without compilation steps.

## API Endpoints

The server runs on `http://localhost:3000` by default (configurable via `PORT` environment variable).

### Health Check
- **GET** `/health` - Returns health status

### Mathematical Operations
- **POST** `/api/add` - Add two numbers
  ```json
  {"a": 5, "b": 3}
  ```
- **POST** `/api/subtract` - Subtract two numbers
- **POST** `/api/multiply` - Multiply two numbers
- **POST** `/api/divide` - Divide two numbers (handles division by zero)

### String Operations
- **POST** `/api/capitalize` - Capitalize first letter of a string
  ```json
  {"text": "hello"}
  ```

## GitHub Actions Workflows

### CI Workflow (ci.yml)
Runs on push and pull requests to `main` and `development` branches:
- Installs dependencies
- Builds the project
- Runs all tests
- Generates coverage report
- Uploads coverage to Codecov

### Lint Workflow (lint.yml)
Checks code quality:
- Runs ESLint
- Performs type checking
- Validates TypeScript compilation

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### Test Files
- `src/__tests__/utils.test.ts` - Unit tests for utility functions
- `src/__tests__/server.test.ts` - Integration tests for API routes

## Building

```bash
# Build TypeScript to JavaScript
pnpm build

# Output files are generated in the `dist/` directory
```

## Code Quality

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

### Formatting
```bash
pnpm format
```

## Environment Variables

```bash
# Port for the Express server (default: 3000)
PORT=3000
```

## TypeScript Configuration

The project uses strict TypeScript settings:
- `strict: true` - All strict type checking options enabled
- `esModuleInterop: true` - Better CommonJS/ESM interoperability
- `noImplicitAny: true` - No implicit any types
- Target: ES2020 with ES2020 modules

## Dependencies

### Production
- `express` ^5.2.1 - Web framework

### Development
- `typescript` ^5.9.3 - TypeScript compiler
- `tsx` ^4.21.0 - Fast TypeScript executor for development
- `jest` ^30.3.0 - Testing framework
- `ts-jest` ^29.4.6 - Jest TypeScript support
- `supertest` ^7.2.2 - HTTP assertions for testing
- `eslint` ^10.0.3 - Code linter
- `prettier` ^3.8.1 - Code formatter
- `@typescript-eslint/*` - ESLint TypeScript support
- `@eslint/js` - ESLint JavaScript rules
- `globals` - Global variables for ESLint

## GitHub Actions Features Demonstrated

1. **Matrix Strategy** - Tests on multiple Node.js versions
2. **Artifact Caching** - pnpm cache for faster builds
3. **Conditional Steps** - Coverage upload with error handling
4. **Auto-cleanup** - Temporary files handled properly
5. **Status Checks** - Required for PR merges

## Best Practices Implemented

- ✅ Strict TypeScript configuration
- ✅ ESM modules throughout
- ✅ 100% test coverage for utilities
- ✅ Integration tests for API endpoints
- ✅ Pre-commit code quality checks
- ✅ Automated CI/CD pipeline
- ✅ Type-safe Express handlers
- ✅ Proper error handling

## License

ISC

## Contributing

When contributing to this project:
1. Ensure all tests pass (`pnpm test`)
2. Run linting (`pnpm lint`)
3. Format code (`pnpm format`)
4. Update tests for new features
5. Create a pull request

---

**Note**: This project demonstrates GitHub Actions patterns and can be used as a template for new Node.js/Express/TypeScript projects.
