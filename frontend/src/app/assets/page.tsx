"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Folders, Search, ExternalLink, Copy, Check, Download } from "lucide-react";

export default function AssetsPage() {
  const { savedLibrary, lessonTitle } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fallbackAssets = [
    {
      id: "demo-1",
      title: "Quantum Computing & Superposition",
      instructor: "Dr. Elena Vance",
      tag: "QUANTUM PHYSICS",
      format: "16:9",
      url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_800,h_450,f_auto,q_auto/cld-sample-4.jpg",
      public_id: "cld-sample-4",
      date: "2026-09-30"
    },
    {
      id: "demo-2",
      title: "Superposition Probability Field",
      instructor: "Dr. Elena Vance",
      tag: "QUANTUM PHYSICS",
      format: "4:3",
      url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_800,h_600,f_auto,q_auto/cld-sample-5.jpg",
      public_id: "cld-sample-5",
      date: "2026-09-30"
    },
    {
      id: "demo-3",
      title: "Cryogenic Entanglement Qubit",
      instructor: "Dr. Elena Vance",
      tag: "QUANTUM PHYSICS",
      format: "1:1",
      url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_800,h_800,f_auto,q_auto/cld-sample-3.jpg",
      public_id: "cld-sample-3",
      date: "2026-09-30"
    },
    {
      id: "demo-4",
      title: "Wavefunction Observable State",
      instructor: "Dr. Elena Vance",
      tag: "QUANTUM PHYSICS",
      format: "9:16",
      url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_450,h_800,f_auto,q_auto/cld-sample-2.jpg",
      public_id: "cld-sample-2",
      date: "2026-09-30"
    }
  ];

  const allAssets = savedLibrary.length > 0 ? [...savedLibrary, ...fallbackAssets] : fallbackAssets;

  const filtered = allAssets.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cyan uppercase tracking-wider mb-1">
            <Folders className="w-3.5 h-3.5" /> SCREEN 05 · ASSET REPOSITORY
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Generated Asset Library
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            All Cloudinary-optimized educational visuals, thumbnails, and multi-format banners.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background-surface border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan transition"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-background-surface border border-border-subtle overflow-hidden flex flex-col justify-between group hover:border-accent-cyan/40 transition shadow-card"
          >
            <div>
              <div className="aspect-video relative overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 text-accent-cyan border border-accent-cyan/30">
                  {item.format}
                </span>
              </div>

              <div className="p-4 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-accent-blue uppercase">
                  {item.tag}
                </div>
                <h3 className="font-bold text-sm text-text-primary line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-text-muted font-mono truncate">
                  ID: {item.public_id}
                </p>
              </div>
            </div>

            <div className="p-3 bg-background-secondary/50 border-t border-border-subtle flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-mono">{item.date}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(item.id, item.url)}
                  className="p-1.5 rounded-lg bg-background-surface hover:bg-background-hover text-text-muted hover:text-text-primary transition"
                  title="Copy CDN Link"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-background-surface hover:bg-background-hover text-text-muted hover:text-text-primary transition"
                  title="Open Full Res in CDN"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
