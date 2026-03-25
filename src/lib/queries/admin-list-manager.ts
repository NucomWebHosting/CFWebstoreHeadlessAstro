import { query } from "../db";

// ── List ────────────────────────────────────────────────────────────────────

export interface ListRow {
  List_ID: number;
  name: string;
  text: string | null;
  list_style: number;
  priority: number;
}

export async function getLists(): Promise<ListRow[]> {
  return query<ListRow>(
    `SELECT List_ID, name, text, list_style, priority FROM List ORDER BY priority, name ASC`,
    {}
  );
}

export async function getList(id: number): Promise<ListRow | null> {
  const rows = await query<ListRow>(
    `SELECT List_ID, name, text, list_style, priority FROM List WHERE List_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createList(data: {
  name: string; text: string; list_style: number; priority: number;
}): Promise<number> {
  const rows = await query<{ List_ID: number }>(
    `INSERT INTO List (name, text, list_style, priority)
     OUTPUT INSERTED.List_ID
     VALUES (@name, @text, @list_style, @priority)`,
    data
  );
  return rows[0]?.List_ID ?? 0;
}

export async function updateList(id: number, data: {
  name: string; text: string; list_style: number; priority: number;
}): Promise<void> {
  await query(
    `UPDATE List SET name = @name, text = @text, list_style = @list_style, priority = @priority
     WHERE List_ID = @id`,
    { id, ...data }
  );
}

export async function deleteList(id: number): Promise<void> {
  await query(`DELETE FROM List_Questions WHERE List_ID = @id`, { id });
  await query(`DELETE FROM List WHERE List_ID = @id`, { id });
}

// ── List_Category ───────────────────────────────────────────────────────────

export interface ListCategory {
  Category_ID: number;
  name: string;
  priority: number;
}

export async function getListCategories(): Promise<ListCategory[]> {
  return query<ListCategory>(
    `SELECT Category_ID, name, priority FROM List_Category ORDER BY priority, name ASC`,
    {}
  );
}

export async function getListCategory(id: number): Promise<ListCategory | null> {
  const rows = await query<ListCategory>(
    `SELECT Category_ID, name, priority FROM List_Category WHERE Category_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createListCategory(name: string, priority: number): Promise<void> {
  const p = priority === 0 ? 9999 : priority;
  await query(
    `INSERT INTO List_Category (name, priority) VALUES (@name, @priority)`,
    { name, priority: p }
  );
}

export async function updateListCategory(id: number, name: string, priority: number): Promise<void> {
  const p = priority === 0 ? 9999 : priority;
  await query(
    `UPDATE List_Category SET name = @name, priority = @priority WHERE Category_ID = @id`,
    { id, name, priority: p }
  );
}

export async function deleteListCategory(id: number): Promise<void> {
  await query(`DELETE FROM List_Category WHERE Category_ID = @id`, { id });
}

// ── List_Questions ──────────────────────────────────────────────────────────

export interface ListQuestion {
  ID: number;
  list_id: number;
  question: string;
  answer: string | null;
  category_id: number | null;
  display: boolean;
  priority: number;
  catName: string | null;
}

export async function getListQuestions(listId: number): Promise<ListQuestion[]> {
  return query<ListQuestion>(
    `SELECT Q.ID, Q.list_id, Q.question, Q.answer, Q.category_id, Q.display, Q.priority,
            C.name AS catName
     FROM List_Questions Q
     LEFT JOIN List_Category C ON C.Category_ID = Q.category_id
     WHERE Q.List_ID = @listId
     ORDER BY C.priority, Q.priority`,
    { listId }
  );
}

export async function createListQuestion(data: {
  list_id: number; question: string; answer: string;
  category_id: number; display: boolean; priority: number;
}): Promise<void> {
  await query(
    `INSERT INTO List_Questions (list_id, question, answer, category_id, display, priority)
     VALUES (@list_id, @question, @answer, @category_id, @display, @priority)`,
    data
  );
}

export async function updateListQuestion(id: number, data: {
  question: string; answer: string; category_id: number; display: boolean; priority: number;
}): Promise<void> {
  await query(
    `UPDATE List_Questions
     SET question = @question, answer = @answer, category_id = @category_id,
         display = @display, priority = @priority
     WHERE ID = @id`,
    { id, ...data }
  );
}

export async function deleteListQuestion(id: number): Promise<void> {
  await query(`DELETE FROM List_Questions WHERE ID = @id`, { id });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

export function normalizePriority(val: string): number {
  const n = parseInt(val) || 0;
  return n === 0 ? 9999 : n;
}

export function displayPriority(p: number): number {
  return p >= 9999 ? 0 : p;
}

export const LIST_STYLES: Record<number, string> = {
  2: "Text Only",
  0: "Minimal Accordion",
  1: "Boxed Accordion",
  4: "Masonry Boxes",
};
