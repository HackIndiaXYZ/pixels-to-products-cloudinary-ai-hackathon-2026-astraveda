import os
import sys
import json
import time
import streamlit as st
import requests
from typing import Dict, List, Any, Optional

# Ensure project root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.config import settings
from backend.services.prompt_engine import (
    extract_concept_with_llm,
    build_style_prompts,
    STYLE_PROMPT_MODIFIERS,
    AUDIENCE_MODIFIERS
)
from backend.services.cloudinary_service import cloudinary_service, ASPECT_RATIOS, THEME_CONFIGS

# 1. Page Configuration
st.set_page_config(
    page_title="EduVision — AI Creative Studio for Education",
    page_icon="✦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 2. Inject CSS Design System
css_path = os.path.join(os.path.dirname(__file__), "style.css")
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# 3. Session State Initialization
if "current_nav" not in st.session_state:
    st.session_state.current_nav = "✦ Studio"
if "lesson_title" not in st.session_state:
    st.session_state.lesson_title = "Quantum Computing & Superposition"
if "instructor_name" not in st.session_state:
    st.session_state.instructor_name = "Dr. Elena Vance"
if "category_tag" not in st.session_state:
    st.session_state.category_tag = "QUANTUM PHYSICS"
if "audience_level" not in st.session_state:
    st.session_state.audience_level = "Advanced"
if "lesson_text" not in st.session_state:
    st.session_state.lesson_text = (
        "Explain quantum superposition, qubits, Dirac notation, and multi-qubit entanglement. "
        "Analyze quantum logic gates and cryogenic superconducting qubits operating in dilution refrigerators."
    )
if "extracted_concept" not in st.session_state:
    st.session_state.extracted_concept = None
if "selected_style" not in st.session_state:
    st.session_state.selected_style = "3D Scientific"
if "selected_theme" not in st.session_state:
    st.session_state.selected_theme = "dark_modern"
if "selected_aspect_ratio" not in st.session_state:
    st.session_state.selected_aspect_ratio = "16:9"
if "generated_bundle" not in st.session_state:
    st.session_state.generated_bundle = None
if "selected_asset_variant" not in st.session_state:
    st.session_state.selected_asset_variant = None
if "custom_tags" not in st.session_state:
    st.session_state.custom_tags = ["QUANTUM COMPUTING", "SUPERPOSITION", "QUBIT", "PROBABILITY", "SCIENTIFIC", "FUTURISTIC"]
if "saved_asset_library" not in st.session_state:
    st.session_state.saved_asset_library = []

# Style definition mapping for UI
STYLE_CARDS = {
    "3D Scientific": {
        "icon": "⚛️",
        "desc": "High-detail educational 3D with raytraced lighting",
        "modifier": "cinema4D 3D render, octane render, clean ambient occlusion, vibrant volumetric lighting, hyper-detailed textures, raytraced, 8k resolution"
    },
    "Minimal Editorial": {
        "icon": "📐",
        "desc": "Clean academic illustration & elegant vector shapes",
        "modifier": "clean minimalist flat vector art, bold harmonious color palette, elegant geometric silhouettes, modern infographic aesthetic, crisp vector lines"
    },
    "Futuristic": {
        "icon": "🔮",
        "desc": "Immersive neon cyber technology aesthetic",
        "modifier": "neon cyberpunk aesthetics, vibrant cyan and magenta glowing accents, dark moody metallic backdrop, raytraced reflections, high-tech interface vibes"
    },
    "Vector Educational": {
        "icon": "📊",
        "desc": "Flat educational infographic diagrams & crisp silhouettes",
        "modifier": "clean instructional flat vector graphics, high clarity typography layout, harmonious modern academic colors"
    },
    "Photorealistic": {
        "icon": "📷",
        "desc": "Real-world visual storytelling & studio photography",
        "modifier": "high-end editorial studio photography, dramatic lighting, sharp focus, 85mm f/1.4 lens, ultra-detailed textures, award-winning composition"
    }
}

PRESETS = {
    "⚛️ Quantum Computing": {
        "title": "Quantum Computing & Superposition",
        "instructor": "Dr. Elena Vance",
        "tag": "QUANTUM PHYSICS",
        "audience": "Advanced",
        "text": "Explain quantum superposition, qubits, Dirac notation, and multi-qubit entanglement. Analyze quantum logic gates and cryogenic superconducting qubits operating in dilution refrigerators."
    },
    "🧠 Deep Neural Networks": {
        "title": "Transformer Models & Generative AI",
        "instructor": "Prof. Marcus Thorne",
        "tag": "AI ARCHITECTURES",
        "audience": "Advanced",
        "text": "Comprehensive breakdown of multi-head self-attention mechanisms, latent diffusion representations, token embeddings, and foundational model fine-tuning."
    },
    "🌌 Astrobiology & Exoplanets": {
        "title": "Astrobiology: The Search for Alien Life",
        "instructor": "Dr. Sarah Lin",
        "tag": "SPACE EXPLORATION",
        "audience": "Undergraduate",
        "text": "Detecting atmospheric biosignatures on habitable zone exoplanets using James Webb spectroscopy. Planetary geological cycles and extremophile lifeforms."
    },
    "🏛️ Ancient Civilizations": {
        "title": "Lost Civilizations: The Library of Alexandria",
        "instructor": "Prof. Arthur Pendelton",
        "tag": "WORLD HISTORY",
        "audience": "Beginner",
        "text": "Exploring the greatest intellectual hub of antiquity, architectural marble wonders, Archimedean mechanics, and illuminated ancient parchment scrolls."
    },
    "🔗 Web3 & Cryptography": {
        "title": "Decentralized Systems & Cryptography",
        "instructor": "Alex Rivera",
        "tag": "BLOCKCHAIN TECH",
        "audience": "Executive",
        "text": "Zero-knowledge proofs, consensus mechanisms, Byzantine fault tolerance, and smart contract architecture in decentralized state machines."
    }
}

# 4. Persistent Left Sidebar Navigation
cld_status = cloudinary_service.check_connection()
is_cld_connected = cld_status.get("connected", False)
cloud_name_label = cld_status.get("cloud_name", "demo")

with st.sidebar:
    st.markdown("""
    <div class="sidebar-brand">
        <div class="sidebar-logo">✦ EDUVISION</div>
        <div class="sidebar-subtitle">AI Creative Studio for Education</div>
    </div>
    """, unsafe_allow_html=True)

    nav_options = ["✦ Studio", "◇ Brief", "◉ Generate", "▧ Assets", "↗ Export"]
    selected_nav = st.radio("Navigation", nav_options, index=nav_options.index(st.session_state.current_nav), label_visibility="collapsed")
    st.session_state.current_nav = selected_nav

    st.markdown("<div style='height: 24px;'></div>", unsafe_allow_html=True)
    st.markdown("<div style='font-size:0.75rem; font-weight:700; color:#64748B; letter-spacing:1px; margin-bottom:8px;'>CLOUDINARY PIPELINE</div>", unsafe_allow_html=True)

    if is_cld_connected:
        st.markdown(f"""
        <div class="status-pill">
            <span class="status-dot"></span>
            <span>Connected ({cloud_name_label})</span>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div class="status-pill demo">
            <span class="status-dot"></span>
            <span>DEMO MODE (Demo Asset CDN)</span>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("""
    <div style="margin-top: 10px; font-size: 0.8rem; color: #94A3B8;">
        Track: <strong style="color: #00F2FE;">TRACK 02 — Generative Workflows</strong>
    </div>
    """, unsafe_allow_html=True)

    with st.expander("⚙️ Credentials & Cloud Name"):
        st.caption("Cloudinary is pre-configured or running high-fidelity demo fallback.")
        in_cld = st.text_input("Cloud Name", value=settings.CLOUDINARY_CLOUD_NAME)
        in_key = st.text_input("API Key", value=settings.CLOUDINARY_API_KEY, type="password")
        in_sec = st.text_input("API Secret", value=settings.CLOUDINARY_API_SECRET, type="password")
        if st.button("Save & Update Cloud"):
            os.environ["CLOUDINARY_CLOUD_NAME"] = in_cld
            os.environ["CLOUDINARY_API_KEY"] = in_key
            os.environ["CLOUDINARY_API_SECRET"] = in_sec
            st.rerun()

    st.markdown("<div style='height: 36px;'></div>", unsafe_allow_html=True)
    st.markdown("""
    <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
        <div style="font-weight: 700; font-size: 0.82rem; color: #F8FAFC;">ASTRAVEDA</div>
        <div style="font-size: 0.74rem; color: #64748B;">AI Media Infrastructure</div>
    </div>
    """, unsafe_allow_html=True)

# 5. Top Bar Header
top_col1, top_col2 = st.columns([1, 1])
with top_col1:
    page_name = st.session_state.current_nav.replace("✦ ", "").replace("◇ ", "").replace("◉ ", "").replace("▧ ", "").replace("↗ ", "")
    st.markdown(f"""
    <div class="top-bar-left">
        <span style="font-size: 1.15rem; font-weight: 800; color: #F8FAFC;">EDUVISION</span>
        <span style="color: #64748B;">/</span>
        <span style="font-size: 0.95rem; font-weight: 600; color: #00F2FE;">{page_name}</span>
    </div>
    """, unsafe_allow_html=True)

with top_col2:
    status_text = f"● Cloudinary Pipeline Connected" if is_cld_connected else "● Cloudinary Pipeline Demo Mode"
    status_class = "status-pill" if is_cld_connected else "status-pill demo"
    st.markdown(f"""
    <div style="display: flex; justify-content: flex-end; align-items: center; gap: 14px;">
        <div class="{status_class}">
            <span class="status-dot"></span>
            <span>{status_text}</span>
        </div>
        <div class="team-badge">ASTRAVEDA · TRACK 02</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

# ==============================================================================
# VIEW 1: STUDIO (MAIN WORKSPACE) & VIEW 2: BRIEF
# ==============================================================================
if st.session_state.current_nav in ["✦ Studio", "◇ Brief"]:
    # Hero Section
    st.markdown("""
    <div class="hero-box">
        <div class="hero-tag">AI CREATIVE ENGINE</div>
        <div class="hero-heading">Create educational visuals</div>
        <div class="hero-subtitle">Turn your lesson into a complete visual asset system in seconds.</div>
    </div>
    """, unsafe_allow_html=True)

    # 1. Lesson Brief Card
    st.markdown("<div class='studio-card'>", unsafe_allow_html=True)
    st.markdown("""
    <div class="card-title-bar">
        <div>
            <div class="card-title">What are you teaching?</div>
            <div class="card-subtitle">Input your curriculum, topic, or lecture notes for AI concept synthesis.</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    b_col1, b_col2 = st.columns([1, 1])
    with b_col1:
        st.session_state.lesson_title = st.text_input(
            "Course Title",
            value=st.session_state.lesson_title,
            placeholder="e.g. Quantum Computing & Superposition"
        )
        c_i, c_a = st.columns(2)
        with c_i:
            st.session_state.instructor_name = st.text_input(
                "Instructor Name",
                value=st.session_state.instructor_name,
                placeholder="e.g. Dr. Elena Vance"
            )
        with c_a:
            st.session_state.audience_level = st.selectbox(
                "Audience Level",
                ["Beginner", "Undergraduate", "Advanced", "Executive"],
                index=["Beginner", "Undergraduate", "Advanced", "Executive"].index(st.session_state.audience_level)
            )

    with b_col2:
        st.session_state.lesson_text = st.text_area(
            "Lesson Content / Notes",
            value=st.session_state.lesson_text,
            height=130,
            placeholder="Explain the core concepts, mechanisms, and key pedagogical takeaways..."
        )

    btn_col1, btn_col2 = st.columns([2, 1])
    with btn_col1:
        extract_clicked = st.button("✦ Extract Visual Direction", type="primary", use_container_width=True)
    with btn_col2:
        preset_choice = st.selectbox("Use Example Preset", list(PRESETS.keys()), label_visibility="collapsed")
        if st.button("Load Example", use_container_width=True):
            preset_data = PRESETS[preset_choice]
            st.session_state.lesson_title = preset_data["title"]
            st.session_state.instructor_name = preset_data["instructor"]
            st.session_state.category_tag = preset_data["tag"]
            st.session_state.audience_level = preset_data["audience"]
            st.session_state.lesson_text = preset_data["text"]
            st.session_state.extracted_concept = None
            st.session_state.generated_bundle = None
            st.rerun()

    st.markdown("</div>", unsafe_allow_html=True)

    # Trigger concept extraction
    if extract_clicked:
        with st.spinner("Analyzing lesson content and synthesizing visual metaphors..."):
            concept = extract_concept_with_llm(
                title=st.session_state.lesson_title,
                text=st.session_state.lesson_text,
                audience=st.session_state.audience_level
            )
            st.session_state.extracted_concept = concept
            st.session_state.custom_tags = concept.suggested_tags + ["SCIENTIFIC", "PRECISION"]
            st.rerun()

    # 2. AI Creative Direction Card (Rendered if concept is extracted)
    if st.session_state.extracted_concept:
        concept = st.session_state.extracted_concept
        st.markdown("<div class='studio-card'>", unsafe_allow_html=True)
        st.markdown(f"""
        <div class="card-title-bar">
            <div>
                <div class="card-title">AI Creative Direction</div>
                <div class="card-subtitle">Synthesized from your educational brief for generative prompting.</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown(f"""
        <div class="direction-grid">
            <div class="direction-cell">
                <div class="direction-label">Visual Concept</div>
                <div class="direction-value">{st.session_state.lesson_title} rendered as dynamic knowledge nexus</div>
            </div>
            <div class="direction-cell">
                <div class="direction-label">Visual Metaphor</div>
                <div class="direction-value">{concept.visual_metaphor}</div>
            </div>
            <div class="direction-cell">
                <div class="direction-label">Subject & Focus</div>
                <div class="direction-value">{concept.key_topic} Core Architecture</div>
            </div>
            <div class="direction-cell">
                <div class="direction-label">Composition & Mood</div>
                <div class="direction-value">Centrally focused · Scientific · Futuristic · Precise</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<div style='margin-top: 18px;'><span style='font-size:0.75rem; font-weight:700; color:#64748B; letter-spacing:1px;'>TAG SYSTEM CHIPS:</span></div>", unsafe_allow_html=True)
        chips_html = "".join([f"<span class='tag-chip'>#{tag}</span>" for tag in st.session_state.custom_tags])
        st.markdown(f"<div class='tag-container'>{chips_html}</div>", unsafe_allow_html=True)

        st.markdown("<div style='margin-top: 16px;'><span style='font-size:0.75rem; font-weight:700; color:#64748B; letter-spacing:1px;'>CURATED COLOR PALETTE:</span></div>", unsafe_allow_html=True)
        swatches_html = "".join([f"<div class='palette-circle' style='background-color:{c};' title='{c}'></div>" for c in concept.color_palette])
        st.markdown(f"<div class='palette-swatch-box'>{swatches_html}</div>", unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)

    # 3. Style Selector Section
    st.markdown("<div class='studio-card'>", unsafe_allow_html=True)
    st.markdown("""
    <div class="card-title-bar">
        <div>
            <div class="card-title">Choose your visual language</div>
            <div class="card-subtitle">Select the artistic model style for Cloudinary generative rendering.</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    s_cols = st.columns(len(STYLE_CARDS))
    for idx, (style_key, style_data) in enumerate(STYLE_CARDS.items()):
        with s_cols[idx]:
            is_active = (st.session_state.selected_style == style_key)
            active_class = "active" if is_active else ""
            checkmark = "✓ " if is_active else ""
            st.markdown(f"""
            <div class="style-card {active_class}">
                <div class="style-card-icon">{style_data['icon']}</div>
                <div class="style-card-title">{checkmark}{style_key}</div>
                <div class="style-card-desc">{style_data['desc']}</div>
            </div>
            """, unsafe_allow_html=True)
            if st.button(f"Select {style_key}", key=f"btn_sel_style_{idx}", use_container_width=True):
                st.session_state.selected_style = style_key
                st.rerun()

    st.markdown("</div>", unsafe_allow_html=True)

    # 4. Large Generation CTA Button
    st.markdown("<div style='margin: 32px 0;'>", unsafe_allow_html=True)
    if st.button("✦ Generate with Cloudinary", type="primary", use_container_width=True):
        st.session_state.current_nav = "◉ Generate"
        st.rerun()

    st.markdown("""
    <div style="text-align: center; font-size: 0.84rem; color: #64748B; margin-top: 8px;">
        4 visual variations · AI generative pipeline · dynamic overlays · optimized delivery (f_auto, q_auto)
    </div>
    </div>
    """, unsafe_allow_html=True)

# ==============================================================================
# VIEW 3: GENERATE (ANIMATED PIPELINE & 4-VARIATION GALLERY)
# ==============================================================================
if st.session_state.current_nav == "◉ Generate":
    st.markdown("""
    <div class="hero-box">
        <div class="hero-tag">CLOUDINARY AI WORKFLOW</div>
        <div class="hero-heading">Generating your visual system</div>
        <div class="hero-subtitle">Cloudinary AI is creating multiple visual directions for your lesson.</div>
    </div>
    """, unsafe_allow_html=True)

    # Pipeline Stepper
    st.markdown("""
    <div class="pipeline-stepper">
        <div class="pipeline-step completed">
            <div class="pipeline-step-node">✓</div>
            <div>AI UNDERSTANDING</div>
        </div>
        <div style="color:#64748B;">→</div>
        <div class="pipeline-step completed">
            <div class="pipeline-step-node">✓</div>
            <div>VISUAL PROMPT</div>
        </div>
        <div style="color:#64748B;">→</div>
        <div class="pipeline-step completed">
            <div class="pipeline-step-node">✓</div>
            <div>CLOUDINARY AI</div>
        </div>
        <div style="color:#64748B;">→</div>
        <div class="pipeline-step completed">
            <div class="pipeline-step-node">✓</div>
            <div>VARIATIONS</div>
        </div>
        <div style="color:#64748B;">→</div>
        <div class="pipeline-step completed">
            <div class="pipeline-step-node">✓</div>
            <div>TRANSFORM</div>
        </div>
        <div style="color:#64748B;">→</div>
        <div class="pipeline-step completed">
            <div class="pipeline-step-node">✓</div>
            <div>OPTIMIZE</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Trigger Generation if not generated yet
    if not st.session_state.generated_bundle:
        with st.spinner("Cloudinary AI pipeline executing: Generating 4 stylistic variants and multi-aspect formats..."):
            base_prompt = st.session_state.extracted_concept.visual_metaphor if st.session_state.extracted_concept else st.session_state.lesson_title
            
            selected_4_styles = ["3D Scientific", "Photorealistic", "Minimal Editorial", "Futuristic"]
            style_prompts = {
                s: f"{base_prompt}, {STYLE_CARDS.get(s, {}).get('modifier', '')}"
                for s in selected_4_styles
            }

            bundle = cloudinary_service.generate_asset_bundle(
                lesson_title=st.session_state.lesson_title,
                instructor_name=st.session_state.instructor_name,
                category_tag=st.session_state.category_tag,
                style_prompts=style_prompts,
                aspect_ratios=list(ASPECT_RATIOS.keys()),
                include_text_overlay=True,
                theme=st.session_state.selected_theme
            )
            st.session_state.generated_bundle = bundle
            st.session_state.selected_asset_variant = bundle[0]

    # 4 Generated Variations Cards Grid
    st.markdown("<div class='studio-card'>", unsafe_allow_html=True)
    st.markdown("""
    <div class="card-title-bar">
        <div>
            <div class="card-title">Choose your visual direction</div>
            <div class="card-subtitle">Click on any variation to open in the professional Asset Canvas Studio.</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    var_cols = st.columns(len(st.session_state.generated_bundle))
    for idx, variant in enumerate(st.session_state.generated_bundle):
        with var_cols[idx]:
            format_16_9 = variant.formats.get("16:9")
            img_url = format_16_9.url if format_16_9 else variant.base_image_url
            st.image(img_url, use_column_width=True)
            
            st.markdown(f"""
            <div style="padding: 10px 0;">
                <div style="font-weight: 700; font-size: 0.95rem; color: #F8FAFC;">{variant.style_name}</div>
                <div style="font-size: 0.76rem; color: #00F2FE; font-family: 'JetBrains Mono', monospace;">Cloudinary GenAI Base</div>
            </div>
            """, unsafe_allow_html=True)

            if st.button("✦ Edit in Canvas", key=f"edit_var_{idx}", type="primary", use_container_width=True):
                st.session_state.selected_asset_variant = variant
                st.session_state.current_nav = "✦ Studio"
                st.rerun()

            st.markdown(f"<a href='{img_url}' target='_blank' style='display:block; text-align:center; font-size:0.78rem; color:#64748B; margin-top:6px;'>Open Full-Res CDN ↗</a>", unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)

# ==============================================================================
# VIEW 4: ASSET CANVAS & INSPECTOR WORKSPACE (CANVA x LINEAR STUDIO)
# ==============================================================================
if st.session_state.selected_asset_variant:
    current_var = st.session_state.selected_asset_variant
    
    st.divider()
    st.markdown("""
    <div class="card-title-bar">
        <div>
            <div class="card-title">Asset Canvas & Cloudinary Inspector</div>
            <div class="card-subtitle">Real-time dynamic overlays, responsive smart crops, and global CDN delivery tuning.</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    tool_col, canvas_col, inspect_col = st.columns([1, 2.4, 1.2])

    # Left: Tool Controls
    with tool_col:
        st.markdown("<div class='toolbar-panel'>", unsafe_allow_html=True)
        st.markdown("<div style='font-size:0.8rem; font-weight:700; color:#00F2FE; letter-spacing:1px; margin-bottom:12px;'>CANVAS TOOLS</div>", unsafe_allow_html=True)

        st.caption("Aspect Ratio Format")
        ar_selection = st.radio(
            "Aspect Ratio",
            ["16:9", "4:3", "1:1", "9:16"],
            index=["16:9", "4:3", "1:1", "9:16"].index(st.session_state.selected_aspect_ratio),
            label_visibility="collapsed"
        )
        st.session_state.selected_aspect_ratio = ar_selection

        st.caption("Dynamic Typography Theme")
        theme_sel = st.selectbox(
            "Overlay Theme",
            list(THEME_CONFIGS.keys()),
            index=list(THEME_CONFIGS.keys()).index(st.session_state.selected_theme),
            label_visibility="collapsed"
        )
        if theme_sel != st.session_state.selected_theme:
            st.session_state.selected_theme = theme_sel
            st.rerun()

        toggle_overlay = st.checkbox("Layer Dynamic Text (l_text)", value=True)
        
        st.caption("GenAI Background Replace")
        gen_bg_prompt = st.text_input("Custom BG Prompt", placeholder="e.g. quantum cyber lab")

        st.markdown("</div>", unsafe_allow_html=True)

    # Center: Large Viewport Canvas
    with canvas_col:
        st.markdown("<div class='canvas-viewport'>", unsafe_allow_html=True)
        
        # Build live transformed URL based on controls
        current_format = cloudinary_service.build_format_url(
            public_id=current_var.base_public_id,
            aspect_ratio=st.session_state.selected_aspect_ratio,
            title=st.session_state.lesson_title if toggle_overlay else None,
            instructor_name=st.session_state.instructor_name if toggle_overlay else None,
            category_tag=st.session_state.category_tag if toggle_overlay else None,
            include_text_overlay=toggle_overlay,
            theme=st.session_state.selected_theme,
            gen_background_prompt=gen_bg_prompt if gen_bg_prompt else None
        )

        st.image(current_format.url, use_column_width=True)
        
        st.markdown(f"""
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
            <div style="font-size: 0.82rem; color: #CBD5E1;">Format: <strong style="color:#00F2FE;">{ASPECT_RATIOS[st.session_state.selected_aspect_ratio]['label']}</strong></div>
            <div style="font-family:'JetBrains Mono', monospace; font-size: 0.8rem; color: #94A3B8;">{current_format.width} x {current_format.height}px · f_auto,q_auto</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)

    # Right: Asset Inspector
    with inspect_col:
        st.markdown("<div class='inspector-panel'>", unsafe_allow_html=True)
        st.markdown("<div style='font-size:0.8rem; font-weight:700; color:#00F2FE; letter-spacing:1px; margin-bottom:12px;'>ASSET INSPECTOR</div>", unsafe_allow_html=True)

        st.markdown(f"""
        <div class="inspector-row">
            <span class="inspector-label">Target Format</span>
            <span class="inspector-value">{st.session_state.selected_aspect_ratio}</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-label">Resolution</span>
            <span class="inspector-value">{current_format.width}x{current_format.height}px</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-label">Course Title</span>
            <span class="inspector-value" style="color:#22C55E;">✓ Enabled</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-label">Instructor Badge</span>
            <span class="inspector-value" style="color:#22C55E;">✓ Enabled</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-label">Smart Auto-Crop</span>
            <span class="inspector-value" style="color:#22C55E;">✓ c_fill,g_auto</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-label">Format Delivery</span>
            <span class="inspector-value" style="color:#22C55E;">✓ f_auto (AVIF/WebP)</span>
        </div>
        <div class="inspector-row">
            <span class="inspector-label">Quality Delivery</span>
            <span class="inspector-value" style="color:#22C55E;">✓ q_auto:good</span>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<div style='margin-top: 18px;'>", unsafe_allow_html=True)
        if st.button("💾 Save to Asset Library", use_container_width=True):
            st.session_state.saved_asset_library.append({
                "title": st.session_state.lesson_title,
                "style": current_var.style_name,
                "format": st.session_state.selected_aspect_ratio,
                "url": current_format.url,
                "date": time.strftime("%Y-%m-%d %H:%M")
            })
            st.success("Asset saved to library!")

        if st.button("↗ Proceed to Export Hub", type="primary", use_container_width=True):
            st.session_state.current_nav = "↗ Export"
            st.rerun()

        st.markdown("</div></div>", unsafe_allow_html=True)

    # Cloudinary Technical Pipeline Drawer (Track 2 Verification Modal)
    with st.expander("🛠️ View Cloudinary Pipeline Deep Graph (Track 2 Verification) →"):
        st.markdown("""
        <div class="cld-drawer">
            <div style="font-weight: 800; font-size: 1.1rem; color: #F8FAFC; margin-bottom: 4px;">CLOUDINARY PIPELINE ARCHITECTURE</div>
            <div style="font-size: 0.84rem; color: #94A3B8;">End-to-End Media Lifecycle Execution for Track 2</div>
            
            <div class="cld-node-grid">
                <div class="cld-node-card">
                    <div class="cld-node-header">GEN_AI</div>
                    <div class="cld-node-desc">AI-generated educational visual base from lesson prompts</div>
                </div>
                <div class="cld-node-card">
                    <div class="cld-node-header">GENERATIVE VARIATIONS</div>
                    <div class="cld-node-desc">4 stylistic directions: 3D, Photorealistic, Vector, Cyberpunk</div>
                </div>
                <div class="cld-node-card">
                    <div class="cld-node-header">TEXT TRANSFORMATION</div>
                    <div class="cld-node-desc">Dynamic course title, instructor, and badge overlays (l_text)</div>
                </div>
                <div class="cld-node-card">
                    <div class="cld-node-header">RESPONSIVE CROP</div>
                    <div class="cld-node-desc">Smart content-aware gravity cropping (c_fill, g_auto)</div>
                </div>
                <div class="cld-node-card">
                    <div class="cld-node-header">f_auto & q_auto</div>
                    <div class="cld-node-desc">Automatic AVIF/WebP negotiation & perceptual compression</div>
                </div>
                <div class="cld-node-card">
                    <div class="cld-node-header">GLOBAL DELIVERY</div>
                    <div class="cld-node-desc">High-speed worldwide Cloudinary CDN edge distribution</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

# ==============================================================================
# VIEW 5: ASSET LIBRARY
# ==============================================================================
if st.session_state.current_nav == "▧ Assets":
    st.markdown("""
    <div class="hero-box">
        <div class="hero-tag">ASSET REPOSITORY</div>
        <div class="hero-heading">Your Asset Library</div>
        <div class="hero-subtitle">Catalog of all AI-generated educational visuals and format variants.</div>
    </div>
    """, unsafe_allow_html=True)

    if not st.session_state.saved_asset_library and not st.session_state.generated_bundle:
        st.markdown("""
        <div class="studio-card" style="text-align: center; padding: 48px;">
            <div style="font-size: 2.2rem; color: #00F2FE; margin-bottom: 12px;">✦</div>
            <div style="font-size: 1.15rem; font-weight: 700; color: #F8FAFC; margin-bottom: 6px;">Your visual workspace is empty.</div>
            <div style="font-size: 0.88rem; color: #64748B; margin-bottom: 20px;">Generate your first lesson visual asset bundle in Studio.</div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("✦ Create your first asset →", type="primary"):
            st.session_state.current_nav = "✦ Studio"
            st.rerun()
    else:
        lib_items = st.session_state.saved_asset_library
        if not lib_items and st.session_state.generated_bundle:
            # Populate with current bundle if library is empty
            for v in st.session_state.generated_bundle:
                f = v.formats.get("16:9")
                if f:
                    lib_items.append({
                        "title": st.session_state.lesson_title,
                        "style": v.style_name,
                        "format": "16:9",
                        "url": f.url,
                        "date": "Just now"
                    })

        l_cols = st.columns(3)
        for idx, item in enumerate(lib_items):
            with l_cols[idx % 3]:
                st.markdown("<div class='studio-card-elevated'>", unsafe_allow_html=True)
                st.image(item["url"], use_column_width=True)
                st.markdown(f"""
                <div style="margin-top: 10px;">
                    <div style="font-weight: 700; font-size: 0.95rem; color: #F8FAFC;">{item['title']}</div>
                    <div style="font-size: 0.78rem; color: #00F2FE; font-family:'JetBrains Mono', monospace;">{item['style']} · {item['format']}</div>
                    <div style="font-size: 0.74rem; color: #64748B; margin-top: 4px;">Created: {item['date']}</div>
                </div>
                """, unsafe_allow_html=True)
                st.markdown(f"<a href='{item['url']}' target='_blank' style='display:block; text-align:center; font-size:0.8rem; color:#38BDF8; margin-top:8px;'>Open CDN URL ↗</a>", unsafe_allow_html=True)
                st.markdown("</div>", unsafe_allow_html=True)

# ==============================================================================
# VIEW 6: EXPORT & PLATFORM DISTRIBUTION HUB
# ==============================================================================
if st.session_state.current_nav == "↗ Export":
    st.markdown("""
    <div class="hero-box">
        <div class="hero-tag">DISTRIBUTION HUB</div>
        <div class="hero-heading">Your asset system is ready.</div>
        <div class="hero-subtitle">Multi-format educational bundles ready for LMS, YouTube, mobile, and presentation decks.</div>
    </div>
    """, unsafe_allow_html=True)

    if not st.session_state.generated_bundle:
        st.warning("No generated assets found. Return to Studio to generate your first asset bundle.")
        if st.button("Go to Studio"):
            st.session_state.current_nav = "✦ Studio"
            st.rerun()
    else:
        # 4 Responsive Formats Grid
        active_var = st.session_state.selected_asset_variant or st.session_state.generated_bundle[0]
        
        st.markdown("<div class='studio-card'>", unsafe_allow_html=True)
        st.markdown(f"""
        <div class="card-title-bar">
            <div>
                <div class="card-title">Production Formats for '{st.session_state.lesson_title}'</div>
                <div class="card-subtitle">Serving style: <strong>{active_var.style_name}</strong> via Cloudinary f_auto, q_auto</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        exp_cols = st.columns(4)
        for idx, (ar_key, spec) in enumerate(ASPECT_RATIOS.items()):
            with exp_cols[idx]:
                fmt = cloudinary_service.build_format_url(
                    public_id=active_var.base_public_id,
                    aspect_ratio=ar_key,
                    title=st.session_state.lesson_title,
                    instructor_name=st.session_state.instructor_name,
                    category_tag=st.session_state.category_tag,
                    include_text_overlay=True,
                    theme=st.session_state.selected_theme
                )
                st.image(fmt.url, use_column_width=True)
                st.markdown(f"""
                <div style="text-align: center; margin-top: 8px;">
                    <div style="font-weight: 700; font-size: 0.88rem; color: #F8FAFC;">{ar_key} {spec['label'].split('(')[0]}</div>
                    <div style="font-size: 0.76rem; color: #94A3B8; font-family:'JetBrains Mono', monospace;">{spec['width']}x{spec['height']}px</div>
                </div>
                """, unsafe_allow_html=True)
                st.markdown(f"<a href='{fmt.url}' target='_blank' style='display:block; text-align:center; font-size:0.78rem; color:#00F2FE; margin-top:4px;'>Download Full-Res ↗</a>", unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)

        # Batch Export Action Cards
        st.markdown("<div class='studio-card-elevated'>", unsafe_allow_html=True)
        st.markdown("<div class='card-title' style='margin-bottom: 14px;'>Export Manifest & Distribution URLs</div>", unsafe_allow_html=True)
        
        manifest_data = []
        for variant in st.session_state.generated_bundle:
            for ar, f_asset in variant.formats.items():
                manifest_data.append({
                    "course_title": st.session_state.lesson_title,
                    "instructor": st.session_state.instructor_name,
                    "style": variant.style_name,
                    "aspect_ratio": ar,
                    "resolution": f"{f_asset.width}x{f_asset.height}",
                    "cloudinary_url": f_asset.url,
                    "transformations": f_asset.cloudinary_transformations
                })

        d_col1, d_col2, d_col3 = st.columns(3)
        with d_col1:
            st.download_button(
                label="💾 Download Manifest JSON",
                data=json.dumps(manifest_data, indent=2),
                file_name=f"eduvision_{st.session_state.lesson_title.replace(' ', '_').lower()}_manifest.json",
                mime="application/json",
                use_container_width=True
            )
        with d_col2:
            urls_plain = "\n".join([item["cloudinary_url"] for item in manifest_data])
            st.download_button(
                label="📋 Download CDN URLs List",
                data=urls_plain,
                file_name="eduvision_cdn_urls.txt",
                mime="text/plain",
                use_container_width=True
            )
        with d_col3:
            if st.button("✦ Generate Another Variation", use_container_width=True):
                st.session_state.generated_bundle = None
                st.session_state.current_nav = "✦ Studio"
                st.rerun()

        st.markdown("</div>", unsafe_allow_html=True)
