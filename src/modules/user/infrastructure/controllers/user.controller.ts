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
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindUsersUseCase } from '../../application/use-cases';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Conflict - Email or username already exists.' })
  async create(@Body() userCreateInputDto: UserCreateInputDto): Promise<UserDto> {
    console.log('Creating user with data:', userCreateInputDto);
    return await this.createUserUseCase.execute(userCreateInputDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user (role and status only)' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('id') id: string,
    @Body() userUpdateInputDto: UserUpdateInputDto,
  ): Promise<UserDto> {
    return this.updateUserUseCase.execute(id, userUpdateInputDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The found user record',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findById(@Param('id') id: string): Promise<UserDto> {
    return this.findUserByIdUseCase.execute(id);
  }

  @Get('by-email')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiQuery({ name: 'email', description: 'User email address', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The found user record',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByEmail(@Query('email') email: string): Promise<UserDto> {
    return this.findUserByEmailUseCase.execute(email);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserDto],
  })
  async findAll(@Query() queryParams: UserQueryParamsDto): Promise<UserDto[]> {
    return await this.findUsersUseCase.execute(queryParams);
  }
}
