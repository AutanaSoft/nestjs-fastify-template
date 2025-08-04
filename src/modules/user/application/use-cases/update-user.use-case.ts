import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserUpdateInputDto } from '../dto/user-update-input.dto';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, updateUserInputDto: UserUpdateInputDto): Promise<UserDto> {
    const userToUpdate = await this.userRepository.findById(id);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // Build update data with only role and status
    const updateData: UserUpdateInputDto = {};

    if (updateUserInputDto.status !== undefined) {
      updateData.status = updateUserInputDto.status;
    }

    if (updateUserInputDto.role !== undefined) {
      updateData.role = updateUserInputDto.role;
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    return plainToInstance(UserDto, updatedUser);
  }
}
