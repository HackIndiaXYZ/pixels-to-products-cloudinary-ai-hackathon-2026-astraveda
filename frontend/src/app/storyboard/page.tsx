"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, StoryboardScene } from "@/lib/store";
import { Film, Sparkles, ArrowRight, ArrowLeft, RefreshCw, Palette, Layers, CheckCircle2, Sliders } from "lucide-react";

export default function StoryboardPage() {
  const router = useRouter();
  const {
    lessonTitle,
    storyboardScenes,
    setStoryboardScenes,
    selectedScene,
    setSelectedScene,
    setSelectedStudioAsset,
    variants
  } = useAppStore();

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // If no scenes generated yet, provide high-fidelity initial scenes
  const scenesToRender: StoryboardScene[] = storyboardScenes.length > 0 ? storyboardScenes : [
    {
      id: "scene-1",
      scene_number: "01",
      title: "Introduction & Fundamentals",
      concept_explanation: "Establishing the quantum landscape, physical principles, and microscopic context.",
      style_name: "Scientific 3D",
      image_url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/cld-sample-4.jpg",
      public_id: "cld-sample-4",
      status: "Cloudinary AI"
    },
    {
      id: "scene-2",
      scene_number: "02",
      title: "Quantum Superposition",
      concept_explanation: "Luminous probability fields containing multiple simultaneous state vectors.",
      style_name: "Editorial",
      image_url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/cld-sample-5.jpg",
      public_id: "cld-sample-5",
      status: "Cloudinary AI"
    },
    {
      id: "scene-3",
      scene_number: "03",
      title: "Qubit Entanglement",
      concept_explanation: "Entangled particle circuits synapsing through cryogenic dilution matrix.",
      style_name: "Futuristic",
      image_url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/cld-sample-3.jpg",
      public_id: "cld-sample-3",
      status: "Cloudinary AI"
    },
    {
      id: "scene-4",
      scene_number: "04",
      title: "Measurement & Wave Collapse",
      concept_explanation: "Probability waves collapsing into a single discrete observable quantum eigenvalue.",
      style_name: "Photorealistic",
      image_url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/cld-sample-2.jpg",
      public_id: "cld-sample-2",
      status: "Cloudinary AI"
    }
  ];

  const currentScene = scenesToRender[activeSceneIndex] || scenesToRender[0];

  const handleOpenInStudio = (scene: StoryboardScene) => {
    setSelectedScene(scene);
    // Find matching variant if available
    const matched = variants.find(v => v.base_public_id === scene.public_id) || variants[0];
    if (matched) setSelectedStudioAsset(matched);
    router.push("/studio");
  };

  const handleMoveScene = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= scenesToRender.length) return;

    const newScenes = [...scenesToRender];
    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIdx];
    newScenes[targetIdx] = temp;

    setStoryboardScenes(newScenes);
    setActiveSceneIndex(targetIdx);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-xs font-bold font-mono tracking-wider">
            <Film className="w-3.5 h-3.5" /> CINEMATIC STORYBOARD
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mt-1">
            Your Visual Storyboard
          </h1>
          <p className="text-sm text-text-secondary">
            Lesson visual narrative sequence generated for <strong className="text-text-primary">"{lessonTitle}"</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenInStudio(currentScene)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-xs flex items-center gap-2 hover:opacity-95 transition shadow-cyan-sm"
          >
            <Palette className="w-4 h-4" />
            <span>Edit in Asset Studio</span>
          </button>
        </div>
      </div>

      {/* Horizontal Cinematic Storyboard Sequence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {scenesToRender.map((scene, idx) => {
          const isActive = idx === activeSceneIndex;
          return (
            <div
              key={scene.id || idx}
              onClick={() => setActiveSceneIndex(idx)}
              className={`p-4 rounded-2xl bg-background-surface border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "border-accent-cyan bg-background-elevated shadow-cyan-glow scale-[1.02]"
                  : "border-border-subtle hover:border-border-hover hover:bg-background-elevated/70"
              }`}
            >
              <div>
                {/* Scene Number & Cloudinary Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-accent-cyan">
                    SCENE {scene.scene_number || `0${idx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-secondary text-text-muted border border-border-subtle flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Cloudinary AI
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3 border border-border-subtle">
                  <img
                    src={scene.image_url}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 border-2 border-accent-cyan rounded-xl pointer-events-none" />
                  )}
                </div>

                {/* Scene Content */}
                <h3 className="font-bold text-sm text-text-primary mb-1 tracking-tight">{scene.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {scene.concept_explanation}
                </p>
              </div>

              {/* Card Footer / Quick Actions */}
              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">{scene.style_name}</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(idx, "left");
                    }}
                    className="p-1 rounded bg-background-secondary text-text-muted hover:text-text-primary disabled:opacity-30"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === scenesToRender.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(idx, "right");
                    }}
                    className="p-1 rounded bg-background-secondary text-text-muted hover:text-text-primary disabled:opacity-30"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focused Scene Detail Inspector */}
      <div className="p-8 rounded-2xl bg-background-surface border border-border-subtle shadow-card grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 relative aspect-video rounded-xl overflow-hidden bg-black border border-border-subtle">
          <img
            src={currentScene.image_url}
            alt={currentScene.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-5">
          <div>
            <span className="text-xs font-mono font-bold text-accent-cyan">
              SELECTED · SCENE {currentScene.scene_number}
            </span>
            <h2 className="text-2xl font-bold text-text-primary mt-1">{currentScene.title}</h2>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs font-mono uppercase text-text-muted">Visual Concept</div>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                {currentScene.concept_explanation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-background-secondary border border-border-subtle">
                <div className="text-[10px] font-mono text-text-muted">STYLE PRESET</div>
                <div className="text-xs font-bold text-text-primary mt-0.5">{currentScene.style_name}</div>
              </div>

              <div className="p-3 rounded-lg bg-background-secondary border border-border-subtle">
                <div className="text-[10px] font-mono text-text-muted">DELIVERY OPTIMIZATION</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">f_auto, q_auto</div>
              </div>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleOpenInStudio(currentScene)}
              className="flex-1 px-5 py-3 rounded-xl bg-accent-cyan text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition shadow-cyan-sm"
            >
              <Palette className="w-4 h-4" /> Edit in Asset Studio
            </button>

            <button
              onClick={() => router.push("/export")}
              className="px-5 py-3 rounded-xl bg-background-secondary hover:bg-background-hover border border-border-subtle text-text-secondary text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              Export Storyboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
