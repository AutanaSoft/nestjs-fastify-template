import { UserCreateInputDto, UserDto, UserQueryParamsDto } from '@modules/user/application/dto';
import { CreateUserUseCase } from '@modules/user/application/use-cases/create-user.use-case';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindUsersUseCase } from '../../application/use-cases/find-users.use-case';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
  ) {}

  @Mutation(() => UserDto)
  async create(
    @Args('userCreateInputDto', { type: () => UserCreateInputDto })
    userCreateInputDto: UserCreateInputDto,
  ): Promise<UserDto> {
    return await this.createUserUseCase.execute(userCreateInputDto);
  }

  @Query(() => [UserDto])
  async findAll(
    @Args('queryParams', { type: () => UserQueryParamsDto }) queryParams: UserQueryParamsDto,
  ): Promise<UserDto[]> {
    return await this.findUsersUseCase.execute(queryParams);
  }

  /* @Mutation(() => UserDto)
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

 */
}
