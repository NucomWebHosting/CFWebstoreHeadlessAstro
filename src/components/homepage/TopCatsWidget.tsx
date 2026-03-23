import type { CategoryRow } from "../../lib/types";
import CategoryCard from "../ui/CategoryCard";

// Tailwind requires complete class names — use a lookup map for dynamic cols
const colsClasses: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
};

interface Props {
  categories: CategoryRow[];
  title?: string | null;
  cols?: number | null;
  imageBaseUrl?: string;
}

export default function TopCatsWidget({ categories, title, cols, imageBaseUrl = "" }: Props) {
  if (!categories.length) return null;

  const clampedCols = Math.min(Math.max(cols ?? 4, 2), 6);
  const gridClass = colsClasses[clampedCols] ?? colsClasses[4];

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
        )}
        <div className={`grid ${gridClass} gap-4`}>
          {categories.map((cat) => (
            <CategoryCard key={cat.Category_ID} category={cat} imageBaseUrl={imageBaseUrl} />
          ))}
        </div>
      </div>
    </div>
  );
}
