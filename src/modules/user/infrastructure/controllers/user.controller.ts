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
import { Body, Controller, Param, Query } from '@nestjs/common';
import { FindUsersUseCase } from '../../application/use-cases';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
  ) {}

  async create(@Body() userCreateInputDto: UserCreateInputDto): Promise<UserDto> {
    console.log('Creating user with data:', userCreateInputDto);
    return await this.createUserUseCase.execute(userCreateInputDto);
  }

  async update(
    @Param('id') id: string,
    @Body() userUpdateInputDto: UserUpdateInputDto,
  ): Promise<UserDto> {
    return this.updateUserUseCase.execute(id, userUpdateInputDto);
  }

  async findById(@Param('id') id: string): Promise<UserDto> {
    return this.findUserByIdUseCase.execute(id);
  }

  async findByEmail(@Query('email') email: string): Promise<UserDto> {
    return this.findUserByEmailUseCase.execute(email);
  }

  async findAll(@Query() queryParams: UserQueryParamsDto): Promise<UserDto[]> {
    return await this.findUsersUseCase.execute(queryParams);
  }
}
