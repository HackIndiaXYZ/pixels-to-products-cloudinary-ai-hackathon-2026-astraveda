"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Folders, Sparkles, ExternalLink, Download, ArrowRight, Layers } from "lucide-react";

export default function AssetLibraryPage() {
  const { savedLibrary, lessonTitle, variants } = useAppStore();
  const [filter, setFilter] = useState("All");

  // Fallback initial visual library items if empty
  const libraryItems = savedLibrary.length > 0 ? savedLibrary : [
    {
      title: lessonTitle || "Quantum Computing & Superposition",
      instructor: "Dr. Elena Vance",
      style: "Scientific 3D",
      format: "16:9",
      url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/cld-sample-4.jpg",
      date: "Generated 10m ago"
    },
    {
      title: lessonTitle || "Quantum Computing & Superposition",
      instructor: "Dr. Elena Vance",
      style: "Editorial",
      format: "1:1",
      url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1080,h_1080,f_auto,q_auto/cld-sample-5.jpg",
      date: "Generated 10m ago"
    },
    {
      title: lessonTitle || "Quantum Computing & Superposition",
      instructor: "Dr. Elena Vance",
      style: "Futuristic",
      format: "9:16",
      url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_720,h_1280,f_auto,q_auto/cld-sample-3.jpg",
      date: "Generated 10m ago"
    },
    {
      title: "Lost Civilizations: Ancient Alexandria",
      instructor: "Prof. Arthur Pendelton",
      style: "Photorealistic",
      format: "4:3",
      url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1024,h_768,f_auto,q_auto/cld-sample-2.jpg",
      date: "Archived yesterday"
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-xs font-bold font-mono tracking-wider">
            <Folders className="w-3.5 h-3.5" /> REPOSITORY & ARCHIVE
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mt-1">
            Your Visual Assets
          </h1>
          <p className="text-sm text-text-secondary">
            Catalog of generated educational visuals, scene variants, and multi-format exports.
          </p>
        </div>

        <Link
          href="/create"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-xs flex items-center gap-2 hover:opacity-95 transition shadow-cyan-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Visual Story</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3 font-mono text-xs">
        {["All", "Stories", "Scenes", "Exports", "Favorites"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filter === tab
                ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30"
                : "text-text-muted hover:text-text-primary hover:bg-background-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {libraryItems.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-background-surface border border-border-subtle hover:border-accent-cyan/30 transition shadow-card flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3 border border-border-subtle">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-accent-cyan border border-white/10 backdrop-blur-md">
                  {item.format}
                </span>
              </div>

              <h3 className="font-bold text-sm text-text-primary mb-1 line-clamp-1">{item.title}</h3>
              <p className="text-xs text-text-muted">{item.style} · {item.instructor}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-muted">
              <span>{item.date}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-accent-cyan hover:underline flex items-center gap-1"
              >
                <span>CDN</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
