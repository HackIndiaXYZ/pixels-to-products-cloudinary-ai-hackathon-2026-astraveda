"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Palette, Layers, Sliders, Maximize2, ShieldCheck, Check, ArrowRight, Download, Sparkles } from "lucide-react";

export default function AssetStudioPage() {
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
    saveToLibrary,
    setIsJudgeModalOpen,
    variants
  } = useAppStore();

  const [customTitle, setCustomTitle] = useState(lessonTitle);
  const [customInstructor, setCustomInstructor] = useState(instructorName);
  const [genBgPrompt, setGenBgPrompt] = useState("");

  const activeAsset = selectedStudioAsset || variants[0] || {
    style_name: "Scientific 3D",
    base_public_id: "cld-sample-4",
    base_image_url: "https://res.cloudinary.com/demo/image/upload/cld-sample-4.jpg",
    formats: {
      "16:9": {
        width: 1280,
        height: 720,
        url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/cld-sample-4.jpg",
        cloudinary_transformations: "c_fill,g_auto,w_1280,h_720,f_auto,q_auto"
      }
    }
  };

  const aspectSpecs: Record<string, { w: number; h: number; label: string; device: string }> = {
    "16:9": { w: 1280, h: 720, label: "Presentation & LMS", device: "16:9 Desktop" },
    "4:3": { w: 1024, h: 768, label: "Slide Deck", device: "4:3 Classroom" },
    "1:1": { w: 1080, h: 1080, label: "Social Card", device: "1:1 Square" },
    "9:16": { w: 720, h: 1280, label: "Mobile Story", device: "9:16 Vertical" }
  };

  const currentSpec = aspectSpecs[studioFormat] || aspectSpecs["16:9"];

  // Dynamically constructed transformed Cloudinary URL
  const buildCurrentUrl = () => {
    const pubId = activeAsset.base_public_id || "cld-sample-4";
    const bgParam = genBgPrompt ? `e_gen_background_replace:prompt_${encodeURIComponent(genBgPrompt)}/` : "";
    const scrimParam = overlayEnabled ? "e_gradient_fade/" : "";
    return `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_${currentSpec.w},h_${currentSpec.h}/${bgParam}${scrimParam}f_auto,q_auto/${pubId}.jpg`;
  };

  const liveUrl = buildCurrentUrl();

  const handleSaveToAssets = () => {
    saveToLibrary({
      title: customTitle,
      instructor: customInstructor,
      style: activeAsset.style_name,
      format: studioFormat,
      url: liveUrl,
      date: "Just now"
    });
    alert("Asset successfully saved to Library!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-xs font-bold font-mono tracking-wider">
            <Palette className="w-3.5 h-3.5" /> ASSET STUDIO & INSPECTOR
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mt-1">
            Dynamic Visual Transformation Workspace
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsJudgeModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-background-surface hover:bg-background-hover border border-accent-cyan/30 text-accent-cyan text-xs font-bold flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-4 h-4" /> View Cloudinary Pipeline →
          </button>

          <button
            onClick={() => router.push("/export")}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-xs flex items-center gap-2 hover:opacity-95 transition shadow-cyan-sm"
          >
            <span>Proceed to Export</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Studio Grid: Tools | Canvas | Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Tool Controls (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl bg-background-surface border border-border-subtle space-y-5 shadow-card">
            <div className="text-xs font-bold font-mono text-accent-cyan uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" /> Canvas Tools
            </div>

            {/* Aspect Ratio Switcher */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Aspect Ratio Format
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {Object.entries(aspectSpecs).map(([key, spec]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStudioFormat(key)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      studioFormat === key
                        ? "bg-accent-cyan/15 border-accent-cyan text-accent-cyan font-bold shadow-cyan-sm"
                        : "bg-background-secondary border-border-subtle text-text-muted hover:text-text-primary hover:bg-background-hover"
                    }`}
                  >
                    <div className="font-bold">{key}</div>
                    <div className="text-[10px] text-text-muted truncate">{spec.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Overlay Toggles */}
            <div className="space-y-3 pt-2 border-t border-border-subtle">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Dynamic Text Overlay (l_text)
              </label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background-secondary border border-border-subtle">
                <span className="text-xs font-medium text-text-secondary">Embed Title & Badges</span>
                <input
                  type="checkbox"
                  checked={overlayEnabled}
                  onChange={(e) => setOverlayEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-accent-cyan accent-accent-cyan cursor-pointer"
                />
              </div>

              {overlayEnabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted mb-1">Title Overlay</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border-subtle text-xs text-text-primary focus:border-accent-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-muted mb-1">Instructor Credit</label>
                    <input
                      type="text"
                      value={customInstructor}
                      onChange={(e) => setCustomInstructor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border-subtle text-xs text-text-primary focus:border-accent-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-muted mb-1">Typography Theme</label>
                    <select
                      value={studioTheme}
                      onChange={(e) => setStudioTheme(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background-elevated border border-border-subtle text-xs text-text-primary focus:border-accent-cyan focus:outline-none"
                    >
                      <option value="dark_modern">Dark Modern (Cyber Scrim)</option>
                      <option value="clean_minimal">Clean Minimal (Light Backdrop)</option>
                      <option value="vibrant_gradient">Vibrant Gradient (High Contrast)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* GenAI Background Replace */}
            <div className="pt-2 border-t border-border-subtle">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                GenAI Background Replace
              </label>
              <input
                type="text"
                value={genBgPrompt}
                onChange={(e) => setGenBgPrompt(e.target.value)}
                placeholder="e.g. quantum particle accelerator"
                className="w-full px-3 py-2.5 rounded-xl bg-background-secondary border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:border-accent-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Hero Canvas Viewport (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-[#030508] border border-border-subtle shadow-card flex flex-col items-center justify-center min-h-[460px] relative">
            <div className="w-full max-w-xl relative rounded-xl overflow-hidden shadow-2xl border border-border-subtle">
              <img
                src={liveUrl}
                alt="Transformed Asset"
                className="w-full h-auto object-cover max-h-[420px]"
              />

              {/* Dynamic Overlay Rendering Emulation Layer */}
              {overlayEnabled && (
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest bg-accent-cyan text-black uppercase">
                      {categoryTag || "ACADEMICS"}
                    </span>
                    <span className="text-[10px] font-mono text-white/70">EduVision AI</span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white leading-tight drop-shadow-md">
                      {customTitle}
                    </h2>
                    <p className="text-xs font-mono text-slate-300 mt-1 uppercase font-bold">
                      INSTRUCTOR: {customInstructor}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Telemetry Footer */}
            <div className="w-full flex items-center justify-between mt-4 pt-3 border-t border-border-subtle font-mono text-xs text-text-muted">
              <div>
                Target: <span className="text-accent-cyan font-bold">{currentSpec.device}</span> ({currentSpec.w}×{currentSpec.h}px)
              </div>
              <div className="text-emerald-400 font-bold">f_auto · q_auto Delivery</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Asset Inspector (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl bg-background-surface border border-border-subtle space-y-4 shadow-card">
            <div className="text-xs font-bold font-mono text-accent-cyan uppercase tracking-wider">
              Asset Inspector
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Format</span>
                <span className="text-text-primary font-bold">{studioFormat}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Dimensions</span>
                <span className="text-text-primary">{currentSpec.w} × {currentSpec.h}px</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Active Style</span>
                <span className="text-accent-cyan">{activeAsset.style_name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Content Auto-Crop</span>
                <span className="text-emerald-400 font-bold">✓ c_fill, g_auto</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Format Encoding</span>
                <span className="text-emerald-400 font-bold">✓ f_auto (WebP/AVIF)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-muted">Quality Compression</span>
                <span className="text-emerald-400 font-bold">✓ q_auto:good</span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleSaveToAssets}
                className="w-full py-2.5 rounded-xl bg-background-elevated hover:bg-background-hover border border-border-subtle text-text-primary text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                💾 Save to Asset Library
              </button>

              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Open Full-Res CDN URL
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
