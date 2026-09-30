"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Sparkles, ArrowRight, BookOpen, Layers, Zap } from "lucide-react";

const PRESET_EXAMPLES = [
  {
    title: "Quantum Computing & Superposition",
    instructor: "Dr. Elena Vance",
    tag: "QUANTUM PHYSICS",
    audience: "Advanced",
    text: "Explain quantum superposition, qubits, Dirac bra-ket notation, and multi-qubit entanglement. Analyze quantum logic gates and cryogenic superconducting qubits operating in dilution refrigerators."
  },
  {
    title: "Transformer Models & Generative AI",
    instructor: "Prof. Marcus Thorne",
    tag: "AI ARCHITECTURES",
    audience: "Advanced",
    text: "Comprehensive breakdown of multi-head self-attention mechanisms, latent diffusion representations, token embeddings, and foundational model fine-tuning."
  },
  {
    title: "Astrobiology: The Search for Alien Life",
    instructor: "Dr. Sarah Lin",
    tag: "SPACE EXPLORATION",
    audience: "Undergraduate",
    text: "Detecting atmospheric biosignatures on habitable zone exoplanets using James Webb spectroscopy. Planetary geological cycles and extremophile lifeforms."
  },
  {
    title: "Lost Civilizations: The Library of Alexandria",
    instructor: "Prof. Arthur Pendelton",
    tag: "WORLD HISTORY",
    audience: "Beginner",
    text: "Exploring the greatest intellectual hub of antiquity, architectural marble wonders, Archimedean mechanics, and illuminated ancient parchment scrolls."
  }
];

export default function CreatePage() {
  const router = useRouter();
  const {
    lessonTitle,
    setLessonTitle,
    instructorName,
    setInstructorName,
    categoryTag,
    setCategoryTag,
    audienceLevel,
    setAudienceLevel,
    lessonContent,
    setLessonContent,
    isExtracting,
    handleExtractDirection,
    loadPreset
  } = useAppStore();

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleExtractDirection();
    router.push("/lab");
  };

  const handleApplyPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    loadPreset(PRESET_EXAMPLES[idx]);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-6">
      {/* Hero Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-xs font-bold font-mono tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> AI VISUAL ENGINE
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
          Turn a lesson into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue">visual story.</span>
        </h1>
        <p className="text-base text-text-secondary max-w-2xl leading-relaxed">
          EduVision transforms your lesson into AI-generated educational visuals, cinematic storyboards, and multi-format assets powered by Cloudinary.
        </p>
      </div>

      {/* Main Creation Card */}
      <div className="p-8 rounded-2xl bg-background-surface border border-border-subtle shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="border-b border-border-subtle pb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">What are you teaching?</h2>
            <span className="text-xs text-text-muted font-mono">STEP 01 · LESSON INPUT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="e.g. Quantum Computing & Superposition"
                required
                className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Instructor Name
              </label>
              <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                placeholder="e.g. Dr. Elena Vance"
                className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan text-sm transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Category Tag / Badge
              </label>
              <input
                type="text"
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
                placeholder="e.g. QUANTUM PHYSICS"
                className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Audience Level
              </label>
              <select
                value={audienceLevel}
                onChange={(e) => setAudienceLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border-subtle text-text-primary focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan text-sm transition"
              >
                <option value="Beginner">Beginner / K-12</option>
                <option value="Undergraduate">Undergraduate / College</option>
                <option value="Advanced">Advanced / Technical</option>
                <option value="Executive">Executive / Professional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Lesson Content / Script / Notes
            </label>
            <textarea
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              rows={4}
              placeholder="Explain the core principles, physical concepts, or mechanisms you want visualized..."
              required
              className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan text-sm transition leading-relaxed resize-y"
            />
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Preset:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_EXAMPLES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      selectedPresetIndex === idx
                        ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30"
                        : "bg-background-secondary text-text-muted hover:text-text-secondary hover:bg-background-hover border border-border-subtle"
                    }`}
                  >
                    {p.title.split("&")[0].split(":")[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isExtracting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-cyan-sm disabled:opacity-50"
            >
              {isExtracting ? (
                <span>Extracting Visual Concepts...</span>
              ) : (
                <>
                  <span>Create Visual Story</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <div className="p-5 rounded-xl bg-background-surface/60 border border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-text-primary">AI Concept Extraction</div>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Extracts core educational metaphors and structured visual prompts from raw syllabus text.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-background-surface/60 border border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-3">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-text-primary">Cloudinary Generative Variations</div>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Produces 4 distinct artistic styles (3D Scientific, Editorial, Futuristic, Photorealistic) simultaneously.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-background-surface/60 border border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-text-primary">Multi-Device Asset Kits</div>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            On-the-fly text overlays and responsive crops (16:9, 4:3, 1:1, 9:16) with f_auto and q_auto delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
