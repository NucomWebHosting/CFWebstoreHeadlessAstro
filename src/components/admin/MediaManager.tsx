import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageItem {
  filename: string;
  url: string;
  thumbUrl: string | null;
  size: number;
  width: number | null;
  height: number | null;
  created: string;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function MediaManager() {
  const [images, setImages]       = useState<ImageItem[]>([]);
  const [selected, setSelected]   = useState<ImageItem | null>(null);
  const [search, setSearch]       = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState<string[]>([]);
  const [copied, setCopied]       = useState(false);
  const [loading, setLoading]     = useState(true);

  async function loadImages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/images");
      const data = await res.json();
      setImages(data.images ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadImages(); }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setUploading(true);
    setProgress([`Uploading ${acceptedFiles.length} file${acceptedFiles.length > 1 ? "s" : ""}…`]);

    const formData = new FormData();
    acceptedFiles.forEach((file, i) => formData.append(`files[${i}]`, file));

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setProgress([`Uploaded ${data.data.files.length} file${data.data.files.length !== 1 ? "s" : ""}`]);
        await loadImages();
        setTimeout(() => setProgress([]), 3000);
      } else {
        setProgress(data.data?.messages ?? ["Upload failed"]);
      }
    } catch {
      setProgress(["Network error during upload"]);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg":   [".jpg", ".jpeg"],
      "image/png":    [".png"],
      "image/gif":    [".gif"],
      "image/webp":   [".webp"],
      "image/avif":   [".avif"],
      "image/svg+xml":[".svg"],
      "image/heic":   [".heic"],
      "image/heif":   [".heif"],
    },
    noClick: true,
    noKeyboard: true,
  });

  async function handleDelete(img: ImageItem) {
    if (!confirm(`Delete "${img.filename}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/images?filename=${encodeURIComponent(img.filename)}`, {
      method: "DELETE",
    });
    if (selected?.filename === img.filename) setSelected(null);
    await loadImages();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filtered = images.filter((img) =>
    img.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      {...getRootProps()}
      className={`relative min-h-[60vh] transition-colors rounded-xl ${
        isDragActive ? "bg-blue-50 ring-2 ring-blue-400" : ""
      }`}
    >
      <input {...getInputProps()} />

      {/* Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-blue-50/80 border-2 border-dashed border-blue-400 pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-blue-700 font-semibold">Drop images here</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={open}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload Images"}
        </button>
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-56 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <span className="text-sm text-gray-400 ml-auto">
          {filtered.length} image{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </span>
      </div>

      {/* Upload feedback */}
      {progress.length > 0 && (
        <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
          progress[0].startsWith("Uploaded") ? "bg-green-50 border border-green-200 text-green-700"
          : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {progress.join(" · ")}
        </div>
      )}

      {/* Empty upload prompt */}
      {!loading && images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl py-20 text-center text-gray-400">
          <div className="text-4xl mb-3">📁</div>
          <p className="font-medium">No images yet</p>
          <p className="text-sm mt-1">Click Upload or drag files here</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20 text-sm text-gray-400">Loading…</div>
      )}

      {/* Main layout: grid + detail panel */}
      {!loading && images.length > 0 && (
        <div className={`flex gap-5 ${selected ? "items-start" : ""}`}>

          {/* Grid */}
          <div className={`grid gap-3 flex-1 ${
            selected
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          }`}>
            {filtered.map((img) => (
              <button
                key={img.filename}
                onClick={() => setSelected(selected?.filename === img.filename ? null : img)}
                className={`group relative rounded-xl overflow-hidden border-2 bg-gray-50 aspect-square focus:outline-none transition-all ${
                  selected?.filename === img.filename
                    ? "border-blue-500 shadow-md"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={img.thumbUrl ?? img.url}
                  alt={img.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{img.filename}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4 sticky top-4">
              {/* Preview */}
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={selected.url}
                  alt={selected.filename}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Meta */}
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-800 break-all">{selected.filename}</p>
                {selected.width && selected.height && (
                  <p className="text-gray-500">{selected.width} × {selected.height}px</p>
                )}
                <p className="text-gray-500">{fmtSize(selected.size)}</p>
                <p className="text-gray-400 text-xs">{fmtDate(selected.created)}</p>
              </div>

              {/* URL */}
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">URL</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={selected.url}
                    className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-xs font-mono bg-gray-50"
                  />
                  <button
                    onClick={() => copyUrl(selected.url)}
                    className={`shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      copied
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-gray-100">
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 text-center px-3 py-1.5 rounded text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Open
                </a>
                <button
                  onClick={() => handleDelete(selected)}
                  className="flex-1 px-3 py-1.5 rounded text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full text-xs text-gray-400 hover:text-gray-600 pt-1"
              >
                Deselect
              </button>
            </div>
          )}
        </div>
      )}

      {/* No search results */}
      {!loading && images.length > 0 && filtered.length === 0 && (
        <p className="text-sm text-gray-400 py-10 text-center">
          No images match &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Drop hint */}
      {!isDragActive && (
        <div className="text-center mt-6 space-y-1">
          <p className="text-xs text-gray-400">
            You can also drag &amp; drop images anywhere on this page
          </p>
          <p className="text-xs text-gray-300">
            Accepted: JPG, PNG, GIF, WebP, AVIF, SVG, HEIC &mdash; max 10 MB &middot; HEIC files are converted to WebP automatically
          </p>
        </div>
      )}
    </div>
  );
}
