import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return new UserDto(user);
  }
}
