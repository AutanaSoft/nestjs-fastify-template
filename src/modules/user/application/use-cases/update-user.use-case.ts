import { HashUtils } from '@/shared/infrastructure/utils';
import { UserRepository } from '@modules/user/domain/repositories';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { UserDto, UserUpdateArgsDto } from '../dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectPinoLogger(UpdateUserUseCase.name)
    private readonly logger: Logger,
  ) {}

  async execute(params: UserUpdateArgsDto): Promise<UserDto> {
    this.logger.debug({ params }, 'Updating user');
    const { id, data } = params;
    // verify is password set
    if (data.password) {
      this.logger.debug('Hashing password');
      data.password = await HashUtils.hashPassword(data.password);
    }

    this.logger.debug({ id, data }, 'User data prepared for update');
    const updatedUser = await this.userRepository.update(id, data);

    this.logger.debug({ userId: updatedUser.id }, 'User updated successfully');

    return plainToInstance(UserDto, updatedUser);
  }
}
