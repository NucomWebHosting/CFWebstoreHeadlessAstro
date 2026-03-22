import type { CategoryRow } from "../../lib/types";

interface Props {
  category: CategoryRow;
}

export default function CategoryCard({ category }: Props) {
  const href = category.Permalink
    ? `/${category.Permalink}`
    : `/category/${category.Category_ID}`;

  return (
    <a
      href={href}
      className="group flex flex-col items-center rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden p-4 text-center"
    >
      {category.Sm_Image && (
        <img
          src={category.Sm_Image}
          alt={category.Name}
          className="w-20 h-20 object-cover rounded-full mb-3 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      )}
      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
        {category.Name}
      </h3>
      {category.Short_Desc && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.Short_Desc}</p>
      )}
    </a>
  );
}
