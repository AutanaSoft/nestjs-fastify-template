import { UpdateUserData, UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const userToUpdate = await this.userRepository.findById(id);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // Build update data with only role and status
    const updateData: UpdateUserData = {};

    if (updateUserDto.status !== undefined) {
      updateData.status = updateUserDto.status;
    }

    if (updateUserDto.role !== undefined) {
      updateData.role = updateUserDto.role;
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    return new UserDto(updatedUser.toResponseObject());
  }
}
