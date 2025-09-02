import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

/**
 * Custom validator decorator for email fields
 * Validates email format and applies normalization (trim + toLowerCase)
 * Use @IsOptional() directly in the DTO when the field is optional
 * @param validationOptions Optional validation options
 * @returns PropertyDecorator function that applies multiple validations
 */
export function IsValidEmail(validationOptions?: { message?: string }) {
  return applyDecorators(
    IsString({ message: 'Email must be a string' }),
    IsEmail(
      {},
      {
        message: validationOptions?.message || 'Email must be a valid email address',
      },
    ),
    Transform(
      ({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
      { toClassOnly: true },
    ),
  );
}
