import { UserCreateArgsDto, UserDto, UserFindArgsDto } from '@modules/user/application/dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserUseCase, FindUsersUseCase } from '../../application/use-cases';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
  ) {}

  @Mutation(() => UserDto, { description: 'Create a new user' })
  async create(@Args() params: UserCreateArgsDto): Promise<UserDto> {
    return await this.createUserUseCase.execute(params);
  }

  @Query(() => [UserDto], { description: 'Find all users' })
  async findAll(@Args() params: UserFindArgsDto): Promise<UserDto[]> {
    return await this.findUsersUseCase.execute(params);
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
