import { useState } from "react";

interface Tab {
  label: string;
  html: string;
}

interface Props {
  tabs: Tab[];
}

export default function ProductTabs({ tabs }: Props) {
  const [active, setActive] = useState(0);

  if (!tabs.length) return null;

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              i === active
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="prose max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: tabs[active].html }}
      />
    </div>
  );
}
