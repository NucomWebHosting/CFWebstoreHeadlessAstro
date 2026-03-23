import type { CategoryRow } from "../../lib/types";

interface Props {
  category: CategoryRow;
  imageBaseUrl?: string;
}

function resolveImage(filename: string | null, baseUrl: string): string | null {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  return `${baseUrl.replace(/\/$/, "")}/${filename}`;
}

export default function CategoryCard({ category, imageBaseUrl = "" }: Props) {
  const href = category.Permalink
    ? `/${category.Permalink}`
    : `/category/${category.Category_ID}`;

  const image = resolveImage(category.Sm_Image, imageBaseUrl);

  return (
    <a
      href={href}
      className="group flex flex-col items-center rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden p-4 text-center bg-white"
    >
      {image ? (
        <div className="w-24 h-24 mb-3 overflow-hidden rounded-lg flex-shrink-0">
          <img
            src={image}
            alt={category.Name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-24 h-24 mb-3 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      )}

      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 leading-tight">
        {category.Name}
      </h3>
      {category.Short_Desc && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.Short_Desc}</p>
      )}
    </a>
  );
}
