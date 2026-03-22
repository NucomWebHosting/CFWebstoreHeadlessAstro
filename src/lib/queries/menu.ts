import { getMenuCategories } from "./categories";
import type { CategoryRow, NavItem } from "../types";

// Builds a two-level nav tree from Categories where Display_Menu = 1.
// Uses a single DB query then builds the tree in memory — avoids N+1 queries.
export async function getNavTree(): Promise<NavItem[]> {
  const cats = await getMenuCategories();

  // Separate top-level (Parent_ID = 0) from children
  const topLevel = cats.filter((c) => c.Parent_ID === 0);
  const children = cats.filter((c) => c.Parent_ID !== 0);

  return topLevel.map((parent) => ({
    id: parent.Category_ID,
    name: parent.Name,
    href: parent.Permalink ? `/${parent.Permalink}` : `/category/${parent.Category_ID}`,
    children: children
      .filter((c) => c.Parent_ID === parent.Category_ID)
      .map((c) => ({
        id: c.Category_ID,
        name: c.Name,
        href: c.Permalink ? `/${c.Permalink}` : `/category/${c.Category_ID}`,
        children: [],
      })),
  }));
}
