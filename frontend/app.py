import os
import sys
import json
import streamlit as st
import requests
from typing import Dict, List, Any

# Ensure project root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.config import settings
from backend.services.prompt_engine import (
    extract_concept_with_llm,
    build_style_prompts,
    STYLE_PROMPT_MODIFIERS
)
from backend.services.cloudinary_service import cloudinary_service, ASPECT_RATIOS

# Page configuration
st.set_page_config(
    page_title="EduVision | Dynamic Ed-Tech Asset Engine",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load custom CSS
css_path = os.path.join(os.path.dirname(__file__), "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# Session state initialization
if "lesson_title" not in st.session_state:
    st.session_state.lesson_title = "Quantum Computing & Superposition"
if "instructor_name" not in st.session_state:
    st.session_state.instructor_name = "Dr. Elena Vance"
if "category_tag" not in st.session_state:
    st.session_state.category_tag = "QUANTUM PHYSICS"
if "lesson_text" not in st.session_state:
    st.session_state.lesson_text = (
        "An exploration of quantum state vectors, Dirac bra-ket notation, "
        "and multi-qubit entanglement. We analyze quantum logic gates and cryogenic "
        "superconducting qubits operating in absolute zero dilution refrigerators."
    )
if "extracted_concept" not in st.session_state:
    st.session_state.extracted_concept = None
if "generated_bundle" not in st.session_state:
    st.session_state.generated_bundle = None

# Sidebar: Cloudinary & System Status
with st.sidebar:
    st.markdown("### ⚙️ Engine Configuration")
    
    cld_status = cloudinary_service.check_connection()
    if cld_status.get("connected"):
        st.success(f"🟢 Cloudinary Connected\n(`{cld_status.get('cloud_name')}`)")
    else:
        st.warning(f"🟡 Demo Mode Active\nCloud Name: `{cld_status.get('cloud_name')}`")
        with st.expander("🔑 Add API Keys"):
            st.info("Set credentials in `.env` or enter below for live storage:")
            input_cld_name = st.text_input("Cloud Name", value=settings.CLOUDINARY_CLOUD_NAME)
            input_cld_key = st.text_input("API Key", value=settings.CLOUDINARY_API_KEY, type="password")
            input_cld_secret = st.text_input("API Secret", value=settings.CLOUDINARY_API_SECRET, type="password")
            if st.button("Save & Reconnect"):
                os.environ["CLOUDINARY_CLOUD_NAME"] = input_cld_name
                os.environ["CLOUDINARY_API_KEY"] = input_cld_key
                os.environ["CLOUDINARY_API_SECRET"] = input_cld_secret
                st.rerun()

    st.divider()
    st.markdown("### 📚 Quick Curriculum Presets")
    
    presets = {
        "⚛️ Quantum Computing": {
            "title": "Quantum Computing & Superposition",
            "instructor": "Dr. Elena Vance",
            "tag": "QUANTUM PHYSICS",
            "text": "An exploration of quantum state vectors, Dirac bra-ket notation, and multi-qubit entanglement. Analyzing superconducting circuits in cryogenic dilution refrigerators."
        },
        "🧠 Deep Learning & GenAI": {
            "title": "Transformer Models & Generative AI",
            "instructor": "Prof. Marcus Thorne",
            "tag": "AI ARCHITECTURES",
            "text": "Architectural breakdown of self-attention mechanisms, latent diffusion representations, token embeddings, and multi-modal alignment pipelines."
        },
        "🌌 Astrobiology & Exoplanets": {
            "title": "Astrobiology: The Search for Alien Life",
            "instructor": "Dr. Sarah Lin",
            "tag": "SPACE EXPLORATION",
            "text": "Atmospheric spectroscopy of habitable zone exoplanets, organic biosignatures, extremophile biology, and deep celestial nebulae."
        },
        "🏛️ Ancient Civilizations": {
            "title": "Lost Civilizations: The Library of Alexandria",
            "instructor": "Prof. Arthur Pendelton",
            "tag": "WORLD HISTORY",
            "text": "Exploring the greatest intellectual hub of antiquity, architectural marble wonders, ancient mathematical papyrus scrolls, and celestial astrolabes."
        }
    }

    for preset_label, data in presets.items():
        if st.button(preset_label, use_container_width=True):
            st.session_state.lesson_title = data["title"]
            st.session_state.instructor_name = data["instructor"]
            st.session_state.category_tag = data["tag"]
            st.session_state.lesson_text = data["text"]
            st.session_state.extracted_concept = None
            st.session_state.generated_bundle = None
            st.rerun()

    st.divider()
    st.markdown("### 🏆 Hackathon Track")
    st.markdown("""
    **Track 2: Generative Content Workflows**
    - Cloudinary AI Generative Pipeline
    - Generative Style Variations
    - Dynamic On-The-Fly Typography
    - Multi-Device Responsive Crops (`16:9`, `9:16`, `1:1`, `4:3`)
    - Global CDN Delivery Optimization (`f_auto,q_auto`)
    """)

# Main Studio Header
st.markdown("""
<div class="main-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <div class="brand-title">EduVision Studio</div>
            <div class="brand-tagline">Automated AI Media Asset Engine for Course Creators & Educators</div>
        </div>
        <div>
            <span class="track-badge">Cloudinary AI Track 2</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Step 1: Input Curriculum & Concept Extraction
st.markdown("### 📝 Step 1: Lesson Plan & Visual Concept Extraction")
col1, col2 = st.columns([1, 1])

with col1:
    title_val = st.text_input("Course / Lesson Title", value=st.session_state.lesson_title)
    st.session_state.lesson_title = title_val

    c_inst, c_tag = st.columns(2)
    with c_inst:
        inst_val = st.text_input("Instructor / Author", value=st.session_state.instructor_name)
        st.session_state.instructor_name = inst_val
    with c_tag:
        tag_val = st.text_input("Category Tag / Badge", value=st.session_state.category_tag)
        st.session_state.category_tag = tag_val

with col2:
    text_val = st.text_area("Lesson Script / Syllabus / Notes", value=st.session_state.lesson_text, height=125)
    st.session_state.lesson_text = text_val

if st.button("✨ Extract Visual Concepts & Themes", type="primary", use_container_width=True):
    with st.spinner("Analyzing curriculum and extracting visual metaphors..."):
        concept = extract_concept_with_llm(
            title=st.session_state.lesson_title,
            text=st.session_state.lesson_text
        )
        st.session_state.extracted_concept = concept
        st.rerun()

# Display Extracted Concept Metadata
if st.session_state.extracted_concept:
    concept = st.session_state.extracted_concept
    st.markdown("#### 💡 AI Creative Extraction")
    
    c_meta, c_colors = st.columns([2, 1])
    with c_meta:
        st.info(f"**Visual Metaphor:** {concept.visual_metaphor}")
        tags_html = " ".join([f"<span class='track-badge' style='margin-right:6px;'>{t}</span>" for t in concept.suggested_tags])
        st.markdown(f"**Tags:** {tags_html}", unsafe_allow_html=True)
    with c_colors:
        st.markdown("**Suggested Color Palette:**")
        palette_html = "".join([f"<span class='color-swatch' style='background-color:{c};' title='{c}'></span>" for c in concept.color_palette])
        st.markdown(palette_html, unsafe_allow_html=True)

st.divider()

# Step 2: Style Variations & Generation Workflow
st.markdown("### 🎨 Step 2: Style Variations & Asset Generation")

styles_available = list(STYLE_PROMPT_MODIFIERS.keys())
selected_styles = st.multiselect(
    "Choose Generative Style Variations to Produce:",
    options=styles_available,
    default=["3D Render", "Photorealistic", "Minimalist Vector", "Cyberpunk / Sci-Fi"]
)

c_theme, c_overlay = st.columns(2)
with c_theme:
    overlay_theme = st.selectbox("Text Overlay Theme:", ["dark_modern", "clean_minimal", "vibrant_gradient"], index=0)
with c_overlay:
    include_overlay = st.checkbox("Embed Dynamic Typography & Branding (Cloudinary Text Layer)", value=True)

if st.button("🚀 Run Cloudinary Generative Pipeline", type="primary", use_container_width=True):
    if not selected_styles:
        st.error("Please select at least one style variation.")
    else:
        with st.spinner("Generating multi-style asset bundles via Cloudinary AI Pipeline..."):
            # Prepare prompts
            base_prompt = st.session_state.extracted_concept.visual_metaphor if st.session_state.extracted_concept else st.session_state.lesson_title
            style_prompts = {s: f"{base_prompt}, {STYLE_PROMPT_MODIFIERS[s]}" for s in selected_styles}

            bundle = cloudinary_service.generate_asset_bundle(
                lesson_title=st.session_state.lesson_title,
                instructor_name=st.session_state.instructor_name,
                category_tag=st.session_state.category_tag,
                style_prompts=style_prompts,
                aspect_ratios=list(ASPECT_RATIOS.keys()),
                include_text_overlay=include_overlay,
                theme=overlay_theme
            )
            st.session_state.generated_bundle = bundle
            st.success(f"Generated {len(bundle) * len(ASPECT_RATIOS)} dynamic educational assets across {len(bundle)} style variants!")

# Step 3: Multi-Format Asset Studio & Preview
if st.session_state.generated_bundle:
    st.divider()
    st.markdown("### 🖼️ Step 3: Multi-Format Educational Asset Studio")

    # Aspect Ratio Selector Tabs
    ar_tabs = st.tabs([
        "🖥️ 16:9 YouTube / LMS Thumbnail",
        "📱 9:16 Mobile Story & Reel",
        "🔲 1:1 Catalog & Social Card",
        "📊 4:3 Slide & Presentation Deck"
    ])

    ar_keys = ["16:9", "9:16", "1:1", "4:3"]

    for i, tab in enumerate(ar_tabs):
        ar_key = ar_keys[i]
        with tab:
            st.markdown(f"**Format Target:** `{ASPECT_RATIOS[ar_key]['label']}` ({ASPECT_RATIOS[ar_key]['width']}x{ASPECT_RATIOS[ar_key]['height']}px, `f_auto,q_auto`)")
            
            # Show all style variants for this aspect ratio in grid
            cols = st.columns(len(st.session_state.generated_bundle))
            for idx, variant in enumerate(st.session_state.generated_bundle):
                format_asset = variant.formats.get(ar_key)
                with cols[idx]:
                    st.markdown(f"**{variant.style_name}**")
                    if format_asset:
                        st.image(format_asset.url, use_column_width=True)
                        st.markdown(f"[📥 Open Full-Res Asset]({format_asset.url})")
                        with st.expander("🔍 Cloudinary CDN URL & Transformations"):
                            st.code(format_asset.url, language="text")
                            st.markdown(f"**Transformations:** `{format_asset.cloudinary_transformations}`")

    # Cloudinary Track 2 Inspector Panel
    st.divider()
    with st.expander("🛠️ Cloudinary AI Pipeline Technical Inspector (Track 2 Verification)", expanded=False):
        st.markdown("""
        #### How EduVision Leverages Cloudinary APIs:
        1. **AI Image Generation & Style Variations:**
           - Automated generation triggered from syllabus concept extraction.
           - Parallel stylistic variations (`3D Render`, `Photorealistic`, `Vector`, `Cyberpunk`) rendered and cataloged under `eduvision/` asset hierarchy.
        2. **Dynamic Layered Typography (`l_text`):**
           - `l_text:Montserrat_52_bold:{Title}`: Dynamic course title placement.
           - `l_text:Roboto_22_bold:{Instructor}`: Instructor attribution.
           - `l_text:Montserrat_24_bold:{Category}`: Academic badge overlay.
           - `e_gradient_fade`: Contrast scrim behind text for flawless readability.
        3. **Responsive Cropping & Smart Gravity:**
           - `c_fill,g_auto,w_1280,h_720` (16:9 Thumbnail)
           - `c_fill,g_auto,w_720,h_1280` (9:16 Mobile)
           - `c_fill,g_auto,w_1080,h_1080` (1:1 Card)
           - `c_fill,g_auto,w_1024,h_768` (4:3 Deck)
        4. **Autonomous Delivery Optimization:**
           - `f_auto,q_auto`: Automated next-gen AVIF/WebP encoding and perceptual quality optimization.
        """)
