---
applyTo: '**'
---

# Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. All commit messages must adhere to the following format to ensure consistency and automate changelog generation.

## Commit Message Format

The general format of a commit message is:

```
type[optional scope]: description

[optional body with more lines about the change, including issue references, etc.]
```

Where:

- `type` is one of the following reserved words:
  - `feat`: a new feature
  - `fix`: a bug fix
  - `docs`: documentation changes
  - `style`: changes that do not affect program logic (whitespace, formatting, etc.)
  - `refactor`: code changes that neither fix a bug nor add a feature
  - `test`: adding or modifying tests
  - `chore`: changes to the build process or auxiliary tools and libraries such as generated documentation, build configurations, etc.
- `scope` is an optional word that indicates the area of the code affected (e.g., a module or class).
- `description` is a short, present-tense summary of what the commit does.

### Example

```
feat(auth): add JWT authentication

- Implemented JSON Web Token authentication for secure API access.
- Added login and registration endpoints.
- Updated user model to include JWT version.
```

## Additional Notes

- Commit messages should be in the present tense, as if you were giving a command.
- Capitalize the first word of the description.
- Do not use a period at the end of the description.
- The header line (type, scope, and description) should not exceed 100 characters.
- The body of the commit message should be wrapped at 100 characters.
- If the commit is related to an issue, include the issue number at the end of the message, preceded by a `#`.

---

## Detailed Rules

### 1. **Type**

- **Required**: Must always be present.
- **Format**: Must be in `lower-case`.
- **Allowed Values**: The type must be one of the following:
  - `build`: Changes that affect the build system or external dependencies (e.g., `package.json`).
  - `chore`: Other changes that do not modify source code or tests (e.g., tool configuration).
  - `ci`: Changes to our CI configuration files and scripts (e.g., GitHub Actions).
  - `docs`: Documentation only changes.
  - `feat`: A new feature for the user.
  - `fix`: A bug fix.
  - `perf`: A code change that improves performance.
  - `refactor`: A code change that neither fixes a bug nor adds a feature.
  - `revert`: Reverts a previous commit.
  - `style`: Changes that do not affect the meaning of the code (whitespace, formatting, etc.).
  - `test`: Adding missing tests or correcting existing tests.

### 2. **Scope**

- **Required**: Must always be present.
- **Format**: Must be in `kebab-case` (e.g., `my-module`).
- **Allowed Values**: The scope must describe the section of the code affected and must be one of the following:
  - `app`: Related to the general application configuration (`main.ts`, `app.module.ts`).
  - `config`: Changes to configuration files (`src/config`).
  - `deps`: Update of production dependencies.
  - `deps-dev`: Update of development dependencies.
  - `docs`: Tasks related to documentation.
  - `hello`: `hello` example module.
  - `lint`: Linting rules or code formatting.
  - `log`: Logging configurations or implementations.
  - `release`: Tasks related to the release process.
  - `repo`: Changes related to repository management (e.g., `.gitignore`).
  - `scripts`: Changes to internal scripts.
  - `security`: Implementation of security features.
  - `shared`: Changes in the shared module (`src/shared`).
  - `test`: Tasks related to test configuration.
  - `throttler`: Rate limiting configuration.
  - `user`: `user` module.

### 3. **Subject**

- **Required**: Must always be present.
- **Format**: Must be in "Sentence case" (start with a capital letter).
- **Punctuation**: Must not end with a period (`.`).

---

## Examples of Valid Commit Messages

- `feat(user): Add use case to update user profiles`
- `fix(security): Correct CORS configuration for production`
- `docs(readme): Update installation instructions`
- `refactor(shared): Move correlation interceptor to its own module`
- `test(hello): Add E2E tests for the say-hello endpoint`
- `chore(deps): Update development dependencies to their latest versions`
