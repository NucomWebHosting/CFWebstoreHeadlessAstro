import { query } from "../db";
import type { CategoryRow } from "../types";

export async function getCategoryByPermalink(permalink: string): Promise<CategoryRow | null> {
  // DB stores permalinks with a trailing slash; the URL may or may not have one.
  // Try both variants so either form works.
  const rows = await query<CategoryRow>(
    `SELECT C.*
     FROM Categories C
     WHERE C.Display = 1
       AND (C.Permalink = @slug OR C.Permalink = @slug_trail)`,
    { slug: permalink, slug_trail: permalink.replace(/\/$/, "") + "/" }
  );
  return rows[0] ?? null;
}

export async function getCategoryById(id: number): Promise<CategoryRow | null> {
  const rows = await query<CategoryRow>(
    `SELECT C.*
     FROM Categories C
     WHERE C.Category_ID = @id AND C.Display = 1`,
    { id }
  );
  return rows[0] ?? null;
}

export async function getTopLevelCategories(): Promise<CategoryRow[]> {
  return query<CategoryRow>(
    `SELECT C.*
     FROM Categories C
     WHERE C.Parent_ID = 0 AND C.Display = 1
     ORDER BY C.Priority ASC, C.Name ASC`
  );
}

export async function getSubcategories(parentId: number): Promise<CategoryRow[]> {
  return query<CategoryRow>(
    `SELECT C.*
     FROM Categories C
     WHERE C.Parent_ID = @parent_id AND C.Display = 1
     ORDER BY C.Priority ASC, C.Name ASC`,
    { parent_id: parentId }
  );
}

export async function getMenuCategories(): Promise<CategoryRow[]> {
  return query<CategoryRow>(
    `SELECT C.*
     FROM Categories C
     WHERE C.Display_Menu = 1 AND C.Display = 1
     ORDER BY C.Parent_ID ASC, C.Priority ASC, C.Name ASC`
  );
}
