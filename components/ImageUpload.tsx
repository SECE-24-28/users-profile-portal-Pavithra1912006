"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  currentImage?: string | null;
  onUpload: (url: string) => void;
}

export default function ImageUpload({ currentImage, onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onUpload(json.url);
    } catch (err: unknown) {
      setError((err as Error).message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div className="upload-area" onClick={() => inputRef.current?.click()}>
        {preview ? (
          <img src={preview} alt="Preview" />
        ) : (
          <span style={{ fontSize: 28 }}>📷</span>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      <div className="upload-text">
        <button type="button" onClick={() => inputRef.current?.click()} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 12 }}>
          {uploading ? "Uploading..." : preview ? "Change photo" : "Upload photo"}
        </button>
      </div>
      {error && <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}
