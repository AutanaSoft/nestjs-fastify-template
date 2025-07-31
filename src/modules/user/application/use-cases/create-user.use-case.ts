import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { HashUtils } from '@shared/infrastructure/utils';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserDto> {
    // Check if user with email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists.');
    }

    // Check if user with userName already exists
    const existingUserByUserName = await this.userRepository.findByUserName(createUserDto.userName);
    if (existingUserByUserName) {
      throw new ConflictException('User with this username already exists.');
    }

    // Hash password using utils
    const hashedPassword = await HashUtils.hashPassword(createUserDto.password);

    // Create user
    const createdUser = await this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      userName: createUserDto.userName,
    });

    // Return user response without password
    return new UserDto(createdUser.toResponseObject());
  }
}
