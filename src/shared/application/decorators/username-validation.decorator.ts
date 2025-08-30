import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * Custom validator decorator for username fields
 * Validates that username contains only alphanumeric characters and allowed special characters (. - _)
 * Applies transformation to trim whitespace
 * Use @IsOptional() directly in the DTO when the field is optional
 * @param validationOptions Optional validation options
 * @returns PropertyDecorator function that applies multiple validations
 */
export function IsValidUsername(validationOptions?: { message?: string }) {
  return applyDecorators(
    IsString({ message: 'Username must be a string' }),
    IsNotEmpty({ message: 'Username cannot be empty' }),
    Matches(/^[a-zA-Z0-9._-]+$/, {
      message:
        validationOptions?.message ||
        'Username can only contain alphanumeric characters and the special characters: . - _',
    }),
    Transform(
      ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value),
      { toClassOnly: true },
    ),
  );
}
