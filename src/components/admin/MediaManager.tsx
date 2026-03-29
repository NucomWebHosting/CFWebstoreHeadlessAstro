import { useState, useEffect, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { IconFolder, IconPlay, IconFile } from "./MediaIcons";

type MediaType = "image" | "video" | "doc";

interface MediaFile {
  filename: string;
  url: string;
  thumbUrl: string | null;
  size: number;
  mediaType: MediaType;
  width: number | null;
  height: number | null;
  created: string;
}

interface MediaFolder {
  name: string;
  path: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

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

function fileExt(filename: string): string {
  return (filename.split(".").pop() ?? "").toUpperCase();
}

function docColors(ext: string): string {
  const e = ext.toLowerCase();
  if (e === "pdf")                    return "bg-red-100 text-red-600";
  if (["xlsx","xls","csv"].includes(e)) return "bg-green-100 text-green-600";
  if (["docx","doc"].includes(e))     return "bg-blue-100 text-blue-600";
  return "bg-gray-100 text-gray-600";
}

// ── Main component ─────────────────────────────────────────────────────────
interface MediaManagerProps {
  pickerMode?: boolean;
  fieldname?: string;
}
export default function MediaManager({ pickerMode = false, fieldname = "" }: MediaManagerProps) {
  const [currentFolder, setCurrentFolder] = useState("");
  const [files, setFiles]                 = useState<MediaFile[]>([]);
  const [subfolders, setSubfolders]       = useState<MediaFolder[]>([]);
  const [selected, setSelected]           = useState<MediaFile | null>(null);
  const [search, setSearch]               = useState("");
  const [uploading, setUploading]         = useState(false);
  const [progress, setProgress]           = useState<{ msg: string; ok: boolean } | null>(null);
  const [loading, setLoading]             = useState(true);
  const [copied, setCopied]               = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  async function loadMedia(folder: string) {
    setLoading(true);
    try {
      const qs  = folder ? `?folder=${encodeURIComponent(folder)}` : "";
      const res = await fetch(`/api/admin/images${qs}`);
      const d   = await res.json();
      setFiles(d.files ?? []);
      setSubfolders(d.folders ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMedia(currentFolder); }, [currentFolder]);

  function navigateTo(path: string) {
    setCurrentFolder(path);
    setSelected(null);
    setSearch("");
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setUploading(true);
    setProgress({ msg: `Uploading ${acceptedFiles.length} file${acceptedFiles.length !== 1 ? "s" : ""}…`, ok: true });

    const formData = new FormData();
    acceptedFiles.forEach((f, i) => formData.append(`files[${i}]`, f));
    if (currentFolder) formData.append("folder", currentFolder);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const d   = await res.json();
      if (d.success) {
        const n = d.data.files.length;
        const warn = d.data.messages?.length ? ` (${d.data.messages.length} error${d.data.messages.length !== 1 ? "s" : ""})` : "";
        setProgress({ msg: `Uploaded ${n} file${n !== 1 ? "s" : ""}${warn}`, ok: true });
        await loadMedia(currentFolder);
        setTimeout(() => setProgress(null), 4000);
      } else {
        setProgress({ msg: (d.data?.messages ?? ["Upload failed"]).join(" · "), ok: false });
      }
    } catch {
      setProgress({ msg: "Network error during upload", ok: false });
    } finally {
      setUploading(false);
    }
  }, [currentFolder]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg":    [".jpg", ".jpeg"],
      "image/png":     [".png"],
      "image/gif":     [".gif"],
      "image/webp":    [".webp"],
      "image/avif":    [".avif"],
      "image/svg+xml": [".svg"],
      "image/heic":    [".heic"],
      "image/heif":    [".heif"],
      "video/mp4":               [".mp4"],
      "video/webm":              [".webm"],
      "video/quicktime":         [".mov"],
      "video/x-msvideo":         [".avi"],
      "application/pdf":         [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel":                [".xls"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword":      [".doc"],
      "text/plain":              [".txt"],
      "text/csv":                [".csv"],
    },
    noClick: true,
    noKeyboard: true,
  });

  async function handleDelete(file: MediaFile) {
    if (!confirm(`Delete "${file.filename}"? This cannot be undone.`)) return;
    const params = new URLSearchParams({ filename: file.filename });
    if (currentFolder) params.set("folder", currentFolder);
    await fetch(`/api/admin/images?${params}`, { method: "DELETE" });
    if (selected?.filename === file.filename) setSelected(null);
    await loadMedia(currentFolder);
  }

  async function handleCreateFolder() {
    const name = newFolderName.trim().replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (!name) return;
    const path = currentFolder ? `${currentFolder}/${name}` : name;
    const res  = await fetch("/api/admin/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: path }),
    });
    if (res.ok) {
      setShowNewFolder(false);
      setNewFolderName("");
      await loadMedia(currentFolder);
    } else {
      const d = await res.json();
      setProgress({ msg: d.error ?? "Failed to create folder", ok: false });
    }
  }

  async function handleDeleteFolder(folderPath: string, folderName: string) {
    if (!confirm(`Delete folder "${folderName}"? It must be empty.`)) return;
    const res = await fetch(`/api/admin/folders?folder=${encodeURIComponent(folderPath)}`, { method: "DELETE" });
    if (res.ok) {
      await loadMedia(currentFolder);
    } else {
      const d = await res.json();
      setProgress({ msg: d.error ?? "Failed to delete folder", ok: false });
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Breadcrumbs
  const crumbs = useMemo(
    () => currentFolder
      ? currentFolder.split("/").map((part, i, arr) => ({
          label: part,
          path:  arr.slice(0, i + 1).join("/"),
        }))
      : [],
    [currentFolder]
  );

  const lc              = search.toLowerCase();
  const filteredFolders = useMemo(
    () => subfolders.filter(f => !search || f.name.toLowerCase().includes(lc)),
    [subfolders, search, lc]
  );
  const filteredFiles = useMemo(
    () => files.filter(f => !search || f.filename.toLowerCase().includes(lc)),
    [files, search, lc]
  );
  const hasContent = filteredFolders.length > 0 || filteredFiles.length > 0;
  const isEmpty    = useMemo(() => !loading && subfolders.length === 0 && files.length === 0, [loading, subfolders, files]);
  const noResults  = useMemo(() => !loading && !isEmpty && !hasContent && !!search, [loading, isEmpty, hasContent, search]);

  const gridCols = selected
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

  return (
    <div
      {...getRootProps()}
      className={`relative min-h-[60vh] transition-colors rounded-xl ${isDragActive ? "bg-blue-50 ring-2 ring-blue-400" : ""}`}
    >
      <input {...getInputProps()} />

      {/* Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-blue-50/80 border-2 border-dashed border-blue-400 pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-blue-700 font-semibold">Drop files here</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button
          onClick={open}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload Files"}
        </button>
        <button
          onClick={() => { setShowNewFolder(v => !v); setNewFolderName(""); }}
          className="px-4 py-2 rounded text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          New Folder
        </button>
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-52 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <span className="text-sm text-gray-400 ml-auto">
          {filteredFolders.length + filteredFiles.length} item{filteredFolders.length + filteredFiles.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </span>
      </div>

      {/* Breadcrumbs */}
      {crumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm mb-4 flex-wrap">
          <button onClick={() => navigateTo("")} className="text-blue-600 hover:underline">Root</button>
          {crumbs.map((c, i) => (
            <span key={c.path} className="flex items-center gap-1">
              <span className="text-gray-400">/</span>
              {i === crumbs.length - 1 ? (
                <span className="text-gray-700 font-medium">{c.label}</span>
              ) : (
                <button onClick={() => navigateTo(c.path)} className="text-blue-600 hover:underline">{c.label}</button>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* New folder inline form */}
      {showNewFolder && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleCreateFolder();
              if (e.key === "Escape") setShowNewFolder(false);
            }}
            placeholder="Folder name"
            autoFocus
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={handleCreateFolder}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={() => setShowNewFolder(false)}
            className="px-3 py-1.5 rounded text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Progress / error */}
      {progress && (
        <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
          progress.ok
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {progress.msg}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl py-20 text-center text-gray-400">
          <div className="text-4xl mb-3">📁</div>
          <p className="font-medium">Empty {currentFolder ? "folder" : "media library"}</p>
          <p className="text-sm mt-1">Click Upload or drag files here</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20 text-sm text-gray-400">Loading…</div>
      )}

      {/* No search results */}
      {noResults && (
        <p className="text-sm text-gray-400 py-10 text-center">
          No files match &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Grid + detail panel */}
      {!loading && hasContent && (
        <div className={`flex gap-5 ${selected ? "items-start" : ""}`}>

          {/* Grid */}
          <div className={`grid gap-3 flex-1 ${gridCols}`}>

            {/* Folder cards */}
            {filteredFolders.map(folder => (
              <div key={folder.path} className="group relative">
                <button
                  onClick={() => navigateTo(folder.path)}
                  className="w-full aspect-square rounded-xl border-2 border-transparent hover:border-yellow-400 bg-yellow-50 hover:bg-yellow-100 flex flex-col items-center justify-center gap-2 transition-all focus:outline-none"
                >
                  <IconFolder className="w-10 h-10 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-700 px-2 truncate w-full text-center leading-tight">
                    {folder.name}
                  </span>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDeleteFolder(folder.path, folder.name); }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded bg-white/90 border border-gray-200 text-red-400 hover:text-red-600 text-xs transition-opacity leading-none"
                  title="Delete folder (must be empty)"
                >
                  ×
                </button>
              </div>
            ))}

            {/* File cards */}
            {filteredFiles.map(file => (
              <button
                key={file.filename}
                onClick={() => setSelected(selected?.filename === file.filename ? null : file)}
                className={`group relative rounded-xl overflow-hidden border-2 bg-gray-50 aspect-square focus:outline-none transition-all ${
                  selected?.filename === file.filename
                    ? "border-blue-500 shadow-md"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                {file.mediaType === "image" ? (
                  <img
                    src={file.thumbUrl ?? file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : file.mediaType === "video" ? (
                  <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center gap-1.5">
                    <IconPlay className="w-10 h-10 text-white/70" />
                    <span className="text-xs text-gray-400 font-medium tracking-wide">
                      {fileExt(file.filename)}
                    </span>
                  </div>
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center gap-1.5 ${docColors(fileExt(file.filename))}`}>
                    <IconFile className="w-8 h-8 opacity-50" />
                    <span className="text-sm font-bold">{fileExt(file.filename)}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{file.filename}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4 sticky top-4">

              {/* Preview */}
              <div className="rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {selected.mediaType === "image" ? (
                  <img
                    src={selected.url}
                    alt={selected.filename}
                    className="max-w-full max-h-48 object-contain"
                  />
                ) : selected.mediaType === "video" ? (
                  <video src={selected.url} controls className="w-full max-h-48" />
                ) : (
                  <div className={`w-full py-10 flex flex-col items-center justify-center gap-2 ${docColors(fileExt(selected.filename))}`}>
                    <IconFile className="w-12 h-12 opacity-50" />
                    <span className="text-2xl font-bold">{fileExt(selected.filename)}</span>
                  </div>
                )}
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
                      copied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              {pickerMode ? (
                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && window.opener?.setImageField) {
                      window.opener.setImageField(fieldname, window.location.origin + selected.url);
                    }
                    window.close();
                  }}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-blue-700"
                >
                  Use This Image
                </button>
              ) : (
                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 text-center px-3 py-1.5 rounded text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    {selected.mediaType === "doc" ? "Download" : "Open"}
                  </a>
                  <button
                    onClick={() => handleDelete(selected)}
                    className="flex-1 px-3 py-1.5 rounded text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}

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

      {/* Footer hints */}
      {!isDragActive && (
        <div className="text-center mt-6 space-y-1">
          <p className="text-xs text-gray-400">
            Drag &amp; drop files anywhere on this page to upload to the current folder
          </p>
          <p className="text-xs text-gray-300">
            Images: JPG PNG GIF WebP AVIF SVG HEIC &nbsp;·&nbsp;
            Videos: MP4 WebM MOV AVI &nbsp;·&nbsp;
            Docs: PDF XLSX XLS DOCX DOC TXT CSV &nbsp;·&nbsp;
            20 MB max (videos 200 MB) &nbsp;·&nbsp; HEIC auto-converted to WebP
          </p>
        </div>
      )}
    </div>
  );
}
