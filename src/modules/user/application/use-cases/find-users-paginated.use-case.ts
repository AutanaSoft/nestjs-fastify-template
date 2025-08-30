import { PaginatedData, PaginatedResult, PAGINATION_LIMITS } from '@/shared/domain/types';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserFindAllPaginateData } from '@modules/user/domain/types';
import { Injectable } from '@nestjs/common';
import { PaginationInfoFactory } from '@shared/application/factories';
import { plainToInstance } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { UserFindPaginatedArgsDto } from '../dto/args/user-args.dto';
import { UserDto } from '../dto/responses/user.dto';

/**
 * Use case for finding users with pagination, optional filtering and sorting
 * Orchestrates the retrieval of paginated users and builds complete pagination metadata
 */
@Injectable()
export class FindUsersPaginatedUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FindUsersPaginatedUseCase.name);
  }

  /**
   * Executes the find users paginated operation with optional filtering and sorting
   * @param params - Search parameters including pagination, optional filter and sort criteria
   * @returns Promise resolving to a paginated result containing user DTOs and pagination metadata
   */
  async execute(params: UserFindPaginatedArgsDto): Promise<PaginatedResult<UserDto>> {
    // Create a logger instance for this method
    this.logger.assign({ method: 'execute', params });
    this.logger.debug('Executing paginated user search with parameters');
    // Extract and validate pagination parameters
    const page = params.page ?? 1;
    const limit = Math.min(
      params.limit ?? PAGINATION_LIMITS.DEFAULT_LIMIT,
      PAGINATION_LIMITS.MAX_LIMIT,
    );

    // Calculate skip/take for repository (use case responsibility)
    const skip = (page - 1) * limit;
    const take = limit;

    // Build repository query parameters with direct skip/take
    const repositoryParams: UserFindAllPaginateData = {
      skip,
      take,
      filter: params.filter,
      sort: params.sort,
    };

    try {
      // Execute the repository query (returns only data + totalDocs)
      const paginatedData: PaginatedData<UserEntity> =
        await this.userRepository.findAllPaginated(repositoryParams);

      // Transform entities to DTOs using plainToInstance
      const userDtos = paginatedData.data.map(user => plainToInstance(UserDto, user));

      // Build complete pagination metadata using factory
      const paginationInfo = PaginationInfoFactory.create({
        totalDocs: paginatedData.totalDocs,
        page,
        limit,
      });

      const result = {
        data: userDtos,
        paginationInfo,
      };

      this.logger.debug({ searchResult: result }, 'Paginated user search completed');

      return result;
    } catch (error) {
      this.logger.error('Error during paginated user search', {
        error: error instanceof Error ? error.message : 'Unknown error',
        params,
      });
      throw error;
    }
  }
}
