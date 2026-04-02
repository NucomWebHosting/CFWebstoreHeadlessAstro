import { query } from "../db";

export interface PermissionGroup {
  Group_ID: number;
  Name: string;
  bits: PermissionBit[];
}

export interface PermissionBit {
  BitValue: number;
  Name: string;
}

export interface AccessKey {
  accesskey_ID: number;
  Name: string;
}

export async function getPermissionGroups(): Promise<PermissionGroup[]> {
  const pgRows = await query<{ Group_ID: number; Name: string }>(
    `SELECT Group_ID, Name FROM Permission_Groups ORDER BY Name`,
    {}
  );
  if (pgRows.length === 0) return [];

  const ids = pgRows.map((r) => r.Group_ID).join(",");
  const permRows = await query<{ Group_ID: number; BitValue: number; Name: string }>(
    `SELECT Group_ID, BitValue, Name FROM Permissions WHERE Group_ID IN (${ids}) ORDER BY Group_ID, BitValue`,
    {}
  );

  const bitsMap = new Map<number, PermissionBit[]>();
  for (const r of permRows) {
    if (!bitsMap.has(r.Group_ID)) bitsMap.set(r.Group_ID, []);
    bitsMap.get(r.Group_ID)!.push({ BitValue: r.BitValue, Name: r.Name });
  }

  return pgRows.map((pg) => ({
    ...pg,
    bits: bitsMap.get(pg.Group_ID) ?? [],
  }));
}

export async function getAccessKeys(): Promise<AccessKey[]> {
  return query<AccessKey>(
    `SELECT accesskey_ID, Name, System FROM AccessKeys ORDER BY Name`,
    {}
  );
}

export interface AccessKeyDetail {
  accesskey_ID: number;
  Name: string;
  System: boolean;
}

export async function getAccessKey(id: number): Promise<AccessKeyDetail | null> {
  const rows = await query<AccessKeyDetail>(
    `SELECT accesskey_ID, Name, System FROM AccessKeys WHERE accesskey_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createAccessKey(name: string): Promise<number> {
  const result = await query<{ id: number }>(
    `INSERT INTO AccessKeys (Name, System) OUTPUT INSERTED.accesskey_ID AS id VALUES (@name, 0)`,
    { name }
  );
  return result[0].id;
}

export async function updateAccessKey(id: number, name: string): Promise<void> {
  await query(
    `UPDATE AccessKeys SET Name = @name WHERE accesskey_ID = @id`,
    { id, name }
  );
}

/** Returns an array of dependency error messages, or empty array if safe to delete. */
export async function checkAccessKeyDeps(id: number): Promise<string[]> {
  const errors: string[] = [];

  const [mem, cat, feat, page, prod] = await Promise.all([
    query<{ n: number }>(
      `SELECT COUNT(*) AS n FROM Memberships
       WHERE AccessKey_ID = @id
         OR AccessKey_ID LIKE @prefix
         OR AccessKey_ID LIKE @suffix
         OR AccessKey_ID LIKE @middle`,
      { id, prefix: `${id},%`, suffix: `%,${id}`, middle: `%,${id},%` }
    ),
    query<{ n: number }>(`SELECT COUNT(*) AS n FROM Categories WHERE AccessKey = @id`, { id }),
    query<{ n: number }>(`SELECT COUNT(*) AS n FROM Features  WHERE AccessKey = @id`, { id }),
    query<{ n: number }>(`SELECT COUNT(*) AS n FROM Pages     WHERE AccessKey = @id`, { id }),
    query<{ n: number }>(`SELECT COUNT(*) AS n FROM Products  WHERE AccessKey = @id`, { id }),
  ]);

  if (mem[0].n  > 0) errors.push("This Access Key is used in Memberships. Please edit or delete those first.");
  if (cat[0].n  > 0) errors.push("This Access Key is used in Categories. Please edit or delete those first.");
  if (feat[0].n > 0) errors.push("This Access Key is used in Features. Please edit or delete those first.");
  if (page[0].n > 0) errors.push("This Access Key is used in Pages. Please edit or delete those first.");
  if (prod[0].n > 0) errors.push("This Access Key is used in Products. Please edit or delete those first.");

  return errors;
}

/** Remove an access key from all user/group permission strings, then delete it. */
export async function deleteAccessKey(id: number): Promise<void> {
  // Strip key from Users.Permissions contentkey_list
  const users = await query<{ User_ID: number; Permissions: string }>(
    `SELECT User_ID, Permissions FROM Users WHERE Permissions LIKE '%contentkey_list%'`,
    {}
  );
  for (const u of users) {
    const updated = removeKeyFromPermissions(u.Permissions, id);
    if (updated !== u.Permissions) {
      await query(`UPDATE Users SET Permissions = @p WHERE User_ID = @uid`, { p: updated, uid: u.User_ID });
    }
  }

  // Strip key from Groups.Permissions contentkey_list
  const groups = await query<{ Group_ID: number; Permissions: string }>(
    `SELECT Group_ID, Permissions FROM [Groups] WHERE Permissions LIKE '%contentkey_list%'`,
    {}
  );
  for (const g of groups) {
    const updated = removeKeyFromPermissions(g.Permissions, id);
    if (updated !== g.Permissions) {
      await query(`UPDATE [Groups] SET Permissions = @p WHERE Group_ID = @gid`, { p: updated, gid: g.Group_ID });
    }
  }

  await query(`DELETE FROM AccessKeys WHERE accesskey_ID = @id`, { id });
}

function removeKeyFromPermissions(permissions: string, keyId: number): string {
  const parts = permissions.split(";");
  const idx = parts.findIndex((p) => p.toLowerCase().startsWith("contentkey_list^"));
  if (idx === -1) return permissions;

  const keyStr = String(keyId);
  const after = parts[idx].substring(parts[idx].indexOf("^") + 1);
  const keys = after.split(",").filter((k) => k.trim() !== keyStr);

  if (keys.length === 0) {
    parts.splice(idx, 1);
  } else {
    parts[idx] = `contentkey_list^${keys.join(",")}`;
  }
  return parts.join(";");
}

/** Parse the semicolon-delimited permissions string into a Map<circuitName, value>. */
export function parsePermissions(permStr: string | null): Map<string, string> {
  const map = new Map<string, string>();
  if (!permStr) return map;
  for (const pair of permStr.split(";")) {
    const idx = pair.indexOf("^");
    if (idx > 0) {
      map.set(pair.substring(0, idx).toLowerCase(), pair.substring(idx + 1));
    }
  }
  return map;
}

export async function getGroupPermissionString(groupId: number): Promise<string> {
  const rows = await query<{ Permissions: string | null }>(
    `SELECT Permissions FROM [Groups] WHERE Group_ID = @id`,
    { id: groupId }
  );
  return rows[0]?.Permissions ?? "";
}

export async function updateGroupPermissions(
  groupId: number,
  permissions: string
): Promise<void> {
  await query(
    `UPDATE [Groups] SET Permissions = @permissions WHERE Group_ID = @id`,
    { id: groupId, permissions }
  );
}
