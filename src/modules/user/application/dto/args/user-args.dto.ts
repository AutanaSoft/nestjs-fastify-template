import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UserCreateInputDto, UserFindFilterInputDto, UserSortOrderInputDto } from '../inputs';

@ArgsType()
export class UserCreateArgsDto {
  @Field(() => UserCreateInputDto, { description: 'Data required to create a new user' })
  @ValidateNested()
  @Type(() => UserCreateInputDto)
  data!: UserCreateInputDto;
}

@ArgsType()
export class UserFindArgsDto {
  @Field(() => UserFindFilterInputDto, {
    nullable: true,
    description: 'Optional filter criteria for user search',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFindFilterInputDto)
  filter?: UserFindFilterInputDto;

  @Field(() => UserSortOrderInputDto, {
    nullable: true,
    description: 'Optional sorting parameters for user results',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSortOrderInputDto)
  sort?: UserSortOrderInputDto;
}
