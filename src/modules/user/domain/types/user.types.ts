import { SortOrder } from '@/shared/domain/enums';
import { PaginateData } from '@shared/domain/types';
import { UserOrderBy, UserRole, UserStatus } from '../enums';

/**
 * Properties required for a UserEntity instance.
 *
 * Esta interfaz define la estructura completa de datos para una entidad de usuario.
 * Se utiliza como parámetro para el constructor de UserEntity, garantizando
 * que todas las propiedades necesarias estén presentes al crear una instancia.
 */
export interface UserEntityData {
  /** Identificador único del usuario (UUID) */
  id: string;

  /**
   * Dirección de correo electrónico del usuario.
   * Debe ser única en todo el sistema y se utiliza para autenticación.
   */
  email: string;

  /**
   * Contraseña hasheada del usuario.
   * Nunca debe almacenarse en texto plano.
   */
  password: string;

  /**
   * Nombre de usuario elegido para mostrar.
   * Debe ser único y se utiliza para identificación dentro de la aplicación.
   */
  userName: string;

  /**
   * Estado actual de la cuenta de usuario.
   * Determina si el usuario puede acceder al sistema.
   */
  status: UserStatus;

  /**
   * Rol asignado al usuario.
   * Determina los permisos y niveles de acceso dentro del sistema.
   */
  role: UserRole;

  /** Fecha y hora de creación de la cuenta de usuario */
  createdAt: Date;

  /** Fecha y hora de la última actualización de la cuenta */
  updatedAt: Date;
}

/**
 * Data required to create a new user
 */
export type UserCreateData = {
  /** User's email address - must be unique */
  email: string;
  /** User's display name - must be unique */
  userName: string;
  /** User's password - will be hashed before storage */
  password: string;
  /** User's account status - defaults to ACTIVE */
  status?: UserStatus;
  /** User's role - defaults to USER */
  role?: UserRole;
};

/**
 * Data for updating an existing user
 * All fields are optional since this is used for partial updates
 */
export type UserUpdateData = Partial<UserCreateData>;

/**
 * Filter criteria for finding users
 * All fields are optional and will be combined with AND logic
 */
export type UserFindFilterData = {
  /** Filter by exact email match */
  email?: string;
  /** Filter by exact username match */
  userName?: string;
  /** Filter by user status */
  status?: UserStatus;
  /** Filter by user role */
  role?: UserRole;
  /** Filter users created on or after this date */
  createdAtFrom?: Date;
  /** Filter users created on or before this date */
  createdAtTo?: Date;
};

/**
 * Sorting configuration for user queries
 */
export type UserOrderByData = {
  /** Field to sort by */
  by?: UserOrderBy;
  /** Sort direction - ASC or DESC */
  order?: SortOrder;
};

/**
 * Combined filter and sort parameters for finding users
 * Used for non-paginated queries
 */
export type UserFindPaginatedData = {
  /** Optional filter criteria */
  filter?: UserFindFilterData;
  /** Optional sort configuration */
  orderBy?: UserOrderByData;
};

/**
 * Combined parameters for paginated user repository queries
 * Includes direct Prisma pagination, filtering, and sorting options
 */
export type UserFindAllPaginateData = PaginateData & UserFindPaginatedData;
