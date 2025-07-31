import * as bcrypt from 'bcrypt';

/**
 * Hash utility functions for password encryption and comparison
 */
export class HashUtils {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hashes a password using bcrypt
   * @param password - Plain text password to hash
   * @returns Promise<string> - Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compares a plain text password with a hashed password
   * @param password - Plain text password
   * @param hash - Hashed password to compare against
   * @returns Promise<boolean> - True if passwords match
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
