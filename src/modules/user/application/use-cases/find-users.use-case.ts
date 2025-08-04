import { UserDto, UserQueryParamsDto } from '@modules/user/application/dto';
import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class FindUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectPinoLogger(FindUsersUseCase.name)
    private readonly logger: Logger,
  ) {}

  async execute(query: UserQueryParamsDto): Promise<UserDto[]> {
    const users = await this.userRepository.findAll(query);

    if (!users || users.length === 0) {
      return [];
    }

    return users.map(user => plainToInstance(UserDto, user));
  }
}
