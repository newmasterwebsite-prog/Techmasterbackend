import bcrypt from "bcryptjs";

/**
 * Hash a plain text password.
 * @param password Plain text password
 * @param saltRounds Number of salt rounds (defaults to 12)
 */
export const hashPassword = async (password: string, saltRounds: number = 12): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain text password with a hash.
 * @param password Plain text password
 * @param hash Hashed password
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
