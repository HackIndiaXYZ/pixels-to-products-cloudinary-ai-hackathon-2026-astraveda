"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Compass, Sparkles, Wand2, Layers, CheckCircle2, ArrowRight } from "lucide-react";

export default function VisualLabPage() {
  const router = useRouter();
  const {
    lessonTitle,
    instructorName,
    categoryTag,
    conceptData,
    isGenerating,
    generationStep,
    generationStatusText,
    selectedStyle,
    setSelectedStyle,
    handleGeneratePipeline
  } = useAppStore();

  const handleStartGeneration = async () => {
    await handleGeneratePipeline();
    router.push("/storyboard");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cyan uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" /> SCREEN 02 · AI VISUAL LAB
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            AI Creative Direction &amp; Synthesis
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Extracted conceptual motifs and multi-style Cloudinary generative models.
          </p>
        </div>

        <button
          onClick={handleStartGeneration}
          disabled={isGenerating}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-cyan-sm disabled:opacity-50"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" /> Generating Pipeline...
            </span>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate AI Visuals</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>

      {/* Generation Stepper Progress */}
      {isGenerating && (
        <div className="p-6 rounded-2xl bg-background-surface border border-accent-cyan/30 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-accent-cyan">
              CLOUDINARY PIPELINE EXECUTION · STAGE 0{generationStep} / 05
            </span>
            <span className="text-xs font-mono text-text-muted">ACTIVE</span>
          </div>

          <div className="w-full bg-background-secondary h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue transition-all duration-500 rounded-full"
              style={{ width: `${(generationStep / 5) * 100}%` }}
            />
          </div>

          <div className="text-sm font-semibold text-text-primary flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
            {generationStatusText}
          </div>
        </div>
      )}

      {/* 4 Core Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Key Topic & Metaphor */}
        <div className="p-6 rounded-2xl bg-background-surface border border-border-subtle space-y-4">
          <div className="text-xs font-mono uppercase text-accent-cyan font-semibold tracking-wider">
            Pedagogical Focus &amp; Metaphor
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              {conceptData?.key_topic || lessonTitle}
            </h3>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              {conceptData?.visual_metaphor ||
                "A luminous scientific probability field containing multi-state qubit representations and cryo-entanglement circuitry."}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap gap-2">
            {(conceptData?.suggested_tags || [categoryTag, "QUANTUM", "COMPUTING", "NEXT-GEN"]).map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-mono font-bold"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Card 2: Color Palette */}
        <div className="p-6 rounded-2xl bg-background-surface border border-border-subtle space-y-4">
          <div className="text-xs font-mono uppercase text-accent-blue font-semibold tracking-wider">
            Brand Color Palette &amp; Atmosphere
          </div>
          <p className="text-sm text-text-secondary">
            AI-extracted harmonic color grading for optimal visual engagement.
          </p>
          <div className="grid grid-cols-4 gap-3 pt-2">
            {(conceptData?.color_palette || ["#00E5FF", "#4F8CFF", "#7C3AED", "#0A0F16"]).map((c, idx) => (
              <div key={idx} className="space-y-1.5 text-center">
                <div
                  className="h-14 rounded-xl border border-white/10 shadow-inner"
                  style={{ backgroundColor: c }}
                />
                <span className="text-[11px] font-mono text-text-muted">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Artistic Style Variations Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-cyan" /> Select Generative Aesthetic
          </h2>
          <span className="text-xs text-text-muted font-mono">4 STYLES SIMULTANEOUSLY GENERATED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              id: "Scientific 3D",
              tag: "3D OCTANE",
              desc: "Raytraced volumetric render with molecular lighting",
              preview: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_400,h_250,f_auto,q_auto/cld-sample-4.jpg"
            },
            {
              id: "Editorial",
              tag: "MINIMALIST",
              desc: "Vector diagrammatic artwork with publication clarity",
              preview: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_400,h_250,f_auto,q_auto/cld-sample-5.jpg"
            },
            {
              id: "Futuristic",
              tag: "CYBERPUNK",
              desc: "Glowing cyan holographic circuits & dark metallic accents",
              preview: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_400,h_250,f_auto,q_auto/cld-sample-3.jpg"
            },
            {
              id: "Photorealistic",
              tag: "LABORATORY",
              desc: "85mm macro lens editorial laboratory realism",
              preview: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_400,h_250,f_auto,q_auto/cld-sample-2.jpg"
            }
          ].map((style) => (
            <div
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                selectedStyle === style.id
                  ? "bg-accent-cyan/10 border-accent-cyan shadow-cyan-sm"
                  : "bg-background-surface border-border-subtle hover:border-text-muted"
              }`}
            >
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-background-secondary relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={style.preview}
                  alt={style.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-accent-cyan border border-accent-cyan/30">
                  {style.tag}
                </span>
              </div>

              <div>
                <div className="font-bold text-sm text-text-primary flex items-center justify-between">
                  {style.id}
                  {selectedStyle === style.id && <CheckCircle2 className="w-4 h-4 text-accent-cyan" />}
                </div>
                <p className="text-xs text-text-muted mt-1 leading-normal">{style.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
