from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ConceptExtractionRequest(BaseModel):
    lesson_title: str = Field(..., description="Title of the course or lesson")
    lesson_text: str = Field(..., description="Raw text, syllabus, or outline of the lesson")
    target_audience: Optional[str] = Field("General", description="Audience level (e.g. Beginner, Undergraduate, Advanced, Executive)")

class ExtractedConcept(BaseModel):
    key_topic: str
    visual_metaphor: str
    recommended_styles: List[str]
    suggested_prompts: Dict[str, str]
    color_palette: List[str]
    suggested_tags: List[str]

class ConceptExtractionResponse(BaseModel):
    success: bool
    data: ExtractedConcept
    message: Optional[str] = None

class GenerateAssetRequest(BaseModel):
    lesson_title: str
    instructor_name: Optional[str] = "EduVision AI"
    category_tag: Optional[str] = "ACADEMICS"
    prompt: str
    styles: List[str] = Field(default_factory=lambda: ["3D Render", "Photorealistic", "Minimalist Vector", "Cyberpunk / Sci-Fi"])
    aspect_ratios: List[str] = Field(default_factory=lambda: ["16:9", "9:16", "1:1", "4:3"])
    include_text_overlay: bool = True
    overlay_theme: Optional[str] = "dark_modern" # dark_modern, clean_minimal, vibrant_gradient

class FormattedAsset(BaseModel):
    aspect_ratio: str # "16:9", "9:16", "1:1", "4:3"
    label: str # e.g. "YouTube / LMS Thumbnail", "Mobile Story / Reel", "Square Card / Avatar", "Slide / Deck"
    url: str
    width: int
    height: int
    cloudinary_transformations: str

class StyleVariant(BaseModel):
    style_name: str
    base_public_id: str
    base_image_url: str
    generation_prompt: str
    formats: Dict[str, FormattedAsset]
    overlay_applied: bool

class AssetBundleResponse(BaseModel):
    success: bool
    lesson_title: str
    instructor_name: str
    category_tag: str
    variants: List[StyleVariant]
    total_assets_generated: int
    message: Optional[str] = None

class DynamicOverlayRequest(BaseModel):
    public_id: str
    title: str
    subtitle: Optional[str] = None
    instructor_name: Optional[str] = None
    category_tag: Optional[str] = None
    aspect_ratio: str = "16:9"
    theme: str = "dark_modern"

class GenTransformRequest(BaseModel):
    public_id: str
    aspect_ratio: str = "16:9"
    gen_background_prompt: Optional[str] = None
    gen_recolor_prompt: Optional[str] = None
    gen_recolor_to: Optional[str] = None
    gen_restore: bool = False
    title: Optional[str] = None
    instructor_name: Optional[str] = None
    category_tag: Optional[str] = None
    theme: str = "dark_modern"

class ExportBundleRequest(BaseModel):
    lesson_title: str
    variants: List[StyleVariant]

class ExportBundleResponse(BaseModel):
    success: bool
    lesson_title: str
    total_files: int
    manifest: List[Dict[str, Any]]
    download_urls: List[str]

class HealthResponse(BaseModel):
    status: str
    cloudinary_configured: bool
    cloud_name: Optional[str]
    gemini_configured: bool
    version: str = "1.0.0"
