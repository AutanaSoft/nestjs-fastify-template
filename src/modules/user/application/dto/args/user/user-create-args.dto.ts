import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserCreateInputDto } from '../../inputs';

/**
 * GraphQL arguments DTO for user creation operations
 * Contains all required data for creating a new user account
 */
@ArgsType()
export class UserCreateArgsDto {
  @Field(() => UserCreateInputDto, { description: 'Data required to create a new user' })
  @ValidateNested()
  @Type(() => UserCreateInputDto)
  data!: UserCreateInputDto;
}
