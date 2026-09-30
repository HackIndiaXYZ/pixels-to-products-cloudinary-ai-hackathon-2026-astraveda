"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, StoryboardScene } from "@/lib/store";
import { Film, Sparkles, ArrowRight, MoveUp, MoveDown, Layers, Play, CheckCircle2 } from "lucide-react";

export default function StoryboardPage() {
  const router = useRouter();
  const {
    storyboardScenes,
    setStoryboardScenes,
    selectedScene,
    setSelectedScene,
    lessonTitle
  } = useAppStore();

  const [activeDrawerScene, setActiveDrawerScene] = useState<StoryboardScene | null>(null);

  const handleMoveScene = (index: number, direction: "up" | "down") => {
    const newScenes = [...storyboardScenes];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newScenes.length) return;

    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIdx];
    newScenes[targetIdx] = temp;

    // re-number
    newScenes.forEach((s, idx) => {
      s.scene_number = `0${idx + 1}`;
    });

    setStoryboardScenes(newScenes);
  };

  const handleOpenStudio = (scene: StoryboardScene) => {
    setSelectedScene(scene);
    router.push("/studio");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cyan uppercase tracking-wider mb-1">
            <Film className="w-3.5 h-3.5" /> SCREEN 03 · VISUAL STORYBOARD
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Cinematic Lesson Sequence
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            4-stage narrative sequence generated from &quot;{lessonTitle}&quot;.
          </p>
        </div>

        <button
          onClick={() => router.push("/studio")}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-cyan-sm"
        >
          <span>Open in Asset Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Storyboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {(storyboardScenes.length > 0 ? storyboardScenes : [
          {
            id: "scene-1",
            scene_number: "01",
            title: "Introduction & Foundations",
            concept_explanation: "Quantum foundational landscape and cryogenic core.",
            style_name: "Scientific 3D",
            image_url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_600,h_340,f_auto,q_auto/cld-sample-4.jpg",
            public_id: "cld-sample-4",
            status: "Cloudinary AI"
          },
          {
            id: "scene-2",
            scene_number: "02",
            title: "Superposition Field",
            concept_explanation: "Simultaneous probabilistic quantum state vectors.",
            style_name: "Editorial",
            image_url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_600,h_340,f_auto,q_auto/cld-sample-5.jpg",
            public_id: "cld-sample-5",
            status: "Cloudinary AI"
          },
          {
            id: "scene-3",
            scene_number: "03",
            title: "Entanglement Synapse",
            concept_explanation: "Correlated qubit pairs operating in cryogenic matrix.",
            style_name: "Futuristic",
            image_url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_600,h_340,f_auto,q_auto/cld-sample-3.jpg",
            public_id: "cld-sample-3",
            status: "Cloudinary AI"
          },
          {
            id: "scene-4",
            scene_number: "04",
            title: "Wavefunction Collapse",
            concept_explanation: "Discrete quantum measurement outcomes and state collapse.",
            style_name: "Photorealistic",
            image_url: "https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_600,h_340,f_auto,q_auto/cld-sample-2.jpg",
            public_id: "cld-sample-2",
            status: "Cloudinary AI"
          }
        ] as StoryboardScene[]).map((scene, idx) => (
          <div
            key={scene.id}
            className="rounded-2xl bg-background-surface border border-border-subtle overflow-hidden flex flex-col justify-between group hover:border-accent-cyan/50 transition-all shadow-card"
          >
            <div>
              {/* Image Preview Container */}
              <div className="aspect-video relative overflow-hidden bg-background-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={scene.image_url}
                  alt={scene.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-white/15 text-accent-cyan text-[11px] font-mono font-bold">
                  SCENE {scene.scene_number}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  {scene.status}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-2.5">
                <div className="text-[11px] font-mono text-accent-blue font-bold uppercase">
                  {scene.style_name}
                </div>
                <h3 className="font-bold text-base text-text-primary group-hover:text-accent-cyan transition">
                  {scene.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {scene.concept_explanation}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-background-secondary/50 border-t border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveScene(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-background-surface hover:bg-background-hover text-text-muted hover:text-text-primary disabled:opacity-30 transition"
                  title="Move scene up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveScene(idx, "down")}
                  disabled={idx === 3}
                  className="p-1.5 rounded-lg bg-background-surface hover:bg-background-hover text-text-muted hover:text-text-primary disabled:opacity-30 transition"
                  title="Move scene down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => handleOpenStudio(scene)}
                className="px-3 py-1.5 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/25 text-accent-cyan text-xs font-bold transition flex items-center gap-1"
              >
                <span>Edit Overlays</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
