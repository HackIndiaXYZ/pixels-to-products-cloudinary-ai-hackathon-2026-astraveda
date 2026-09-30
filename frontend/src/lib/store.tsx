"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ConceptData, StyleVariant, checkHealth, extractConcepts, generateAssetBundle } from "./api";

export interface StoryboardScene {
  id: string;
  scene_number: string;
  title: string;
  concept_explanation: string;
  style_name: string;
  image_url: string;
  public_id: string;
  status: "Ready" | "Generating" | "Cloudinary AI";
}

interface AppContextType {
  lessonTitle: string;
  setLessonTitle: (v: string) => void;
  instructorName: string;
  setInstructorName: (v: string) => void;
  categoryTag: string;
  setCategoryTag: (v: string) => void;
  audienceLevel: string;
  setAudienceLevel: (v: string) => void;
  lessonContent: string;
  setLessonContent: (v: string) => void;
  
  conceptData: ConceptData | null;
  setConceptData: (data: ConceptData | null) => void;
  selectedStyle: string;
  setSelectedStyle: (v: string) => void;
  
  isExtracting: boolean;
  isGenerating: boolean;
  generationStep: number;
  generationStatusText: string;
  
  variants: StyleVariant[];
  setVariants: (v: StyleVariant[]) => void;
  
  storyboardScenes: StoryboardScene[];
  setStoryboardScenes: React.Dispatch<React.SetStateAction<StoryboardScene[]>>;
  selectedScene: StoryboardScene | null;
  setSelectedScene: (s: StoryboardScene | null) => void;
  
  selectedStudioAsset: StyleVariant | null;
  setSelectedStudioAsset: (v: StyleVariant | null) => void;
  studioFormat: string;
  setStudioFormat: (v: string) => void;
  studioTheme: string;
  setStudioTheme: (v: string) => void;
  overlayEnabled: boolean;
  setOverlayEnabled: (v: boolean) => void;
  
  savedLibrary: any[];
  saveToLibrary: (item: any) => void;
  
  isJudgeModalOpen: boolean;
  setIsJudgeModalOpen: (v: boolean) => void;
  
  isCloudinaryConnected: boolean;
  cloudName: string;
  
  handleExtractDirection: () => Promise<void>;
  handleGeneratePipeline: () => Promise<void>;
  loadPreset: (preset: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [lessonTitle, setLessonTitle] = useState("Quantum Computing & Superposition");
  const [instructorName, setInstructorName] = useState("Dr. Elena Vance");
  const [categoryTag, setCategoryTag] = useState("QUANTUM PHYSICS");
  const [audienceLevel, setAudienceLevel] = useState("Advanced");
  const [lessonContent, setLessonContent] = useState(
    "Explain quantum superposition, qubits, Dirac bra-ket notation, and multi-qubit entanglement. Analyze quantum logic gates and cryogenic superconducting qubits operating in dilution refrigerators."
  );

  const [conceptData, setConceptData] = useState<ConceptData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("Scientific 3D");

  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationStatusText, setGenerationStatusText] = useState("");

  const [variants, setVariants] = useState<StyleVariant[]>([]);
  const [storyboardScenes, setStoryboardScenes] = useState<StoryboardScene[]>([]);
  const [selectedScene, setSelectedScene] = useState<StoryboardScene | null>(null);

  const [selectedStudioAsset, setSelectedStudioAsset] = useState<StyleVariant | null>(null);
  const [studioFormat, setStudioFormat] = useState("16:9");
  const [studioTheme, setStudioTheme] = useState("dark_modern");
  const [overlayEnabled, setOverlayEnabled] = useState(true);

  const [savedLibrary, setSavedLibrary] = useState<any[]>([]);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);

  const [isCloudinaryConnected, setIsCloudinaryConnected] = useState(false);
  const [cloudName, setCloudName] = useState("demo");

  useEffect(() => {
    checkHealth().then((res) => {
      setIsCloudinaryConnected(!!res.cloudinary_configured);
      setCloudName(res.cloud_name || "demo");
    }).catch(() => {
      setIsCloudinaryConnected(false);
      setCloudName("demo");
    });
  }, []);

  const loadPreset = (preset: any) => {
    setLessonTitle(preset.title);
    setInstructorName(preset.instructor);
    setCategoryTag(preset.tag);
    setAudienceLevel(preset.audience);
    setLessonContent(preset.text);
    setConceptData(null);
  };

  const handleExtractDirection = async () => {
    setIsExtracting(true);
    try {
      const data = await extractConcepts(lessonTitle, lessonContent, audienceLevel);
      setConceptData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGeneratePipeline = async () => {
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationStatusText("Finding visual relationships and core motifs...");
    
    await new Promise((r) => setTimeout(r, 400));
    setGenerationStep(2);
    setGenerationStatusText("Synthesizing structured visual prompts...");

    await new Promise((r) => setTimeout(r, 400));
    setGenerationStep(3);
    setGenerationStatusText("Sending generation request to Cloudinary GenAI pipeline...");

    try {
      const prompt = conceptData?.visual_metaphor || lessonTitle;
      const res = await generateAssetBundle(
        lessonTitle,
        instructorName,
        categoryTag,
        prompt,
        ["3D Scientific", "Editorial", "Futuristic", "Photorealistic"],
        studioTheme
      );

      setGenerationStep(4);
      setGenerationStatusText("Rendering stylistic variations & smart gravity crops...");
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep(5);
      setGenerationStatusText("Applying dynamic typography overlays & f_auto, q_auto delivery...");
      await new Promise((r) => setTimeout(r, 300));

      setVariants(res.variants);
      setSelectedStudioAsset(res.variants[0]);

      const scenes: StoryboardScene[] = [
        {
          id: "scene-1",
          scene_number: "01",
          title: "Introduction & Context",
          concept_explanation: "Establishing the quantum landscape and fundamental principles.",
          style_name: res.variants[0]?.style_name || "Scientific 3D",
          image_url: res.variants[0]?.formats["16:9"]?.url || "https://res.cloudinary.com/demo/image/upload/cld-sample-4.jpg",
          public_id: res.variants[0]?.base_public_id || "cld-sample-4",
          status: "Cloudinary AI"
        },
        {
          id: "scene-2",
          scene_number: "02",
          title: "Quantum Superposition",
          concept_explanation: "Luminous probability fields containing simultaneous state vectors.",
          style_name: res.variants[1]?.style_name || "Editorial",
          image_url: res.variants[1]?.formats["16:9"]?.url || "https://res.cloudinary.com/demo/image/upload/cld-sample-5.jpg",
          public_id: res.variants[1]?.base_public_id || "cld-sample-5",
          status: "Cloudinary AI"
        },
        {
          id: "scene-3",
          scene_number: "03",
          title: "Qubit Entanglement",
          concept_explanation: "Entangled particle circuits synapsing in cryogenic matrix.",
          style_name: res.variants[2]?.style_name || "Futuristic",
          image_url: res.variants[2]?.formats["16:9"]?.url || "https://res.cloudinary.com/demo/image/upload/cld-sample-3.jpg",
          public_id: res.variants[2]?.base_public_id || "cld-sample-3",
          status: "Cloudinary AI"
        },
        {
          id: "scene-4",
          scene_number: "04",
          title: "Measurement & Wave Collapse",
          concept_explanation: "Probability waves collapsing into discrete quantum observable states.",
          style_name: res.variants[3]?.style_name || "Photorealistic",
          image_url: res.variants[3]?.formats["16:9"]?.url || "https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg",
          public_id: res.variants[3]?.base_public_id || "cld-sample-2",
          status: "Cloudinary AI"
        }
      ];

      setStoryboardScenes(scenes);
      setSelectedScene(scenes[0]);
    } catch (err) {
      console.error("Generation error", err);
    } finally {
      setIsGenerating(false);
      setGenerationStep(6);
    }
  };

  const saveToLibrary = (item: any) => {
    setSavedLibrary((prev) => [item, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
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
        conceptData,
        setConceptData,
        selectedStyle,
        setSelectedStyle,
        isExtracting,
        isGenerating,
        generationStep,
        generationStatusText,
        variants,
        setVariants,
        storyboardScenes,
        setStoryboardScenes,
        selectedScene,
        setSelectedScene,
        selectedStudioAsset,
        setSelectedStudioAsset,
        studioFormat,
        setStudioFormat,
        studioTheme,
        setStudioTheme,
        overlayEnabled,
        setOverlayEnabled,
        savedLibrary,
        saveToLibrary,
        isJudgeModalOpen,
        setIsJudgeModalOpen,
        isCloudinaryConnected,
        cloudName,
        handleExtractDirection,
        handleGeneratePipeline,
        loadPreset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within an AppProvider");
  return context;
};
