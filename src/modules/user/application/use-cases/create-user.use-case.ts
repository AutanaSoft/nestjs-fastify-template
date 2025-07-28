import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.userRepository.create({
      email: createUserDto.email,
      password_hash,
    });

    return new UserDto(createdUser);
  }
}
