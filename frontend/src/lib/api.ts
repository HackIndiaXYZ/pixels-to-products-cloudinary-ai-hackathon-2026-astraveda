const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface ConceptData {
  key_topic: string;
  visual_metaphor: string;
  recommended_styles: string[];
  suggested_prompts: Record<string, string>;
  color_palette: string[];
  suggested_tags: string[];
}

export interface FormattedAsset {
  aspect_ratio: string;
  label: string;
  url: string;
  width: number;
  height: number;
  cloudinary_transformations: string;
}

export interface StyleVariant {
  style_name: string;
  base_public_id: string;
  base_image_url: string;
  generation_prompt: string;
  formats: Record<string, FormattedAsset>;
  overlay_applied: boolean;
}

export interface AssetBundleResponse {
  success: boolean;
  lesson_title: string;
  instructor_name: string;
  category_tag: string;
  variants: StyleVariant[];
  total_assets_generated: number;
  message?: string;
}

export async function checkHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/api/health`, { 
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    return { status: "offline", cloudinary_configured: false, cloud_name: "demo", gemini_configured: false };
  }
}

export async function fetchSampleLessons() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/api/sample-lessons`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error("Failed to fetch samples");
    return await res.json();
  } catch (err) {
    return {
      samples: [
        {
          id: "quantum",
          title: "Quantum Computing & Superposition",
          instructor: "Dr. Elena Vance",
          tag: "QUANTUM PHYSICS",
          audience: "Advanced",
          text: "Explain quantum superposition, qubits, Dirac notation, and multi-qubit entanglement. Analyze quantum logic gates and cryogenic superconducting qubits operating in dilution refrigerators."
        },
        {
          id: "ai",
          title: "Transformer Models & Generative AI",
          instructor: "Prof. Marcus Thorne",
          tag: "AI ARCHITECTURES",
          audience: "Advanced",
          text: "Comprehensive breakdown of multi-head self-attention mechanisms, latent diffusion representations, token embeddings, and foundational model fine-tuning."
        },
        {
          id: "astro",
          title: "Astrobiology: The Search for Alien Life",
          instructor: "Dr. Sarah Lin",
          tag: "SPACE EXPLORATION",
          audience: "Undergraduate",
          text: "Detecting atmospheric biosignatures on habitable zone exoplanets using James Webb spectroscopy. Planetary geological cycles and extremophile lifeforms."
        },
        {
          id: "history",
          title: "Lost Civilizations: The Library of Alexandria",
          instructor: "Prof. Arthur Pendelton",
          tag: "WORLD HISTORY",
          audience: "Beginner",
          text: "Exploring the greatest intellectual hub of antiquity, architectural marble wonders, Archimedean mechanics, and illuminated ancient parchment scrolls."
        }
      ]
    };
  }
}

export async function extractConcepts(title: string, text: string, audience: string = "Advanced"): Promise<ConceptData> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/extract-concepts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson_title: title,
        lesson_text: text,
        target_audience: audience
      })
    });
    if (!res.ok) throw new Error("Concept extraction failed");
    const json = await res.json();
    return json.data;
  } catch (err) {
    // High-fidelity fallback for Demo Mode
    return {
      key_topic: title,
      visual_metaphor: `A luminous scientific visualization representing ${title} with interconnected conceptual nodes and probability fields.`,
      recommended_styles: ["Scientific 3D", "Editorial", "Futuristic", "Photorealistic"],
      suggested_prompts: {
        "Scientific 3D": `Illuminated glowing quantum processor core with suspended atoms, 3D octane render 8k`,
        "Editorial": `Clean minimalist vector art of ${title}, academic infographic`,
        "Futuristic": `Neon cyberpunk data crystal network of ${title}`
      },
      color_palette: ["#00E5FF", "#4F8CFF", "#7C3AED", "#0A0F16"],
      suggested_tags: ["QUANTUM PHYSICS", "NEXT-GEN TECH", "COMPUTING", "PRECISION"]
    };
  }
}

export async function generateAssetBundle(
  title: string,
  instructor: string,
  tag: string,
  prompt: string,
  styles: string[] = ["3D Scientific", "Editorial", "Futuristic", "Photorealistic"],
  theme: string = "dark_modern"
): Promise<AssetBundleResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/generate-assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson_title: title,
        instructor_name: instructor,
        category_tag: tag,
        prompt: prompt,
        styles: styles,
        aspect_ratios: ["16:9", "4:3", "1:1", "9:16"],
        include_text_overlay: true,
        overlay_theme: theme
      })
    });
    if (!res.ok) throw new Error("Asset generation failed");
    return await res.json();
  } catch (err) {
    // High-fidelity demo fallback with Cloudinary sample URLs
    const mockStyles = [
      { name: "Scientific 3D", id: "cld-sample-4" },
      { name: "Editorial", id: "cld-sample-5" },
      { name: "Futuristic", id: "cld-sample-3" },
      { name: "Photorealistic", id: "cld-sample-2" }
    ];

    const variants: StyleVariant[] = mockStyles.map(s => ({
      style_name: s.name,
      base_public_id: s.id,
      base_image_url: `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/${s.id}.jpg`,
      generation_prompt: `${prompt} in ${s.name} aesthetic`,
      formats: {
        "16:9": {
          aspect_ratio: "16:9",
          label: "YouTube / LMS (16:9)",
          url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1280,h_720,f_auto,q_auto/${s.id}.jpg`,
          width: 1280,
          height: 720,
          cloudinary_transformations: "c_fill,g_auto,w_1280,h_720,f_auto,q_auto"
        },
        "4:3": {
          aspect_ratio: "4:3",
          label: "Presentation Deck (4:3)",
          url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1024,h_768,f_auto,q_auto/${s.id}.jpg`,
          width: 1024,
          height: 768,
          cloudinary_transformations: "c_fill,g_auto,w_1024,h_768,f_auto,q_auto"
        },
        "1:1": {
          aspect_ratio: "1:1",
          label: "Social / Card (1:1)",
          url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1080,h_1080,f_auto,q_auto/${s.id}.jpg`,
          width: 1080,
          height: 1080,
          cloudinary_transformations: "c_fill,g_auto,w_1080,h_1080,f_auto,q_auto"
        },
        "9:16": {
          aspect_ratio: "9:16",
          label: "Mobile Story (9:16)",
          url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_720,h_1280,f_auto,q_auto/${s.id}.jpg`,
          width: 720,
          height: 1280,
          cloudinary_transformations: "c_fill,g_auto,w_720,h_1280,f_auto,q_auto"
        }
      },
      overlay_applied: true
    }));

    return {
      success: true,
      lesson_title: title,
      instructor_name: instructor,
      category_tag: tag,
      variants,
      total_assets_generated: 16,
      message: "Generated via Cloudinary AI Demo Pipeline"
    };
  }
}

export async function previewOverlay(
  public_id: string,
  aspect_ratio: string,
  title: string,
  instructor: string,
  tag: string,
  theme: string = "dark_modern"
): Promise<FormattedAsset> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/preview-overlay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_id,
        title,
        instructor_name: instructor,
        category_tag: tag,
        aspect_ratio,
        theme
      })
    });
    if (!res.ok) throw new Error("Preview overlay failed");
    return await res.json();
  } catch (err) {
    const aspectMap: Record<string, { w: number; h: number }> = {
      "16:9": { w: 1280, h: 720 },
      "4:3": { w: 1024, h: 768 },
      "1:1": { w: 1080, h: 1080 },
      "9:16": { w: 720, h: 1280 }
    };
    const spec = aspectMap[aspect_ratio] || { w: 1280, h: 720 };
    return {
      aspect_ratio,
      label: `${aspect_ratio} Format`,
      url: `https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_${spec.w},h_${spec.h},f_auto,q_auto/${public_id}.jpg`,
      width: spec.w,
      height: spec.h,
      cloudinary_transformations: `c_fill,g_auto,w_${spec.w},h_${spec.h},f_auto,q_auto`
    };
  }
}
