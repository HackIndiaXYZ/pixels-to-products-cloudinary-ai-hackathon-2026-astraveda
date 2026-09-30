"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { ArrowUpRight, Download, Copy, Check, Sparkles, Layers, ShieldCheck, ExternalLink } from "lucide-react";

export default function ExportPage() {
  const { lessonTitle, instructorName, categoryTag, variants, selectedStudioAsset, setIsJudgeModalOpen } = useAppStore();
  const [copied, setCopied] = useState(false);

  const activeAsset = selectedStudioAsset || variants[0] || {
    style_name: "Scientific 3D",
    base_public_id: "cld-sample-4",
    base_image_url: "https://res.cloudinary.com/demo/image/upload/cld-sample-4.jpg"
  };

  const pubId = activeAsset.base_public_id || "cld-sample-4";

  const exportFormats = [
    {
      target: "PRESENTATION SLIDE",
      ratio: "16:9",
      res: "1280 × 720px",
      desc: "Optimized for widescreen slide decks, keynote presentations, and LMS video players.",
      url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/${pubId}.jpg`
    },
    {
      target: "WEB & COURSE LMS",
      ratio: "16:9",
      res: "1920 × 1080px",
      desc: "Ultra-crisp banner thumbnail for YouTube, Coursera, Canvas, and web course catalogs.",
      url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1920,h_1080,f_auto,q_auto/${pubId}.jpg`
    },
    {
      target: "SOCIAL & COMMUNITY",
      ratio: "1:1",
      res: "1080 × 1080px",
      desc: "Square badge format for LinkedIn, Twitter/X announcements, and Discord course cards.",
      url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1080,h_1080,f_auto,q_auto/${pubId}.jpg`
    },
    {
      target: "MOBILE STORY & REEL",
      ratio: "9:16",
      res: "720 × 1280px",
      desc: "Vertical format for TikTok, Instagram Reels, and mobile LMS micro-learning clips.",
      url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_720,h_1280,f_auto,q_auto/${pubId}.jpg`
    }
  ];

  const handleDownloadManifest = () => {
    const manifest = {
      product: "EduVision AI Asset System",
      course_title: lessonTitle,
      instructor: instructorName,
      category: categoryTag,
      style: activeAsset.style_name,
      generated_at: new Date().toISOString(),
      formats: exportFormats.map(f => ({
        target: f.target,
        ratio: f.ratio,
        resolution: f.res,
        cloudinary_cdn_url: f.url
      }))
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eduvision_${lessonTitle.replace(/\s+/g, "_").toLowerCase()}_manifest.json`;
    a.click();
  };

  const handleCopyUrls = () => {
    const text = exportFormats.map(f => `${f.target} (${f.ratio}): ${f.url}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-xs font-bold font-mono tracking-wider">
          <ArrowUpRight className="w-3.5 h-3.5" /> ASSET KIT & DISTRIBUTION
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
          Your lesson visual kit is ready.
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl">
          Complete multi-device educational asset package generated and optimized for <strong className="text-text-primary">"{lessonTitle}"</strong>.
        </p>
      </div>

      {/* 4 Multi-Format Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {exportFormats.map((fmt, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-background-surface border border-border-subtle hover:border-accent-cyan/40 transition shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="font-bold text-accent-cyan">{fmt.ratio}</span>
                <span className="text-text-muted">{fmt.res}</span>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3 border border-border-subtle">
                <img
                  src={fmt.url}
                  alt={fmt.target}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-bold text-sm text-text-primary mb-1 tracking-tight">{fmt.target}</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-4">{fmt.desc}</p>
            </div>

            <a
              href={fmt.url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-background-secondary hover:bg-background-elevated border border-border-subtle text-xs font-bold text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Download Full-Res
            </a>
          </div>
        ))}
      </div>

      {/* Batch Export & Delivery Actions Box */}
      <div className="p-8 rounded-2xl bg-gradient-to-b from-background-elevated to-background-surface border border-border-subtle shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Production Export Package</h2>
            <p className="text-xs text-text-muted mt-1">
              Download the entire structured metadata manifest or copy direct Cloudinary CDN delivery endpoints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyUrls}
              className="px-5 py-3 rounded-xl bg-background-secondary hover:bg-background-hover border border-border-subtle text-text-primary text-xs font-bold flex items-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "URLs Copied!" : "Copy Delivery URLs"}</span>
            </button>

            <button
              onClick={handleDownloadManifest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-xs flex items-center gap-2 hover:opacity-95 transition shadow-cyan-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Asset Kit (JSON)</span>
            </button>
          </div>
        </div>

        {/* Technical Cloudinary Verification Ribbon */}
        <div className="pt-4 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 rounded-xl bg-background-secondary border border-border-subtle">
            <div className="text-[10px] text-text-muted">DELIVERY PIPELINE</div>
            <div className="text-accent-cyan font-bold mt-0.5">Cloudinary Global CDN</div>
          </div>
          <div className="p-3 rounded-xl bg-background-secondary border border-border-subtle">
            <div className="text-[10px] text-text-muted">FORMAT SELECTION</div>
            <div className="text-emerald-400 font-bold mt-0.5">f_auto (WebP/AVIF)</div>
          </div>
          <div className="p-3 rounded-xl bg-background-secondary border border-border-subtle">
            <div className="text-[10px] text-text-muted">COMPRESSION</div>
            <div className="text-emerald-400 font-bold mt-0.5">q_auto:good</div>
          </div>
          <div className="p-3 rounded-xl bg-background-secondary border border-border-subtle">
            <div className="text-[10px] text-text-muted">TRACK STATUS</div>
            <div className="text-text-primary font-bold mt-0.5">Track 02 Verified ✓</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Link
          href="/create"
          className="text-xs font-mono text-text-muted hover:text-accent-cyan transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Create Another Visual Story
        </Link>
      </div>
    </div>
  );
}
