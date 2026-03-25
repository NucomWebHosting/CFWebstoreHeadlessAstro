import { useState, useEffect, useRef } from "react";

interface ImageItem {
  filename: string;
  url: string;
  thumbUrl: string | null;
  size: number;
  width: number | null;
  height: number | null;
  created: string;
}

interface Props {
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
}

export default function ImagePickerInput({ name, value = "", placeholder, className }: Props) {
  const [val, setVal] = useState(value);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  async function openPicker() {
    setOpen(true);
    if (images.length === 0) {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/images");
        const data = await res.json();
        setImages(data.images ?? []);
      } finally {
        setLoading(false);
      }
    }
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on backdrop click
  function onBackdrop(e: React.MouseEvent) {
    if (e.target === modalRef.current) setOpen(false);
  }

  function select(url: string) {
    setVal(url);
    setOpen(false);
    setSearch("");
  }

  const filtered = images.filter((img) =>
    img.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
        <button
          type="button"
          onClick={openPicker}
          title="Browse media library"
          className="shrink-0 px-3 py-1.5 rounded border border-gray-300 bg-gray-50 text-gray-600 text-sm hover:bg-gray-100 transition-colors"
        >
          Browse
        </button>
      </div>

      {/* Preview */}
      {val && (
        <div className="mt-2">
          <img
            src={val}
            alt=""
            className="h-10 w-auto rounded border border-gray-200 object-contain bg-gray-50"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      )}

      {/* Modal */}
      {open && (
        <div
          ref={modalRef}
          onClick={onBackdrop}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Media Library</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search images…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading && (
                <p className="text-center text-sm text-gray-400 py-10">Loading…</p>
              )}
              {!loading && images.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-10">
                  No images yet.{" "}
                  <a href="/admin/media" target="_blank" className="text-blue-600 hover:underline">
                    Upload some in Media →
                  </a>
                </p>
              )}
              {!loading && images.length > 0 && filtered.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-10">No images match "{search}"</p>
              )}
              {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filtered.map((img) => (
                    <button
                      key={img.filename}
                      type="button"
                      onClick={() => select(img.url)}
                      title={img.filename}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 bg-gray-50 focus:outline-none transition-all hover:border-blue-400 ${
                        val === img.url ? "border-blue-500 ring-2 ring-blue-300" : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.thumbUrl ?? img.url}
                        alt={img.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{img.filename}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href="/admin/media"
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                Manage media →
              </a>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-1.5 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
