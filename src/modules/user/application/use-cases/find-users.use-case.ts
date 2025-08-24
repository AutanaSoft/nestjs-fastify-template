import { UserDto, UserSortOrderInputDto } from '@modules/user/application/dto';
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
    const filter = params.filter ?? {};
    const sort = params.sort ?? this.getDefaultSort();

    this.logger.debug({ query: { filter, sort } }, 'Finding users');

    const users = await this.userRepository.findAll({ filter, sort });

    this.logger.debug({ users }, 'Found users');

    if (!users || users.length === 0) {
      return [];
    }

    return users.map(user => plainToInstance(UserDto, user));
  }

  private getDefaultSort(): UserSortOrderInputDto {
    return new UserSortOrderInputDto();
  }
}
