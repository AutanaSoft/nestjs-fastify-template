import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserCreateInputDto, UserDto } from '@modules/user/application/dto';
import { HashUtils } from '@shared/infrastructure/utils/hash.utils';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: UserCreateInputDto): Promise<UserDto> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // Check if username already exists
      const existingUserName = await this.userRepository.findByUserName(dto.userName);
      if (existingUserName) {
        throw new BadRequestException('User with this username already exists');
      }

      // Hash the password
      const hashedPassword = await HashUtils.hashPassword(dto.password);

      // Create user entity with hashed password
      const userData = {
        ...dto,
        password: hashedPassword,
      };

      const createdUser = await this.userRepository.create(userData);

      // Transform entity to response DTO
      return plainToInstance(UserDto, createdUser);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to create user: ${errorMessage}`);
    }
  }
}
