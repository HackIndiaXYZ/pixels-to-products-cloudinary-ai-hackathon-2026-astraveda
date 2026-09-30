import logging
from typing import Dict, List, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.models.schemas import (
    ConceptExtractionRequest,
    ConceptExtractionResponse,
    GenerateAssetRequest,
    AssetBundleResponse,
    DynamicOverlayRequest,
    FormattedAsset,
    HealthResponse
)
from backend.services.prompt_engine import (
    extract_concept_with_llm,
    build_style_prompts,
    EDUCATION_PRESETS
)
from backend.services.cloudinary_service import cloudinary_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("eduvision-backend")

app = FastAPI(
    title="EduVision API - Ed-Tech Dynamic Asset Engine",
    description="Track 2 Generative Content Workflow for Cloudinary AI Hackathon 2026",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Health status and Cloudinary connectivity check."""
    status_info = cloudinary_service.check_connection()
    return HealthResponse(
        status="healthy",
        cloudinary_configured=status_info.get("connected", False),
        cloud_name=status_info.get("cloud_name"),
        gemini_configured=bool(settings.GEMINI_API_KEY),
        version="1.0.0"
    )

@app.get("/api/sample-lessons")
def get_sample_lessons() -> Dict[str, Any]:
    """Provides curated sample curriculum presets for instant testing and demonstration."""
    return {
        "samples": [
            {
                "id": "quantum",
                "title": "Quantum Computing & Qubit Entanglement",
                "instructor": "Dr. Elena Vance",
                "tag": "PHYSICS & TECH",
                "audience": "Advanced Undergraduate",
                "text": "Introduction to superposition, multi-qubit entanglement, and quantum gates. Exploring particle interference in cryogenic quantum computing circuits."
            },
            {
                "id": "ai",
                "title": "Deep Neural Architectures & Generative AI",
                "instructor": "Prof. Marcus Thorne",
                "tag": "COMPUTER SCIENCE",
                "audience": "Software Engineers",
                "text": "Comprehensive deep dive into transformer models, multi-head attention, latent diffusion representations, and foundational model fine-tuning."
            },
            {
                "id": "astro",
                "title": "Astrobiology & Exoplanetary Atmospheres",
                "instructor": "Dr. Sarah Lin",
                "tag": "SPACE SCIENCES",
                "audience": "Curious Learners",
                "text": "Detecting biosignatures on habitable zone exoplanets using James Webb spectroscopy. Planetary geological cycles and extremophile lifeforms."
            },
            {
                "id": "history",
                "title": "Lost Civilizations & Ancient Alexandria",
                "instructor": "Prof. Arthur Pendelton",
                "tag": "HUMANITIES & HISTORY",
                "audience": "High School / College",
                "text": "Exploring the intellectual epicenter of the Hellenistic world, the Great Library of Alexandria, Archimedean mechanics, and ancient parchment scrolls."
            },
            {
                "id": "web3",
                "title": "Decentralized Systems & Cryptography",
                "instructor": "Alex Rivera",
                "tag": "BLOCKCHAIN TECH",
                "audience": "Developers",
                "text": "Zero-knowledge proofs, consensus mechanisms, Byzantine fault tolerance, and smart contract architecture in decentralized state machines."
            }
        ]
    }

@app.post("/api/extract-concepts", response_model=ConceptExtractionResponse)
def extract_concepts(payload: ConceptExtractionRequest):
    """
    Analyzes lesson text using LLM (or educational heuristics engine) to extract visual metaphors,
    recommended style prompts, color palettes, and tags.
    """
    try:
        concept = extract_concept_with_llm(
            title=payload.lesson_title,
            text=payload.lesson_text,
            audience=payload.target_audience or "General"
        )
        return ConceptExtractionResponse(
            success=True,
            data=concept,
            message="Concepts and visual prompts successfully extracted."
        )
    except Exception as e:
        logger.error(f"Error extracting concepts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-assets", response_model=AssetBundleResponse)
def generate_assets(payload: GenerateAssetRequest):
    """
    End-to-End Generative Content Pipeline:
    1. Generates base AI assets across chosen styles.
    2. Builds responsive aspect ratios (16:9, 9:16, 1:1, 4:3).
    3. Dynamically overlays typography (title, instructor, tag).
    4. Applies f_auto and q_auto optimization parameters.
    """
    try:
        # Build style prompts based on input or selected styles
        style_prompts = {}
        for style in payload.styles:
            style_prompts[style] = f"{payload.prompt} in {style} aesthetic"

        # Generate asset bundle through Cloudinary pipeline
        variants = cloudinary_service.generate_asset_bundle(
            lesson_title=payload.lesson_title,
            instructor_name=payload.instructor_name or "EduVision",
            category_tag=payload.category_tag or "ACADEMICS",
            style_prompts=style_prompts,
            aspect_ratios=payload.aspect_ratios,
            include_text_overlay=payload.include_text_overlay,
            theme=payload.overlay_theme or "dark_modern"
        )

        total_assets = sum(len(v.formats) for v in variants)

        return AssetBundleResponse(
            success=True,
            lesson_title=payload.lesson_title,
            instructor_name=payload.instructor_name or "EduVision",
            category_tag=payload.category_tag or "ACADEMICS",
            variants=variants,
            total_assets_generated=total_assets,
            message=f"Successfully generated {total_assets} educational visual assets across {len(variants)} styles."
        )
    except Exception as e:
        logger.error(f"Error generating asset bundle: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/preview-overlay", response_model=FormattedAsset)
def preview_overlay(payload: DynamicOverlayRequest):
    """
    Dynamically re-renders typography overlay on existing asset without re-generating the base image.
    Demonstrates Cloudinary on-the-fly URL transformation power.
    """
    try:
        formatted = cloudinary_service.build_format_url(
            public_id=payload.public_id,
            aspect_ratio=payload.aspect_ratio,
            title=payload.title,
            instructor_name=payload.instructor_name,
            category_tag=payload.category_tag,
            include_text_overlay=True,
            theme=payload.theme
        )
        return formatted
    except Exception as e:
        logger.error(f"Error previewing overlay: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.BACKEND_HOST, port=settings.BACKEND_PORT, reload=True)
