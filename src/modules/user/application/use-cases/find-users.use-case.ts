import { UserDto } from '@modules/user/application/dto';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { UserFindArgsDto } from '../dto/args';

@Injectable()
export class FindUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectPinoLogger(FindUsersUseCase.name)
    private readonly logger: Logger,
  ) {}

  async execute(params: UserFindArgsDto): Promise<UserDto[]> {
    this.logger.debug({ params }, 'Executing FindUsersUseCase');

    const users = await this.userRepository.findAll(params.filter);

    this.logger.debug({ users }, 'Found users');

    if (!users || users.length === 0) {
      return [];
    }

    return users.map(user => plainToInstance(UserDto, user));
  }
}
