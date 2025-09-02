import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { UserCreateInputDto } from './user-create-input.dto';

/**
 * GraphQL input DTO for user update operations
 * Contains optional fields that can be updated for an existing user
 */
@InputType()
export class UserUpdateInputDto extends PartialType(
  OmitType(UserCreateInputDto, ['email'] as const),
) {}
