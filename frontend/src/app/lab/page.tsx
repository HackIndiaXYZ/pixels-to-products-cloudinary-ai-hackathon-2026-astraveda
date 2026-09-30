"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Compass, Sparkles, Check, ArrowRight, Layers, Zap, Eye, RefreshCw } from "lucide-react";

const STYLES = [
  {
    id: "3D Scientific",
    name: "Scientific 3D",
    desc: "Cinematic scientific visualization with raytraced lighting and volumetric textures.",
    tags: ["3D", "Technical", "Detailed"],
    icon: "⚛️"
  },
  {
    id: "Editorial",
    name: "Editorial Minimal",
    desc: "Clean academic visual storytelling with elegant vector silhouettes.",
    tags: ["Minimal", "Academic", "Modern"],
    icon: "📐"
  },
  {
    id: "Futuristic",
    name: "Futuristic Cyber",
    desc: "Immersive neon cyber technology aesthetic with holographic accents.",
    tags: ["AI", "Digital", "Cinematic"],
    icon: "🔮"
  },
  {
    id: "Photorealistic",
    name: "Photorealistic",
    desc: "Real-world visual storytelling with high-end editorial studio lighting.",
    tags: ["Photography", "Studio", "85mm"],
    icon: "📷"
  }
];

export default function VisualLabPage() {
  const router = useRouter();
  const {
    lessonTitle,
    conceptData,
    selectedStyle,
    setSelectedStyle,
    isGenerating,
    generationStep,
    generationStatusText,
    handleGeneratePipeline,
    setIsJudgeModalOpen
  } = useAppStore();

  const handleStartGeneration = async () => {
    await handleGeneratePipeline();
    router.push("/storyboard");
  };

  const conceptsList = [
    {
      num: "01",
      title: "QUANTUM SUPERPOSITION",
      metaphor: "A luminous probability field containing multiple simultaneous state vectors suspended in space."
    },
    {
      num: "02",
      title: "QUBIT CORE",
      metaphor: "A central quantum sphere surrounded by state vectors and orbital particle rings."
    },
    {
      num: "03",
      title: "ENTANGLED CIRCUITS",
      metaphor: "Interconnected quantum logic gates synapsing through cryogenic dilution matrix."
    },
    {
      num: "04",
      title: "MEASUREMENT COLLAPSE",
      metaphor: "Probability waves collapsing into a single discrete observable quantum eigenvalue."
    }
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-xs font-bold font-mono tracking-wider">
          <Compass className="w-3.5 h-3.5" /> AI VISUAL LAB
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
          Visual Direction & Metaphors
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl">
          EduVision analyzed <strong className="text-text-primary">"{lessonTitle}"</strong> and generated these visual opportunities for Cloudinary generation.
        </p>
      </div>

      {/* AI Analysis Metric Bar */}
      <div className="p-4 rounded-xl bg-background-surface border border-border-subtle flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ANALYSIS COMPLETE
        </div>
        <div className="flex items-center gap-6 text-text-muted">
          <div><strong className="text-accent-cyan">04</strong> VISUAL CONCEPTS</div>
          <div><strong className="text-accent-blue">04</strong> STYLE DIRECTIONS</div>
          <div><strong className="text-emerald-400">01</strong> RECOMMENDED COMPOSITION</div>
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span>Synthesized Visual Concepts</span>
          <span className="text-xs font-mono text-text-muted">(Sequential Story Motifs)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {conceptsList.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-background-surface border border-border-subtle hover:border-accent-cyan/30 transition shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-accent-cyan">{item.num}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-background-secondary text-text-muted border border-border-subtle">
                    Motif
                  </span>
                </div>
                <h3 className="font-bold text-sm text-text-primary mb-2 tracking-tight">{item.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{item.metaphor}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span>Cloudinary Prompt</span>
                <span className="text-accent-cyan">✓ Structured</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Style Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Choose your visual language</h2>
            <p className="text-xs text-text-muted">Select the artistic model direction for Cloudinary generation.</p>
          </div>

          {/* AI Recommendation Banner */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduVision Recommends: Scientific 3D</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STYLES.map((st) => {
            const isSelected = selectedStyle === st.id;
            return (
              <div
                key={st.id}
                onClick={() => setSelectedStyle(st.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-background-elevated border-accent-cyan shadow-cyan-glow scale-[1.02]"
                    : "bg-background-surface border-border-subtle hover:border-border-hover hover:bg-background-elevated"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{st.icon}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-accent-cyan text-black flex items-center justify-center text-xs font-bold shadow-cyan-sm">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-text-primary mb-1">{st.name}</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4 min-h-[36px]">{st.desc}</p>

                <div className="flex flex-wrap gap-1">
                  {st.tags.map((t, tidx) => (
                    <span
                      key={tidx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-secondary text-text-secondary border border-border-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generation Section / Animated Stepper */}
      <div className="p-8 rounded-2xl bg-gradient-to-b from-background-elevated to-background-surface border border-accent-cyan/20 shadow-card space-y-6">
        {isGenerating ? (
          /* Animated Generation Screen */
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/15 text-accent-cyan text-xs font-mono font-bold animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> EXECUTING CLOUDINARY AI WORKFLOW
            </div>

            <h3 className="text-2xl font-black text-text-primary">Generating your visual system...</h3>
            <p className="text-xs text-accent-cyan font-mono">{generationStatusText}</p>

            {/* Stepper Node Graph */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 max-w-3xl mx-auto pt-4 font-mono text-[11px]">
              {[
                "01 UNDERSTAND",
                "02 PROMPT",
                "03 CLOUDINARY AI",
                "04 VARIATIONS",
                "05 TRANSFORM",
                "06 OPTIMIZE"
              ].map((label, sidx) => {
                const isPassed = generationStep >= sidx + 1;
                return (
                  <div
                    key={sidx}
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      isPassed
                        ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan font-bold shadow-cyan-sm"
                        : "bg-background-secondary border-border-subtle text-text-muted"
                    }`}
                  >
                    <span>{isPassed ? "✓" : "○"}</span>
                    <span className="text-[10px] truncate">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* CTA Ready State */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-accent-cyan font-bold uppercase tracking-wider mb-1">
                <span>✦ READY FOR GENERATIVE PIPELINE</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary">Generate 4 Visual Variations</h3>
              <p className="text-xs text-text-muted max-w-md mt-0.5">
                Cloudinary AI will produce 4 distinct style directions, dynamic typography overlays, and responsive crop suites.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsJudgeModalOpen(true)}
                className="px-4 py-3.5 rounded-xl bg-background-surface hover:bg-background-hover border border-border-subtle text-text-secondary text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" /> Pipeline Inspector
              </button>

              <button
                type="button"
                onClick={handleStartGeneration}
                className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-cyan-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate with Cloudinary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
