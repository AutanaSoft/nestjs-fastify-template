import { PaginatedData, PaginatedResult } from '@/shared/domain/types';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserFindAllPaginateData } from '@modules/user/domain/types';
import { Injectable } from '@nestjs/common';
import { PaginationInfoFactory } from '@shared/application/factories';
import { plainToInstance } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { UserFindPaginatedArgsDto } from '../dto/args';
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
    const { page, take, filter, orderBy } = params;

    // Build repository query parameters with direct skip/take
    const repositoryParams: UserFindAllPaginateData = {
      page,
      take,
      filter,
      orderBy,
    };

    try {
      // Execute the repository query (returns only data + totalDocs)
      const paginatedData: PaginatedData<UserEntity> =
        await this.userRepository.findAllPaginated(repositoryParams);

      // Calculate if the requested page is valid
      const totalPages = Math.ceil(paginatedData.totalDocs / take);

      // Log warning if page is out of range
      if (page > totalPages && totalPages > 0) {
        this.logger.warn('Requested page exceeds available pages', {
          requestedPage: page,
          totalPages,
          totalDocs: paginatedData.totalDocs,
          dataReturned: paginatedData.data.length,
        });
      }

      // Transform entities to DTOs using plainToInstance
      const userDtos = paginatedData.data.map(user => plainToInstance(UserDto, user));

      // Build complete pagination metadata using factory (now handles out-of-range pages correctly)
      const paginationInfo = PaginationInfoFactory.create({
        totalDocs: paginatedData.totalDocs,
        page,
        take,
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
