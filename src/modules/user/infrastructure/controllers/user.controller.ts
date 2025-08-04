import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateUserUseCase } from '@modules/user/application/use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from '@modules/user/application/use-cases/find-user-by-email.use-case';
import { UpdateUserUseCase } from '@modules/user/application/use-cases/update-user.use-case';
import {
  UserCreateInputDto,
  UserUpdateInputDto,
  UserDto,
  UserQueryParamsDto,
} from '@modules/user/application/dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
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
    return this.createUserUseCase.execute(userCreateInputDto);
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
  @ApiOperation({ summary: 'Get users with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserDto],
  })
  findAll(@Query() queryParams: UserQueryParamsDto): UserDto[] {
    // TODO: Implement this use case for listing users with filters
    // This would require a new use case: FindUsersUseCase
    console.log('Query params:', queryParams);
    return [];
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
}
