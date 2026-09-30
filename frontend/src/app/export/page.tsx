"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ArrowUpRight, Download, FileJson, Check, ExternalLink, Sparkles, Copy, Layers } from "lucide-react";

export default function ExportPage() {
  const { lessonTitle, instructorName, categoryTag, variants, cloudName } = useAppStore();
  const [downloadedManifest, setDownloadedManifest] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);

  const manifestData = {
    course_title: lessonTitle,
    instructor: instructorName,
    category: categoryTag,
    generated_timestamp: new Date().toISOString(),
    cloudinary_cloud_name: cloudName,
    track: "Cloudinary AI Hackathon 2026 - Track 02",
    total_assets: 16,
    delivery_optimizations: {
      format: "f_auto",
      quality: "q_auto",
      responsive_gravity: "c_fill,g_auto"
    },
    export_formats: [
      {
        ratio: "16:9",
        target: "YouTube Thumbnails & LMS Banner",
        resolution: "1280x720",
        sample_url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/cld-sample-4.jpg`
      },
      {
        ratio: "4:3",
        target: "Keynote / PowerPoint Lecture Slides",
        resolution: "1024x768",
        sample_url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1024,h_768,f_auto,q_auto/cld-sample-5.jpg`
      },
      {
        ratio: "1:1",
        target: "Social Square Announcement Card",
        resolution: "1080x1080",
        sample_url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1080,h_1080,f_auto,q_auto/cld-sample-3.jpg`
      },
      {
        ratio: "9:16",
        target: "Mobile Story / TikTok / Short snippet",
        resolution: "720x1280",
        sample_url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_720,h_1280,f_auto,q_auto/cld-sample-2.jpg`
      }
    ]
  };

  const handleDownloadManifest = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifestData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eduvision-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadedManifest(true);
    setTimeout(() => setDownloadedManifest(false), 2500);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(manifestData, null, 2));
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cyan uppercase tracking-wider mb-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> SCREEN 06 · EXPORT &amp; DISTRIBUTION
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Export Educational Asset Kit
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Production-ready CDN package with JSON metadata for LMS, YouTube, and Slide decks.
          </p>
        </div>

        <button
          onClick={handleDownloadManifest}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-cyan-sm"
        >
          {downloadedManifest ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Manifest Downloaded!
            </span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download JSON Manifest</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Format Kit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {manifestData.export_formats.map((fmt, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-background-surface border border-border-subtle flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-accent-cyan/15 text-accent-cyan text-xs font-mono font-bold">
                  {fmt.ratio} · {fmt.resolution}
                </span>
                <span className="text-xs text-emerald-400 font-mono">f_auto, q_auto</span>
              </div>
              <h3 className="font-bold text-base text-text-primary mt-3">{fmt.target}</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Pre-scaled and cropped with Cloudinary smart gravity (<code>g_auto</code>) for zero content loss.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
              <span className="text-[11px] font-mono text-text-muted">Cloudinary CDN Ready</span>
              <a
                href={fmt.sample_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-cyan hover:underline flex items-center gap-1 font-mono font-bold"
              >
                <span>View Asset</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Manifest Preview Code Box */}
      <div className="p-6 rounded-2xl bg-background-surface border border-border-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-text-primary font-mono">
            <FileJson className="w-4 h-4 text-accent-cyan" /> LMS Integration Package Manifest
          </div>

          <button
            onClick={handleCopyManifest}
            className="px-3.5 py-1.5 rounded-lg bg-background-secondary border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-background-hover transition flex items-center gap-1.5"
          >
            {copiedManifest ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied JSON
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy JSON
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-background-secondary border border-border-subtle text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 leading-relaxed">
          {JSON.stringify(manifestData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
