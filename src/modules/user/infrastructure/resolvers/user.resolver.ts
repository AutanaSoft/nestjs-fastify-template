import {
  UserCreateInputDto,
  UserDto,
  UserQueryParamsDto,
  UserUpdateInputDto,
} from '@modules/user/application/dto';
import { CreateUserUseCase } from '@modules/user/application/use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from '@modules/user/application/use-cases/find-user-by-email.use-case';
import { FindUserByIdUseCase } from '@modules/user/application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '@modules/user/application/use-cases/update-user.use-case';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindUsersUseCase } from '../../application/use-cases';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
  ) {}

  @Mutation(() => UserDto)
  async create(
    @Args('userCreateInputDto') userCreateInputDto: UserCreateInputDto,
  ): Promise<UserDto> {
    console.log('Creating user with data:', userCreateInputDto);
    return await this.createUserUseCase.execute(userCreateInputDto);
  }

  @Mutation(() => UserDto)
  async update(
    @Args('id') id: string,
    @Args('userUpdateInputDto') userUpdateInputDto: UserUpdateInputDto,
  ): Promise<UserDto> {
    return this.updateUserUseCase.execute(id, userUpdateInputDto);
  }

  @Query(() => UserDto)
  async findById(@Args('id') id: string): Promise<UserDto> {
    return this.findUserByIdUseCase.execute(id);
  }

  @Query(() => UserDto)
  async findByEmail(@Args('email') email: string): Promise<UserDto> {
    return this.findUserByEmailUseCase.execute(email);
  }

  @Query(() => [UserDto])
  async findAll(@Args() queryParams: UserQueryParamsDto): Promise<UserDto[]> {
    return await this.findUsersUseCase.execute(queryParams);
  }
}
