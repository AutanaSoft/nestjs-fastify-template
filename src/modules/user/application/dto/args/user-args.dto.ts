import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UserCreateInputDto, UserFindFilterInputDto, UserSortOrderInputDto } from '../inputs';

@ArgsType()
export class UserCreateArgsDto {
  @Field(() => UserCreateInputDto, { description: 'Data for creating a new user' })
  @ValidateNested()
  @Type(() => UserCreateInputDto)
  data!: UserCreateInputDto;
}

@ArgsType()
export class UserFindArgsDto {
  @Field(() => UserFindFilterInputDto, { nullable: true, description: 'Filter for finding users' })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFindFilterInputDto)
  filter?: UserFindFilterInputDto;

  @Field(() => UserSortOrderInputDto, {
    nullable: true,
    description: 'Sort order for finding users',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSortOrderInputDto)
  sort?: UserSortOrderInputDto;
}
