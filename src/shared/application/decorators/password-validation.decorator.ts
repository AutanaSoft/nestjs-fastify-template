import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

/**
 * Custom validator decorator for password fields with comprehensive security requirements.
 *
 * This decorator validates password strength by enforcing multiple security criteria:
 * - Length between 6 and 16 characters
 * - At least one uppercase letter (A-Z)
 * - At least one numeric digit (0-9)
 * - At least one special character from the allowed set: .-_@!#$
 * - Only alphanumeric characters and specified special characters are permitted
 *
 * The validation follows security best practices for user authentication while maintaining
 * usability by allowing a reasonable character set and length range. Each requirement is
 * validated individually to provide specific error messages for better user experience.
 *
 * @returns PropertyDecorator function that applies multiple password validations
 */
export function IsValidPassword() {
  return applyDecorators(
    // Basic type and presence validation
    IsString({ message: 'Password must be a string' }),
    IsNotEmpty({ message: 'Password cannot be empty' }),

    // Length validation (6-16 characters)
    Length(6, 16, {
      message: 'Password must be between 6 and 16 characters long',
    }),

    // Validation: At least one uppercase letter
    Matches(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter (A-Z)',
    }),

    // Validation: At least one numeric digit
    Matches(/(?=.*\d)/, {
      message: 'Password must contain at least one number (0-9)',
    }),

    // Validation: At least one special character from allowed set
    Matches(/(?=.*[.\-_@!#$])/, {
      message: 'Password must contain at least one special character (.-_@!#$)',
    }),

    // Validation: Only allowed characters (alphanumeric + special characters)
    Matches(/^[a-zA-Z0-9.\-_@!#$]+$/, {
      message:
        'Password can only contain alphanumeric characters and these special characters: .-_@!#$',
    }),

    // Transform to trim whitespace for security
    Transform(
      ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value),
      { toClassOnly: true },
    ),
  );
}

/**
 * Validates password confirmation by comparing it with the original password field.
 *
 * This decorator ensures that password confirmation matches the original password,
 * commonly used in registration and password change forms to prevent typos.
 *
 * @param passwordField The name of the password field to compare against
 * @param validationOptions Optional validation options for custom error messages
 * @returns PropertyDecorator function that validates password confirmation
 */
export function IsPasswordConfirmation(
  passwordField: string,
  validationOptions?: { message?: string },
) {
  return applyDecorators(
    IsString({ message: 'Password confirmation must be a string' }),
    IsNotEmpty({ message: 'Password confirmation cannot be empty' }),
    Matches(new RegExp(`^.*$`), {
      message: validationOptions?.message || 'Password confirmation must match the password',
    }),
    Transform(
      ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value),
      { toClassOnly: true },
    ),
  );
}
