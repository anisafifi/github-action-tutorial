# Contributing to GitHub Actions Demo

Thank you for your interest in contributing to this project! Here are some guidelines to help you get started.

## Development Setup

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Create a feature branch: `git checkout -b feature/your-feature-name`

## Running Tests

Before submitting a pull request, ensure all tests pass:

```bash
pnpm test
```

For development with watch mode:

```bash
pnpm test:watch
```

To check code coverage:

```bash
pnpm test:coverage
```

## Code Quality

Always format and lint your code before committing:

```bash
# Format code with Prettier
pnpm format

# Check for linting issues
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Check TypeScript types
pnpm type-check
```

## Building

To build the project:

```bash
pnpm build
```

This will compile TypeScript files to the `dist/` directory.

## Git Commit Convention

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `test:` for test additions/modifications
- `refactor:` for code refactoring

Example:
```
feat: add new API endpoint for multiplication
```

## Pull Request Process

1. Ensure all tests pass (`pnpm test`)
2. Ensure code is properly formatted (`pnpm format`)
3. Ensure no linting errors (`pnpm lint`)
4. Update the README if you're adding new features
5. Submit your PR with a clear description of the changes

## Reporting Issues

When reporting issues, please include:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node.js version, etc.)

## Questions?

Feel free to open an issue or discussion for any questions about contributing.

---

Thank you for contributing!
