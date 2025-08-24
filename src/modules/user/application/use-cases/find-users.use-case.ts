import { UserDto, UserSortOrderInputDto } from '@modules/user/application/dto';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { UserFindArgsDto } from '../dto/args';

/**
 * Use case for finding users with optional filtering and sorting
 * Orchestrates the retrieval of users from the repository and transforms them to DTOs
 */
@Injectable()
export class FindUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectPinoLogger(FindUsersUseCase.name)
    private readonly logger: Logger,
  ) {}

  /**
   * Executes the find users operation with optional filtering and sorting
   * @param params - Search parameters including optional filter and sort criteria
   * @returns Promise resolving to an array of user DTOs
   */
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

  /**
   * Provides default sorting configuration when none is specified
   * @returns Default sort order input DTO
   */
  private getDefaultSort(): UserSortOrderInputDto {
    return new UserSortOrderInputDto();
  }
}
