import { query } from "../db";

export const PAGE_SIZE = 25;

// ── Blog list ────────────────────────────────────────────────────────────────

export interface BlogListRow {
  Blog_ID: number;
  Name: string;
  Author: string | null;
  Created: Date | null;
  category_id: number | null;
  category: string | null;
  Display: boolean;
  Approved: boolean;
  Highlight: boolean;
  Start: Date | null;
  Expire: Date | null;
}

export interface BlogListOptions {
  search?: string;
  category_id?: string;
  display_status?: string;
  order?: string;
  page?: number;
}

export async function getBlogs(
  opts: BlogListOptions
): Promise<{ rows: BlogListRow[]; total: number }> {
  const conditions: string[] = ["1=1"];
  const params: Record<string, unknown> = {};
  const now = new Date();

  if (opts.search?.trim()) {
    conditions.push(
      `(B.Name LIKE @search OR B.Author LIKE @search OR B.Short_Desc LIKE @search OR B.Long_Desc LIKE @search)`
    );
    params.search = `%${opts.search.trim()}%`;
  }

  if (opts.category_id?.trim() && !isNaN(Number(opts.category_id))) {
    conditions.push(`B.category_id = @category_id`);
    params.category_id = parseInt(opts.category_id);
  }

  switch (opts.display_status) {
    case "off":
      conditions.push(`B.Display = 0`);
      break;
    case "editor":
      conditions.push(`B.Display = 1 AND B.Approved = 0`);
      break;
    case "current":
      conditions.push(`B.Display = 1 AND B.Approved = 1`);
      conditions.push(`(B.Start IS NULL OR B.Start <= @now)`);
      conditions.push(`(B.Expire IS NULL OR B.Expire >= @now)`);
      params.now = now;
      break;
    case "scheduled":
      conditions.push(`B.Display = 1 AND B.Approved = 1 AND B.Start > @now`);
      params.now = now;
      break;
    case "expired":
      conditions.push(`B.Display = 1 AND B.Approved = 1 AND B.Expire < @now`);
      params.now = now;
      break;
  }

  const orderMap: Record<string, string> = {
    name:    "B.Name",
    author:  "B.Author",
    start:   "B.Start",
    expire:  "B.Expire",
    created: "B.Created DESC",
  };
  const orderSQL = orderMap[opts.order?.toLowerCase() ?? ""] ?? "B.Created DESC";
  const where = conditions.join(" AND ");

  const countRows = await query<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt FROM Blog B WHERE ${where}`,
    params
  );
  const total = countRows[0]?.cnt ?? 0;

  const page = Math.max(1, opts.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await query<BlogListRow>(
    `SELECT B.Blog_ID, B.Name, B.Author, B.Created, B.category_id,
            BC.name AS category, B.Display, B.Approved, B.Highlight, B.Start, B.Expire
     FROM Blog B
     LEFT JOIN Blog_Category BC ON BC.Category_ID = B.category_id
     WHERE ${where}
     ORDER BY ${orderSQL}
     OFFSET ${offset} ROWS FETCH NEXT ${PAGE_SIZE} ROWS ONLY`,
    params
  );

  return { rows, total };
}

// ── Blog detail ──────────────────────────────────────────────────────────────

export interface BlogDetail {
  Blog_ID: number;
  User_ID: number | null;
  Name: string;
  Permalink: string | null;
  Author: string | null;
  Display: boolean;
  Approved: boolean;
  Start: Date | null;
  Expire: Date | null;
  Highlight: boolean;
  Reviewable: boolean;
  Sm_Image: string | null;
  Lg_Image: string | null;
  Short_Desc: string | null;
  Long_Desc: string | null;
  TitleTag: string | null;
  Metadescription: string | null;
  Keywords: string | null;
  PassParam: string | null;
  Created: Date | null;
  category_id: number | null;
  cloud: string | null;
}

export async function getBlog(id: number): Promise<BlogDetail | null> {
  const rows = await query<BlogDetail>(
    `SELECT Blog_ID, User_ID, Name, Permalink, Author, Display, Approved, Start, Expire,
            Highlight, Reviewable, Sm_Image, Lg_Image, Short_Desc, Long_Desc,
            TitleTag, Metadescription, Keywords, PassParam, Created, category_id, cloud
     FROM Blog WHERE Blog_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

// ── Blog categories ──────────────────────────────────────────────────────────

export interface BlogCategory {
  Category_ID: number;
  name: string;
  priority: number;
  display: boolean;
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return query<BlogCategory>(
    `SELECT Category_ID, name, priority, display FROM Blog_Category ORDER BY priority, name ASC`,
    {}
  );
}

export async function getBlogCategory(id: number): Promise<BlogCategory | null> {
  const rows = await query<BlogCategory>(
    `SELECT Category_ID, name, priority, display FROM Blog_Category WHERE Category_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createBlogCategory(data: {
  name: string; priority: number; display: boolean;
}): Promise<void> {
  await query(
    `INSERT INTO Blog_Category (name, priority, display) VALUES (@name, @priority, @display)`,
    data
  );
}

export async function updateBlogCategory(id: number, data: {
  name: string; priority: number; display: boolean;
}): Promise<void> {
  await query(
    `UPDATE Blog_Category SET name = @name, priority = @priority, display = @display
     WHERE Category_ID = @id`,
    { id, ...data }
  );
}

export async function deleteBlogCategory(id: number): Promise<void> {
  await query(`DELETE FROM Blog_Category WHERE Category_ID = @id`, { id });
}

// ── Blog settings ────────────────────────────────────────────────────────────

export interface BlogSettings {
  MaxBlogs: number;
  blog_columns: number;
  show_Cloud: boolean;
  show_Categories: boolean;
  show_recentPosts: boolean;
  show_search: boolean;
  title: string | null;
  metadescription: string | null;
  Keywords: string | null;
  BlogReviews: boolean;
  BlogReview_add: number;
  BlogReview_flag: boolean;
  BlogReview_Approve: boolean;
  Captcha: boolean;
}

export async function getBlogSettings(): Promise<BlogSettings | null> {
  const rows = await query<BlogSettings>(
    `SELECT MaxBlogs, blog_columns, show_Cloud, show_Categories, show_recentPosts, show_search,
            title, metadescription, Keywords, BlogReviews, BlogReview_add, BlogReview_flag,
            BlogReview_Approve, Captcha
     FROM Blog_Settings`,
    {}
  );
  return rows[0] ?? null;
}

export async function saveBlogSettings(data: {
  MaxBlogs: number; blog_columns: number;
  show_Cloud: boolean; show_Categories: boolean; show_recentPosts: boolean; show_search: boolean;
  title: string; metadescription: string; Keywords: string;
  BlogReviews: boolean; BlogReview_add: number; BlogReview_flag: boolean;
  BlogReview_Approve: boolean; Captcha: boolean;
}): Promise<void> {
  await query(
    `UPDATE Blog_Settings SET
       MaxBlogs           = @MaxBlogs,
       blog_columns       = @blog_columns,
       show_Cloud         = @show_Cloud,
       show_Categories    = @show_Categories,
       show_recentPosts   = @show_recentPosts,
       show_search        = @show_search,
       title              = @title,
       metadescription    = @metadescription,
       Keywords           = @Keywords,
       BlogReviews        = @BlogReviews,
       BlogReview_add     = @BlogReview_add,
       BlogReview_flag    = @BlogReview_flag,
       BlogReview_Approve = @BlogReview_Approve,
       Captcha            = @Captcha
     WHERE ID = 1`,
    data
  );
}

// ── Blog CRUD ────────────────────────────────────────────────────────────────

export interface BlogData {
  User_ID: number;
  Name: string;
  Permalink: string;
  Author: string;
  Display: boolean;
  Approved: boolean;
  Start: string | null;
  Expire: string | null;
  Highlight: boolean;
  Reviewable: boolean;
  Sm_Image: string;
  Lg_Image: string;
  Short_Desc: string;
  Long_Desc: string;
  TitleTag: string;
  Metadescription: string;
  Keywords: string;
  PassParam: string;
  Created: string | null;
  category_id: number;
  cloud: string;
}

export async function createBlog(data: BlogData): Promise<number> {
  const rows = await query<{ Blog_ID: number }>(
    `INSERT INTO Blog
       (User_ID, Name, Permalink, Author, Copyright, Display, Approved, Start, Expire,
        Highlight, Reviewable, Display_Title, Sm_Image, Lg_Image, Short_Desc, Long_Desc,
        TitleTag, Metadescription, Keywords, PassParam, Color_ID, Created, category_id, cloud,
        Sm_Image_Width, Sm_Image_Height, Lg_Image_Width, Lg_Image_Height)
     OUTPUT INSERTED.Blog_ID
     VALUES
       (@User_ID, @Name, @Permalink, @Author, '', @Display, @Approved,
        ${data.Start ? "@Start" : "NULL"},
        ${data.Expire ? "@Expire" : "NULL"},
        @Highlight, @Reviewable, 1, @Sm_Image, @Lg_Image, @Short_Desc, @Long_Desc,
        @TitleTag, @Metadescription, @Keywords, @PassParam, NULL,
        ${data.Created ? "@Created" : "GETDATE()"},
        @category_id, @cloud, 0, 0, 0, 0)`,
    data
  );
  return rows[0]?.Blog_ID ?? 0;
}

export async function updateBlog(id: number, data: BlogData): Promise<void> {
  await query(
    `UPDATE Blog SET
       User_ID         = @User_ID,
       Name            = @Name,
       Permalink       = @Permalink,
       Author          = @Author,
       Display         = @Display,
       Approved        = @Approved,
       Start           = ${data.Start ? "@Start" : "NULL"},
       Expire          = ${data.Expire ? "@Expire" : "NULL"},
       Highlight       = @Highlight,
       Reviewable      = @Reviewable,
       Sm_Image        = @Sm_Image,
       Lg_Image        = @Lg_Image,
       Short_Desc      = @Short_Desc,
       Long_Desc       = @Long_Desc,
       TitleTag        = @TitleTag,
       Metadescription = @Metadescription,
       Keywords        = @Keywords,
       PassParam       = @PassParam,
       Created         = ${data.Created ? "@Created" : "GETDATE()"},
       category_id     = @category_id,
       cloud           = @cloud
     WHERE Blog_ID = @id`,
    { id, ...data }
  );
}

export async function deleteBlog(id: number): Promise<void> {
  await query(`DELETE FROM BlogReviews WHERE Blog_ID = @id`, { id });
  await query(`DELETE FROM Blog_Item WHERE Blog_ID = @id`, { id });
  await query(`DELETE FROM Blog WHERE Blog_ID = @id`, { id });
}

// ── Users (for author dropdown) ──────────────────────────────────────────────

export interface UserOption {
  User_ID: number;
  UserName: string;
}

export async function getBlogUsers(): Promise<UserOption[]> {
  return query<UserOption>(
    `SELECT User_ID, UserName FROM Users ORDER BY UserName ASC`,
    {}
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function normalizePriority(val: string): number {
  const n = parseInt(val) || 0;
  return n === 0 ? 9999 : n;
}

export function displayPriority(p: number): number {
  return p >= 9999 ? 0 : p;
}

export function generatePermalink(name: string): string {
  return name
    .toLowerCase()
    .replace(/:/g, ";")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    + "/";
}

export function getBlogStatus(row: { Display: boolean; Approved: boolean; Start: Date | null; Expire: Date | null }) {
  const now = new Date();
  if (!row.Display) return { label: "Off", color: "red" };
  if (!row.Approved) return { label: "Editor", color: "yellow" };
  if (row.Expire && row.Expire < now) return { label: `Expired ${row.Expire.toLocaleDateString()}`, color: "red" };
  if (row.Start && row.Start > now) return { label: `Scheduled ${row.Start.toLocaleDateString()}`, color: "yellow" };
  return { label: "Current", color: "green" };
}
