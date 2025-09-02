import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  UserFindByEmailInputDto,
  UserFindByIdInputDto,
  UserFindByUserNameInputDto,
} from '../../inputs';

/**
 * Arguments for finding a user by ID
 */
@ArgsType()
export class UserFindByIdArgsDto {
  @Field(() => UserFindByIdInputDto, {
    description: 'Input parameters for finding a user by their unique identifier',
  })
  @Type(() => UserFindByIdInputDto)
  @ValidateNested()
  input!: UserFindByIdInputDto;
}

/**
 * Arguments for finding a user by username
 */
@ArgsType()
export class UserFindByUserNameArgsDto {
  @Field(() => UserFindByUserNameInputDto, {
    description: 'Input parameters for finding a user by their username',
  })
  @Type(() => UserFindByUserNameInputDto)
  @ValidateNested()
  input!: UserFindByUserNameInputDto;
}

/**
 * Arguments for finding a user by email
 */
@ArgsType()
export class UserFindByEmailArgsDto {
  @Field(() => UserFindByEmailInputDto, {
    description: 'Input parameters for finding a user by their email address',
  })
  @Type(() => UserFindByEmailInputDto)
  @ValidateNested()
  input!: UserFindByEmailInputDto;
}
