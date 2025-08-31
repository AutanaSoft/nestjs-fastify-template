import { ArgsType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { UserUpdateInputDto } from '../../inputs';

/**
 * GraphQL arguments DTO for user update operations
 * Contains all required data for updating an existing user account
 */
@ArgsType()
export class UserUpdateArgsDto {
  @Field(() => ID, { description: 'Unique identifier of the user to update' })
  @IsUUID('all', { message: 'ID must be a valid ID' })
  id: string;

  @Field(() => UserUpdateInputDto, { description: 'Data required to update an existing user' })
  @ValidateNested()
  @Type(() => UserUpdateInputDto)
  data!: UserUpdateInputDto;
}
