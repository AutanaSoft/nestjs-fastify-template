/**
 * Configuration interface for customizing Prisma error handling per module context.
 * Allows modules to provide specific error messages and codes for better user experience.
 */
export interface PrismaErrorConfig {
  /** Optional custom error messages for different Prisma error types */
  readonly messages?: {
    /** Message for P2002 - Unique constraint violation */
    readonly uniqueConstraint?: string;
    /** Message for P2025 - Record not found */
    readonly notFound?: string;
    /** Message for P2003 - Foreign key constraint violation */
    readonly foreignKeyConstraint?: string;
    /** Message for validation errors */
    readonly validation?: string;
    /** Message for connection/initialization errors */
    readonly connection?: string;
    /** Message for unknown/unhandled errors */
    readonly unknown?: string;
  };

  /** Optional custom error codes for GraphQL extensions */
  readonly codes?: {
    /** Custom code for not found errors */
    readonly notFound?: string;
  };
}
