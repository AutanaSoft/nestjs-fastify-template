import { UserDto, UserQueryParamsDto } from '@modules/user/application/dto';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectPinoLogger, Logger } from 'nestjs-pino';

@Injectable()
export class FindUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectPinoLogger(FindUsersUseCase.name)
    private readonly logger: Logger,
  ) {}

  async execute(query: UserQueryParamsDto): Promise<UserDto[]> {
    this.logger.debug({ query }, 'Executing FindUsersUseCase');

    const users = await this.userRepository.findAll(query);

    this.logger.debug({ users }, 'Found users');

    if (!users || users.length === 0) {
      return [];
    }

    return users.map(user => plainToInstance(UserDto, user));
  }
}
