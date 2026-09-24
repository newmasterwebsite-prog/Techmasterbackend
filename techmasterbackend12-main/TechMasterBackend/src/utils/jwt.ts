import jwt from "jsonwebtoken";

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
}

const getAccessSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured in the environment variables.");
  }
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not configured in the environment variables.");
  }
  return secret;
};

/**
 * Generate a short-lived access token
 */
export const generateAccessToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: "15m", // Access tokens expire in 15 minutes
  });
};

/**
 * Generate a long-lived refresh token
 */
export const generateRefreshToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: "7d", // Refresh tokens expire in 7 days
  });
};

/**
 * Verify access token and return payload
 */
export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, getAccessSecret()) as IJwtPayload;
};

/**
 * Verify refresh token and return payload
 */
export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, getRefreshSecret()) as IJwtPayload;
};
