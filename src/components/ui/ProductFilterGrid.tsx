import { useState, useMemo, useEffect } from "react";
import type { ProductRow } from "../../lib/types";
import ProductCard from "./ProductCard";
import ProductCardModave1 from "./ProductCardModave1";
import ProductCardModave11 from "./ProductCardModave11";

type SortOption = "default" | "price_asc" | "price_desc" | "name_asc" | "newest";

interface Props {
  products: ProductRow[];
  cardStyle?: string;
  displayFilter?: number; // 0=none, 1=sidebar, 2=slide-in only
  pcolumns?: number;      // initial column count from display_config
}

function LayoutIcon({ layout, active, onClick, children }: {
  layout: number; active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  const color = active ? "#181818" : "#b0b0b0";
  return (
    <li
      className={`tf-view-layout-switch sw-layout-${layout === 1 ? "list" : layout}${active ? " active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="item" style={{ color }}>
        {children}
      </div>
    </li>
  );
}

function LayoutSwitcher({ activeLayout, setActiveLayout, hasSidebar }: {
  activeLayout: number;
  setActiveLayout: (n: number) => void;
  hasSidebar: boolean;
}) {
  const c = (active: boolean) => active ? "#181818" : "#b0b0b0";

  return (
    <ul className="tf-control-layout" style={{ display: "flex", alignItems: "center", gap: "8px", listStyle: "none", margin: 0, padding: 0 }}>
      <LayoutIcon layout={1} active={activeLayout === 1} onClick={() => setActiveLayout(1)}>
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <circle cx={3} cy={6} r={2.5} stroke={c(activeLayout === 1)} /><rect x={7.5} y={3.5} width={12} height={5} rx={2.5} stroke={c(activeLayout === 1)} />
          <circle cx={3} cy={14} r={2.5} stroke={c(activeLayout === 1)} /><rect x={7.5} y={11.5} width={12} height={5} rx={2.5} stroke={c(activeLayout === 1)} />
        </svg>
      </LayoutIcon>
      <LayoutIcon layout={2} active={activeLayout === 2} onClick={() => setActiveLayout(2)}>
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <circle cx={6} cy={6} r={2.5} stroke={c(activeLayout === 2)} /><circle cx={14} cy={6} r={2.5} stroke={c(activeLayout === 2)} />
          <circle cx={6} cy={14} r={2.5} stroke={c(activeLayout === 2)} /><circle cx={14} cy={14} r={2.5} stroke={c(activeLayout === 2)} />
        </svg>
      </LayoutIcon>
      <LayoutIcon layout={3} active={activeLayout === 3} onClick={() => setActiveLayout(3)}>
        <svg width={22} height={20} viewBox="0 0 22 20" fill="none">
          <circle cx={3} cy={6} r={2.5} stroke={c(activeLayout === 3)} /><circle cx={11} cy={6} r={2.5} stroke={c(activeLayout === 3)} /><circle cx={19} cy={6} r={2.5} stroke={c(activeLayout === 3)} />
          <circle cx={3} cy={14} r={2.5} stroke={c(activeLayout === 3)} /><circle cx={11} cy={14} r={2.5} stroke={c(activeLayout === 3)} /><circle cx={19} cy={14} r={2.5} stroke={c(activeLayout === 3)} />
        </svg>
      </LayoutIcon>
      <LayoutIcon layout={4} active={activeLayout === 4} onClick={() => setActiveLayout(4)}>
        <svg width={30} height={20} viewBox="0 0 30 20" fill="none">
          <circle cx={3} cy={6} r={2.5} stroke={c(activeLayout === 4)} /><circle cx={11} cy={6} r={2.5} stroke={c(activeLayout === 4)} /><circle cx={19} cy={6} r={2.5} stroke={c(activeLayout === 4)} /><circle cx={27} cy={6} r={2.5} stroke={c(activeLayout === 4)} />
          <circle cx={3} cy={14} r={2.5} stroke={c(activeLayout === 4)} /><circle cx={11} cy={14} r={2.5} stroke={c(activeLayout === 4)} /><circle cx={19} cy={14} r={2.5} stroke={c(activeLayout === 4)} /><circle cx={27} cy={14} r={2.5} stroke={c(activeLayout === 4)} />
        </svg>
      </LayoutIcon>
      {!hasSidebar && (
        <LayoutIcon layout={5} active={activeLayout === 5} onClick={() => setActiveLayout(5)}>
          <svg width={38} height={20} viewBox="0 0 38 20" fill="none">
            <circle cx={3} cy={6} r={2.5} stroke={c(activeLayout === 5)} /><circle cx={11} cy={6} r={2.5} stroke={c(activeLayout === 5)} /><circle cx={19} cy={6} r={2.5} stroke={c(activeLayout === 5)} /><circle cx={27} cy={6} r={2.5} stroke={c(activeLayout === 5)} /><circle cx={35} cy={6} r={2.5} stroke={c(activeLayout === 5)} />
            <circle cx={3} cy={14} r={2.5} stroke={c(activeLayout === 5)} /><circle cx={11} cy={14} r={2.5} stroke={c(activeLayout === 5)} /><circle cx={19} cy={14} r={2.5} stroke={c(activeLayout === 5)} /><circle cx={27} cy={14} r={2.5} stroke={c(activeLayout === 5)} /><circle cx={35} cy={14} r={2.5} stroke={c(activeLayout === 5)} />
          </svg>
        </LayoutIcon>
      )}
    </ul>
  );
}

function CardComponent({ product, cardStyle }: { product: ProductRow; cardStyle: string }) {
  switch (cardStyle) {
    case "ProductCard1":  return <ProductCardModave1 product={product} />;
    case "ProductCard11": return <ProductCardModave11 product={product} />;
    default:              return <ProductCard product={product} />;
  }
}

export default function ProductFilterGrid({ products, cardStyle = "default", displayFilter = 0, pcolumns }: Props) {
  // Filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [saleOnly, setSaleOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLayout, setActiveLayout] = useState(pcolumns && pcolumns >= 1 && pcolumns <= 5 ? pcolumns : 4);

  // Responsive: cap columns on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActiveLayout(prev => prev > 2 ? 2 : prev);
      } else if (window.innerWidth < 1200) {
        setActiveLayout(prev => prev > 3 ? 3 : prev);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasSidebar = displayFilter === 1;

  // Map activeLayout to Tailwind grid classes
  function gridClasses() {
    switch (activeLayout) {
      case 1:  return "grid-cols-1";
      case 2:  return "grid-cols-2";
      case 3:  return "grid-cols-2 sm:grid-cols-3";
      case 4:  return hasSidebar ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
      case 5:  return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default: return hasSidebar ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
    }
  }

  // Derive available brands from products
  const brands = useMemo(() => {
    const map = new Map<number, string>();
    for (const p of products) {
      if (p.brand_id && p.brand_name) {
        map.set(p.brand_id, p.brand_name);
      }
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  // Derive price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map(p => Number(p.price));
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  // Filter + sort products
  const filtered = useMemo(() => {
    let result = [...products];

    // Price filter
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    if (min !== null) result = result.filter(p => Number(p.price) >= min);
    if (max !== null) result = result.filter(p => Number(p.price) <= max);

    // Sale filter
    if (saleOnly) result = result.filter(p => p.is_on_sale);

    // Brand filter
    if (selectedBrands.size > 0) {
      result = result.filter(p => p.brand_name && selectedBrands.has(p.brand_name));
    }

    // Sort
    switch (sort) {
      case "price_asc":  result.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price_desc": result.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "name_asc":   result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "newest":     result.sort((a, b) => {
        const da = a.date_created ? new Date(a.date_created).getTime() : 0;
        const db = b.date_created ? new Date(b.date_created).getTime() : 0;
        return db - da;
      }); break;
    }

    return result;
  }, [products, minPrice, maxPrice, saleOnly, selectedBrands, sort]);

  const toggleBrand = (name: string) => {
    setSelectedBrands(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSaleOnly(false);
    setSelectedBrands(new Set());
    setSort("default");
  };

  const hasActiveFilters = minPrice || maxPrice || saleOnly || selectedBrands.size > 0 || sort !== "default";

  // --- Filter sidebar content (shared between desktop and mobile) ---
  const filterContent = (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Price</h4>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder={String(priceRange.min)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <span className="text-gray-400 mt-4">–</span>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder={String(priceRange.max)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Sale toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={e => setSaleOnly(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Shop sale items only</span>
        </label>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Brand</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {brands.map(b => (
              <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.has(b.name)}
                  onChange={() => toggleBrand(b.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{b.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full text-sm text-gray-500 hover:text-gray-800 border border-gray-300 rounded px-3 py-2 hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );

  // No filter mode — just render the grid
  if (displayFilter === 0) {
    return (
      <div>
        {/* Sort bar + layout switcher */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
          <LayoutSwitcher activeLayout={activeLayout} setActiveLayout={setActiveLayout} hasSidebar={false} />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="default">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name_asc">Name A–Z</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No products found.</p>
          </div>
        ) : (
          <div className={`grid ${gridClasses()} gap-6`}>
            {filtered.map(p => <CardComponent key={p.product_id} product={p} cardStyle={cardStyle} />)}
          </div>
        )}
      </div>
    );
  }

  // Filter mode (1 = sidebar on desktop + slide-in mobile, 2 = slide-in only)
  return (
    <div>
      {/* Top bar: filter button + sort */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors ${hasSidebar ? "lg:hidden" : ""}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </button>
          {saleOnly && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">
              Sale
              <button onClick={() => setSaleOnly(false)} className="hover:text-red-800">×</button>
            </span>
          )}
          {Array.from(selectedBrands).map(b => (
            <span key={b} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
              {b}
              <button onClick={() => toggleBrand(b)} className="hover:text-blue-800">×</button>
            </span>
          ))}
        </div>
        <LayoutSwitcher activeLayout={activeLayout} setActiveLayout={setActiveLayout} hasSidebar={hasSidebar} />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="default">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name_asc">Name A–Z</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className={hasSidebar ? "lg:flex lg:gap-8" : ""}>
        {/* Desktop sidebar (displayFilter=1 only) */}
        {hasSidebar && (
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            {filterContent}
          </aside>
        )}

        {/* Mobile slide-in overlay */}
        {sidebarOpen && (
          <>
            <div
              className={`fixed inset-0 bg-black/40 z-40 ${hasSidebar ? "lg:hidden" : ""}`}
              onClick={() => setSidebarOpen(false)}
            />
            <div className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-xl overflow-y-auto ${hasSidebar ? "lg:hidden" : ""}`}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                {filterContent}
              </div>
            </div>
          </>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No products found.</p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="mt-2 text-sm text-blue-600 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className={`grid ${gridClasses()} gap-6`}>
              {filtered.map(p => <CardComponent key={p.product_id} product={p} cardStyle={cardStyle} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
