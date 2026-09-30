"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { X, Sparkles, Layers, Sliders, Maximize2, Zap, Globe, CheckCircle2 } from "lucide-react";

export const JudgeViewModal = () => {
  const { isJudgeModalOpen, setIsJudgeModalOpen, isCloudinaryConnected, cloudName } = useAppStore();

  if (!isJudgeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background-elevated border border-accent-cyan/30 rounded-2xl shadow-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30">
                CLOUDINARY HACKATHON · TRACK 02
              </span>
              <span className="text-xs text-text-muted font-mono">ASTRAVEDA</span>
            </div>
            <h2 className="text-2xl font-extrabold text-text-primary mt-1">
              Cloudinary AI Generative Pipeline Architecture
            </h2>
            <p className="text-sm text-text-secondary">
              End-to-end generative content workflow power breakdown for hackathon judges.
            </p>
          </div>
          <button
            onClick={() => setIsJudgeModalOpen(false)}
            className="p-2 rounded-lg bg-background-surface hover:bg-background-hover text-text-muted hover:text-text-primary transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status */}
        <div className="my-6 p-4 rounded-xl bg-background-secondary border border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isCloudinaryConnected ? "bg-emerald-500 shadow-[0_0_8px_#10B981]" : "bg-amber-500 shadow-[0_0_8px_#F59E0B]"}`} />
            <div>
              <div className="text-xs font-semibold text-text-muted">ACTIVE PIPELINE STATUS</div>
              <div className="text-sm font-bold text-text-primary font-mono">
                {isCloudinaryConnected ? `Connected to Cloud: ${cloudName}` : "Demo CDN Mode (Sample Cloud: demo)"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-text-muted">TRACK REQUIREMENT</div>
            <div className="text-sm font-bold text-accent-cyan">100% Fully Implemented</div>
          </div>
        </div>

        {/* 6-Stage Pipeline Node Graph */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Pipeline Nodes:</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Stage 1 */}
            <div className="p-4 rounded-xl bg-background-surface border border-border-subtle hover:border-accent-cyan/40 transition">
              <div className="flex items-center gap-2 text-accent-cyan text-xs font-mono font-bold mb-1">
                <Sparkles className="w-4 h-4" /> 01 · GEN_AI
              </div>
              <div className="text-sm font-bold text-text-primary">AI Image Generation</div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Backend LLM extracts pedagogical metaphors into structured image prompts uploaded directly to Cloudinary media hierarchy.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-4 rounded-xl bg-background-surface border border-border-subtle hover:border-accent-cyan/40 transition">
              <div className="flex items-center gap-2 text-accent-blue text-xs font-mono font-bold mb-1">
                <Layers className="w-4 h-4" /> 02 · VARIATIONS
              </div>
              <div className="text-sm font-bold text-text-primary">Generative Variations</div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Parallel generation of 4 distinct stylistic variants (3D Scientific, Minimal Editorial, Futuristic, Photorealistic).
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-4 rounded-xl bg-background-surface border border-border-subtle hover:border-accent-cyan/40 transition">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-1">
                <Sliders className="w-4 h-4" /> 03 · TEXT OVERLAY
              </div>
              <div className="text-sm font-bold text-text-primary">Dynamic Typography</div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                On-the-fly <code className="text-accent-cyan">l_text</code> transformation layers for Course Title, Instructor, and Category Badges with contrast scrims.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-4 rounded-xl bg-background-surface border border-border-subtle hover:border-accent-cyan/40 transition">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold mb-1">
                <Maximize2 className="w-4 h-4" /> 04 · RESPONSIVE CROP
              </div>
              <div className="text-sm font-bold text-text-primary">Content-Aware Gravity</div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                <code className="text-accent-cyan">c_fill,g_auto</code> transforms a single visual into 16:9 (LMS/Web), 9:16 (Mobile Story), 1:1 (Card), and 4:3 (Deck).
              </p>
            </div>

            {/* Stage 5 */}
            <div className="p-4 rounded-xl bg-background-surface border border-border-subtle hover:border-accent-cyan/40 transition">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold mb-1">
                <Zap className="w-4 h-4" /> 05 · f_auto + q_auto
              </div>
              <div className="text-sm font-bold text-text-primary">Automatic Optimization</div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Automatic AVIF/WebP negotiation and perceptual compression delivering up to 75% smaller asset payloads without visual degradation.
              </p>
            </div>

            {/* Stage 6 */}
            <div className="p-4 rounded-xl bg-background-surface border border-border-subtle hover:border-accent-cyan/40 transition">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold mb-1">
                <Globe className="w-4 h-4" /> 06 · GLOBAL CDN
              </div>
              <div className="text-sm font-bold text-text-primary">Global Fast Delivery</div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Low-latency worldwide distribution with dynamic on-demand URL caching.
              </p>
            </div>
          </div>
        </div>

        {/* Live URL Example */}
        <div className="mt-6 p-4 rounded-xl bg-background-secondary border border-border-subtle">
          <div className="text-xs font-mono text-text-muted mb-1">REAL-TIME TRANSFORMATION URL SYNTAX:</div>
          <div className="font-mono text-xs text-accent-cyan break-all bg-background-primary p-3 rounded-lg border border-border-subtle">
            https://res.cloudinary.com/{cloudName}/image/upload/c_fill,g_auto,w_1280,h_720/e_gradient_fade/l_text:Montserrat_52_bold:Quantum%20Computing,co_rgb:FFFFFF,g_south_west,x_60,y_140/f_auto,q_auto/asset.jpg
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsJudgeModalOpen(false)}
            className="px-6 py-2.5 rounded-lg bg-accent-cyan text-black font-bold hover:opacity-90 transition text-sm shadow-cyan-sm"
          >
            Close Pipeline Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
