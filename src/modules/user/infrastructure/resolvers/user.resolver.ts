import { UserCreateArgsDto, UserDto, UserFindArgsDto } from '@modules/user/application/dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserUseCase, FindUsersUseCase } from '../../application/use-cases';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
  ) {}

  @Mutation(() => UserDto, { description: 'Creates a new user account with the provided data' })
  async create(@Args() params: UserCreateArgsDto): Promise<UserDto> {
    return await this.createUserUseCase.execute(params);
  }

  @Query(() => [UserDto], {
    description: 'Retrieves users based on optional filter and sort criteria',
  })
  async findAll(@Args() params: UserFindArgsDto): Promise<UserDto[]> {
    return await this.findUsersUseCase.execute(params);
  }
}
