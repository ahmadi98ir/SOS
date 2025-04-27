// In-memory store for users and tokens (NOT for production)
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
  userId: string;
}

export const users: User[] = [];
export const tokens: TokenPair[] = [];
