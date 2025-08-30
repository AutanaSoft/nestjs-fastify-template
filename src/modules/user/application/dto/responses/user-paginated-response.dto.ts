import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from '@/shared/application/dto';
import { UserDto } from './user.dto';

/**
 * GraphQL response DTO for paginated user results
 * Extends the generic PaginatedResponse with UserDto as the data type
 */
@ObjectType()
export class UserPaginatedResponseDto extends PaginatedResponse(UserDto) {}
