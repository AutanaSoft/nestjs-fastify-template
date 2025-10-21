/**
 * Enum defining different types of temporary JWT tokens used for various authentication flows
 */
export enum JwtTempTokenType {
  FORGOT_PASSWORD = 'forgot_password',
  RESET_PASSWORD = 'reset_password',
  REFRESH_TOKEN = 'refresh_token',
}
