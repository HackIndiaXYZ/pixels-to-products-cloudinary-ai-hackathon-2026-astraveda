"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Palette, Layers, Sparkles, Check, Copy, Sliders, Smartphone, Monitor, Square, Tv, ArrowRight } from "lucide-react";

const FORMATS = [
  { id: "16:9", label: "YouTube / LMS", sub: "1280 × 720", icon: Monitor },
  { id: "4:3", label: "Slide Deck", sub: "1024 × 768", icon: Tv },
  { id: "1:1", label: "Social Card", sub: "1080 × 1080", icon: Square },
  { id: "9:16", label: "Mobile Story", sub: "720 × 1280", icon: Smartphone }
];

const THEMES = [
  { id: "dark_modern", name: "Dark Modern (Cyan)" },
  { id: "academic_clean", name: "Academic Minimalist" },
  { id: "cyber_neon", name: "Cyber Neon" },
  { id: "warm_editorial", name: "Warm Editorial" }
];

export default function StudioPage() {
  const router = useRouter();
  const {
    lessonTitle,
    instructorName,
    categoryTag,
    selectedStudioAsset,
    studioFormat,
    setStudioFormat,
    studioTheme,
    setStudioTheme,
    overlayEnabled,
    setOverlayEnabled,
    saveToLibrary
  } = useAppStore();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const basePublicId = selectedStudioAsset?.base_public_id || "cld-sample-4";
  const activeUrl = selectedStudioAsset?.formats?.[studioFormat]?.url ||
    `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/${basePublicId}.jpg`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveAsset = () => {
    saveToLibrary({
      id: `asset-${Date.now()}`,
      title: lessonTitle,
      instructor: instructorName,
      tag: categoryTag,
      format: studioFormat,
      url: activeUrl,
      public_id: basePublicId,
      date: new Date().toLocaleDateString()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cyan uppercase tracking-wider mb-1">
            <Palette className="w-3.5 h-3.5" /> SCREEN 04 · ASSET STUDIO
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Dynamic Branding &amp; Typography Studio
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time Cloudinary dynamic text overlay (<code>l_text</code>) &amp; smart gravity format switching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAsset}
            className="px-5 py-3 rounded-xl bg-background-surface hover:bg-background-hover border border-border-subtle text-xs font-bold transition flex items-center gap-2"
          >
            {isSaved ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Saved to Library
              </span>
            ) : (
              <span>Save to Library</span>
            )}
          </button>

          <button
            onClick={() => router.push("/export")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-xs flex items-center gap-1.5 hover:opacity-95 transition shadow-cyan-sm"
          >
            <span>Proceed to Export</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Center Preview Pane (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-background-surface border border-border-subtle space-y-4">
            
            {/* Visual Viewport */}
            <div className="w-full rounded-xl bg-black overflow-hidden flex items-center justify-center min-h-[380px] max-h-[500px] relative border border-white/5 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeUrl}
                alt="Active Asset Preview"
                className="max-h-[460px] w-auto max-w-full object-contain rounded-lg shadow-lg transition-all duration-300"
              />

              {/* Dynamic Overlay Mock Simulation if Enabled */}
              {overlayEnabled && (
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-accent-cyan/90 text-black text-[11px] font-black font-mono tracking-wider">
                      {categoryTag}
                    </span>
                    <span className="text-[10px] font-mono text-white/75 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {studioFormat} · f_auto,q_auto
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-white drop-shadow-md tracking-tight">
                      {lessonTitle}
                    </h2>
                    <p className="text-xs text-slate-300 font-mono">
                      INSTRUCTOR: {instructorName.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Meta Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] font-mono text-text-muted truncate max-w-sm">
                Cloudinary Public ID: <span className="text-text-primary">{basePublicId}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="text-xs text-accent-cyan hover:underline flex items-center gap-1 font-mono"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedUrl ? "Copied URL!" : "Copy Delivery URL"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Controls Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Aspect Ratio Switcher */}
          <div className="p-6 rounded-2xl bg-background-surface border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
                Target Aspect Ratio
              </h3>
              <span className="text-xs text-accent-cyan font-mono font-bold">c_fill, g_auto</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {FORMATS.map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = studioFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setStudioFormat(fmt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-cyan-sm"
                        : "bg-background-secondary border-border-subtle text-text-secondary hover:text-text-primary hover:bg-background-hover"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold leading-none">{fmt.id}</div>
                      <div className="text-[10px] text-text-muted mt-1 leading-none">{fmt.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Typography Controls */}
          <div className="p-6 rounded-2xl bg-background-surface border border-border-subtle space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
                Cloudinary Dynamic Typography
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={overlayEnabled}
                  onChange={(e) => setOverlayEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-background-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-cyan"></div>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 font-mono">
                  THEME COLORWAY
                </label>
                <select
                  value={studioTheme}
                  onChange={(e) => setStudioTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border-subtle text-text-primary text-xs focus:outline-none focus:border-accent-cyan"
                >
                  {THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cloudinary Transformation Formula Box */}
              <div className="p-3.5 rounded-xl bg-background-secondary border border-border-subtle space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-accent-cyan font-bold">
                  Active Cloudinary Transformation
                </div>
                <div className="text-[11px] font-mono text-text-secondary break-all leading-relaxed">
                  c_fill,g_auto,w_{studioFormat === "16:9" ? "1280,h_720" : studioFormat === "4:3" ? "1024,h_768" : studioFormat === "1:1" ? "1080,h_1080" : "720,h_1280"},f_auto,q_auto
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
