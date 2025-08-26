import { HashUtils } from '@/shared/infrastructure/utils';
import { UserRepository } from '@modules/user/domain/repositories';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserDto, UserUpdateArgsDto } from '../dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: UserUpdateArgsDto): Promise<UserDto> {
    const { id, data } = params;
    // verify is password set
    if (data.password) {
      data.password = await HashUtils.hashPassword(data.password);
    }

    const updatedUser = await this.userRepository.update(id, data);

    return plainToInstance(UserDto, updatedUser);
  }
}
