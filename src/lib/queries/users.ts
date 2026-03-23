import { createHash } from "crypto";
import { query } from "../db";

interface UserRow {
  User_ID: number;
  UserName: string;
  Password: string;
  Email: string | null;
  Permissions: string | null;
  Group_ID: number | null;
}

export async function getUserByUsername(username: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    `SELECT User_ID, UserName, Password, Email, Permissions, Group_ID
     FROM Users
     WHERE (UserName = @username OR Email = @username) AND Disable = 0`,
    { username }
  );
  return rows[0] ?? null;
}

// ColdFusion Hash(password,"SHA-512") returns uppercase hex — replicate exactly.
export function verifyPassword(plaintext: string, stored: string): boolean {
  const sha512 = createHash("sha512").update(plaintext).digest("hex").toUpperCase();
  const md5    = createHash("md5").update(plaintext).digest("hex").toUpperCase();
  return sha512 === stored || md5 === stored;
}
