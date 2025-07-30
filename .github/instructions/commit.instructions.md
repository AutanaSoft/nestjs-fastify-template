---
applyTo: '**'
---

# Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification and uses [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) rules for validation. All commit messages must adhere to the following format to ensure consistency and automate changelog generation.

> **📖 Official Rules Reference**: For the complete and up-to-date list of validation rules, see the [@commitlint/config-conventional documentation](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#rules).

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
- Do NOT capitalize the first word of the description (use lowercase).
- Do not use a period at the end of the description.
- The header line (type, scope, and description) should not exceed 100 characters.
- The body of the commit message should be wrapped at 100 characters per line.
- The footer should be wrapped at 100 characters per line.
- Body should have a leading blank line after the header.
- Footer should have a leading blank line before it.
- If the commit is related to an issue, include the issue number at the end of the message, preceded by a `#`.

> **⚠️ Important**: These rules are enforced by [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional). If your commit is rejected, check the [subject-case rule](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#subject-case) and other validation rules in the official documentation.

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
- **Format**: Must be in lowercase (not sentence-case, start-case, pascal-case, or upper-case).
- **Punctuation**: Must not end with a period (`.`).

---

## Length and Formatting Rules

### **Header Length**

- **Rule**: `header-max-length`
- **Limit**: Maximum 100 characters total
- **Applies to**: The entire first line (`type(scope): description`)

### **Body Length**

- **Rule**: `body-max-line-length`
- **Limit**: Maximum 100 characters per line
- **Leading blank**: Must have a blank line after the header

### **Footer Length**

- **Rule**: `footer-max-line-length`
- **Limit**: Maximum 100 characters per line
- **Leading blank**: Must have a blank line before the footer

### **Format Examples**

✅ **Correct format:**

```
feat(app): add health check endpoint

This commit adds a new health check endpoint that returns
application status and database connectivity information.

BREAKING CHANGE: The old /status endpoint has been removed.
Use /app/health instead.
```

❌ **Incorrect format (too long):**

```
feat(app): add health check endpoint that provides comprehensive application and database status information
```

---

## Examples of Valid Commit Messages

- `feat(user): add use case to update user profiles`
- `fix(security): correct CORS configuration for production`
- `docs(readme): update installation instructions`
- `refactor(shared): move correlation interceptor to its own module`
- `test(hello): add E2E tests for the say-hello endpoint`
- `chore(deps): update development dependencies to their latest versions`
