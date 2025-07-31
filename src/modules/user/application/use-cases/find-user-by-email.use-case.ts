import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<UserDto> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserDto(user.toResponseObject());
  }
}
