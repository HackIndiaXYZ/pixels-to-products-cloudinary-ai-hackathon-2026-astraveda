import json
import logging
from typing import Dict, List, Any
from backend.config import settings
from backend.models.schemas import ExtractedConcept

logger = logging.getLogger(__name__)

# Predefined educational concept heuristics for intelligent offline/fallback parsing
EDUCATION_PRESETS: Dict[str, Dict[str, Any]] = {
    "quantum": {
        "metaphor": "Glowing quantum qubit sphere entangled with illuminated fiber-optic circuits in a deep cosmic particle accelerator",
        "colors": ["#00F2FE", "#4FACFE", "#6B11FF", "#0A0526"],
        "tags": ["QUANTUM PHYSICS", "NEXT-GEN TECH", "COMPUTING"],
        "base_prompt": "Illuminated glowing quantum processor core with suspended atoms and geometric particle laser grid in dark cosmic laboratory"
    },
    "ai": {
        "metaphor": "Digital neural brain synapsing with iridescent algorithmic data crystal streams and futuristic circuitry",
        "colors": ["#8A2387", "#E94057", "#F27121", "#0F172A"],
        "tags": ["ARTIFICIAL INTELLIGENCE", "MACHINE LEARNING", "FUTURE TECH"],
        "base_prompt": "Glowing holographic neural network synapses flowing into a crystalline artificial intelligence nexus, futuristic 8k studio lighting"
    },
    "astro": {
        "metaphor": "Vibrant bioluminescent exoplanet landscape with orbiting rings and celestial nebulae under starlight",
        "colors": ["#2E0854", "#663399", "#00FFFF", "#FF007F"],
        "tags": ["ASTROPHYSICS", "SPACE EXPLORATION", "COSMOLOGY"],
        "base_prompt": "Majestic view of a bioluminescent extraterrestrial biosphere overlooking deep spiral galaxy nebulae and orbital planetary rings"
    },
    "biology": {
        "metaphor": "Luminescent double-helix DNA strand with microscopic cellular organelles in emerald and deep azure fluid",
        "colors": ["#00B09B", "#96C93D", "#00416A", "#E4E5E6"],
        "tags": ["GENOMICS", "CELLULAR BIOLOGY", "LIFE SCIENCES"],
        "base_prompt": "Macro hyper-detailed glowing DNA double helix structure with floating cellular molecules in bioluminescent fluid"
    },
    "history": {
        "metaphor": "Ancient mythical library and architectural parchment scrolls illuminated by warm golden sunbeam through temple pillars",
        "colors": ["#D4AF37", "#8B4513", "#2C1810", "#F5EBE0"],
        "tags": ["WORLD HISTORY", "ARCHAEOLOGY", "ANCIENT CIVILIZATIONS"],
        "base_prompt": "Grand mythical Alexandria library with towering marble columns, celestial astrolabes, and glowing illuminated ancient parchment scrolls"
    },
    "web3": {
        "metaphor": "Interconnected glowing cryptographic blocks floating in a geometric decentralized cyberspace matrix",
        "colors": ["#F7931A", "#627EEA", "#0D1117", "#161B22"],
        "tags": ["BLOCKCHAIN", "DECENTRALIZED SYSTEMS", "CRYPTOGRAPHY"],
        "base_prompt": "Isometric glowing cryptographic cubes interconnected by illuminated neon digital ledger chains floating in futuristic dark matrix"
    },
    "datascience": {
        "metaphor": "Multi-dimensional holographic data cubes, mathematical charts, and glowing analytics nodes",
        "colors": ["#3A7BD5", "#3A6073", "#00D2FF", "#111827"],
        "tags": ["DATA SCIENCE", "BIG DATA", "ANALYTICS"],
        "base_prompt": "Futuristic floating 3D holographic data visualization dashboards, radiant charts, and glowing statistical nodes in clean dark space"
    },
    "robotics": {
        "metaphor": "Bionic robotic hand assembling glowing cybernetic microchips with laser precision",
        "colors": ["#00FFFF", "#3B82F6", "#1E293B", "#F1F5F9"],
        "tags": ["ROBOTICS", "CYBERNETICS", "AUTOMATION"],
        "base_prompt": "Futuristic precision bionic robotic arm manipulating luminescent glowing nanotechnology circuits in clean room lab"
    }
}

STYLE_PROMPT_MODIFIERS: Dict[str, str] = {
    "3D Render": "cinema4D 3D render, octane render, clean ambient occlusion, vibrant volumetric lighting, hyper-detailed textures, raytraced, 8k resolution",
    "Photorealistic": "high-end editorial studio photography, dramatic lighting, sharp focus, 85mm f/1.4 lens, ultra-detailed textures, award-winning composition",
    "Minimalist Vector": "clean minimalist flat vector art, bold harmonious color palette, elegant geometric silhouettes, modern infographic aesthetic, crisp vector lines",
    "Cyberpunk / Sci-Fi": "neon cyberpunk aesthetics, vibrant cyan and magenta glowing accents, dark moody metallic backdrop, raytraced reflections, high-tech interface vibes",
    "Chalkboard / Hand-Drawn": "intricate chalk sketch on dark slate blackboard, educational chalkboard diagrams, mathematical equations, warm architectural drawing style",
    "Watercolor Illustration": "soft organic watercolor painting, fluid dreamy color washes, delicate ink outlines, artisanal educational illustration style"
}

AUDIENCE_MODIFIERS: Dict[str, str] = {
    "Beginner": "approachable, clean, intuitive visual layout, friendly vibrant tones",
    "Undergraduate": "rich conceptual detail, structured educational depth, academic clarity",
    "Advanced": "intricate multi-layered architectural complexity, hyper-detailed high-tech aesthetic",
    "Executive": "sophisticated executive polish, premium dark-mode finish, elegant minimalist framing"
}


def build_style_prompts(base_prompt: str, audience: str = "General") -> Dict[str, str]:
    """Generates customized prompts for each artistic style variation taking audience into account."""
    aud_suffix = AUDIENCE_MODIFIERS.get(audience, "")
    results = {}
    for style_name, modifier in STYLE_PROMPT_MODIFIERS.items():
        if aud_suffix:
            results[style_name] = f"{base_prompt}, {modifier}, {aud_suffix}"
        else:
            results[style_name] = f"{base_prompt}, {modifier}"
    return results


def extract_concept_heuristics(title: str, text: str, audience: str = "General") -> ExtractedConcept:
    """Intelligent heuristic-based concept extractor when no LLM API key is present."""
    combined = f"{title} {text}".lower()
    
    # Match keywords against presets
    matched_preset = None
    for key, preset in EDUCATION_PRESETS.items():
        if key in combined:
            matched_preset = preset
            break
            
    if not matched_preset:
        words = [w for w in title.split() if len(w) > 3]
        topic_term = words[0] if words else "Educational Mastery"
        base_prompt = f"Futuristic educational concept illustration of {title}, symbolizing deep knowledge and {topic_term}, glowing dynamic lighting, inspirational academic atmosphere"
        metaphor = f"Dynamic visual representation of {title} with interconnected conceptual nodes and enlightened scholarly geometry"
        colors = ["#1E3A8A", "#3B82F6", "#60A5FA", "#0F172A"]
        tags = ["EDUCATION", "MASTERY", title[:15].upper().strip()]
    else:
        metaphor = matched_preset["metaphor"]
        colors = matched_preset["colors"]
        tags = matched_preset["tags"]
        base_prompt = f"{matched_preset['base_prompt']} for learning '{title}'"

    prompts = build_style_prompts(base_prompt, audience)

    return ExtractedConcept(
        key_topic=title,
        visual_metaphor=metaphor,
        recommended_styles=["3D Render", "Photorealistic", "Minimalist Vector", "Cyberpunk / Sci-Fi"],
        suggested_prompts=prompts,
        color_palette=colors,
        suggested_tags=tags
    )


def extract_concept_with_llm(title: str, text: str, audience: str = "General") -> ExtractedConcept:
    """Uses Google Gemini if available, or seamlessly falls back to heuristic engine."""
    if not settings.GEMINI_API_KEY:
        return extract_concept_heuristics(title, text, audience)

    try:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        system_instruction = (
            "You are an expert Ed-Tech Creative Director. Extract visual metaphors, artistic prompts, "
            "color palettes, and tags from course descriptions to feed into Cloudinary's AI Image Generation pipeline. "
            "Return valid JSON matching the requested structure."
        )
        
        prompt_content = f"""
        Analyze this educational content and create visual generation prompts:
        Title: {title}
        Target Audience: {audience}
        Content / Syllabus:
        {text}

        Respond ONLY with a valid JSON object matching this exact schema:
        {{
            "key_topic": "{title}",
            "visual_metaphor": "A vivid description of a visual metaphor for this lesson",
            "base_prompt": "A core image prompt describing the central visual scene",
            "color_palette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
            "suggested_tags": ["TAG1", "TAG2", "TAG3"]
        }}
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_content,
            config={'response_mime_type': 'application/json'}
        )
        
        raw_json = response.text
        data = json.loads(raw_json)
        
        base_prompt = data.get("base_prompt", f"Educational visual for {title}")
        prompts = build_style_prompts(base_prompt, audience)
        
        return ExtractedConcept(
            key_topic=data.get("key_topic", title),
            visual_metaphor=data.get("visual_metaphor", "Educational concept illustration"),
            recommended_styles=["3D Render", "Photorealistic", "Minimalist Vector", "Cyberpunk / Sci-Fi"],
            suggested_prompts=prompts,
            color_palette=data.get("color_palette", ["#3B82F6", "#8B5CF6", "#EC4899", "#1E293B"]),
            suggested_tags=data.get("suggested_tags", ["EDUCATION", "LESSON", "EDTECH"])
        )
    except Exception as e:
        logger.warning(f"LLM extraction encountered an issue, falling back to heuristics: {e}")
        return extract_concept_heuristics(title, text, audience)
