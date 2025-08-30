import { PaginatedData, PaginatedResult, PAGINATION_LIMITS } from '@/shared/domain/types';
import { PaginationInfoFactory } from '@shared/application/factories';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserFindAllPaginateData } from '@modules/user/domain/types';
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
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
    @InjectPinoLogger(FindUsersPaginatedUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Executes the find users paginated operation with optional filtering and sorting
   * @param params - Search parameters including pagination, optional filter and sort criteria
   * @returns Promise resolving to a paginated result containing user DTOs and pagination metadata
   */
  async execute(params: UserFindPaginatedArgsDto): Promise<PaginatedResult<UserDto>> {
    // Extract and validate pagination parameters
    const page = params.page ?? 1;
    const limit = Math.min(
      params.limit ?? PAGINATION_LIMITS.DEFAULT_LIMIT,
      PAGINATION_LIMITS.MAX_LIMIT,
    );

    // Calculate skip/take for repository (use case responsibility)
    const skip = (page - 1) * limit;
    const take = limit;

    this.logger.info('Starting paginated user search', {
      page,
      limit,
      skip,
      take,
      hasFilters: !!(
        params.filter?.email ||
        params.filter?.userName ||
        params.filter?.status ||
        params.filter?.role
      ),
      hasSorting: !!(params.sort?.sortBy || params.sort?.sortOrder),
    });

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

      this.logger.info('Paginated user search completed', {
        totalFound: paginationInfo.totalDocs,
        currentPageCount: userDtos.length,
        page: paginationInfo.page,
        totalPages: paginationInfo.totalPages,
      });

      return {
        data: userDtos,
        paginationInfo,
      };
    } catch (error) {
      this.logger.error('Error during paginated user search', {
        error: error instanceof Error ? error.message : 'Unknown error',
        params,
      });
      throw error;
    }
  }
}
