import bcrypt from "bcryptjs";

// Passwords are one-way hashed with bcrypt before they reach json-server.
// "Decrypting" at login means hashing the attempt and comparing it to the stored hash.
const SALT_ROUNDS = 10;

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT_ROUNDS);

export const verifyPassword = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);
