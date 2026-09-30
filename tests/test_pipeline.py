import sys
import os
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.services.prompt_engine import extract_concept_heuristics, build_style_prompts, EDUCATION_PRESETS
from backend.services.cloudinary_service import cloudinary_service, ASPECT_RATIOS, THEME_CONFIGS

class TestEduVisionPhase1(unittest.TestCase):

    def test_concept_extraction_heuristics(self):
        title = "Quantum Computing & Entanglement"
        text = "Deep dive into qubit states and superposition in dilution refrigerators."
        concept = extract_concept_heuristics(title, text)

        self.assertIsNotNone(concept)
        self.assertEqual(concept.key_topic, title)
        self.assertTrue(len(concept.color_palette) >= 3)
        self.assertTrue(len(concept.suggested_prompts) >= 4)
        self.assertIn("3D Render", concept.suggested_prompts)

    def test_audience_aware_prompts_builder(self):
        base = "Floating neural network node with holographic crystal light"
        prompts_beginner = build_style_prompts(base, audience="Beginner")
        prompts_adv = build_style_prompts(base, audience="Advanced")

        self.assertIn("approachable", prompts_beginner["3D Render"])
        self.assertIn("architectural complexity", prompts_adv["3D Render"])

    def test_cloudinary_dynamic_format_url(self):
        formatted = cloudinary_service.build_format_url(
            public_id="cld-sample-4",
            aspect_ratio="16:9",
            title="Quantum Mechanics 101",
            instructor_name="Dr. Elena Vance",
            category_tag="PHYSICS",
            include_text_overlay=True
        )

        self.assertEqual(formatted.aspect_ratio, "16:9")
        self.assertEqual(formatted.width, 1280)
        self.assertEqual(formatted.height, 720)
        self.assertIn("res.cloudinary.com", formatted.url)
        self.assertIn("f_auto", formatted.cloudinary_transformations)
        self.assertIn("q_auto", formatted.cloudinary_transformations)

    def test_cloudinary_genai_transformations(self):
        gen_transforms = cloudinary_service.build_generative_ai_transformations(
            gen_background_prompt="futuristic neon laboratory",
            gen_recolor_prompt="circuits",
            gen_recolor_to="#00F2FE",
            gen_restore=True
        )
        self.assertEqual(len(gen_transforms), 3)
        self.assertTrue(any("gen_background_replace" in str(t) for t in gen_transforms))
        self.assertTrue(any("gen_recolor" in str(t) for t in gen_transforms))
        self.assertTrue(any("gen_restore" in str(t) for t in gen_transforms))

    def test_overlay_themes(self):
        for theme_name in ["dark_modern", "clean_minimal", "vibrant_gradient"]:
            self.assertIn(theme_name, THEME_CONFIGS)
            overlays = cloudinary_service.build_dynamic_overlay_transformations(
                title="Test Course",
                instructor_name="Test Instructor",
                category_tag="TECH",
                theme=theme_name
            )
            self.assertGreater(len(overlays), 3)

    def test_aspect_ratios_supported(self):
        expected_ratios = ["16:9", "9:16", "1:1", "4:3"]
        for ar in expected_ratios:
            self.assertIn(ar, ASPECT_RATIOS)
            spec = ASPECT_RATIOS[ar]
            self.assertGreater(spec["width"], 0)
            self.assertGreater(spec["height"], 0)

    def test_asset_bundle_generation(self):
        prompts = {
            "3D Render": "Quantum qubit sphere in dark cosmic laboratory, 3D render",
            "Minimalist Vector": "Quantum qubit vector graphic, minimalist"
        }
        variants = cloudinary_service.generate_asset_bundle(
            lesson_title="Quantum Physics",
            instructor_name="Dr. Vance",
            category_tag="PHYSICS",
            style_prompts=prompts,
            aspect_ratios=["16:9", "1:1"],
            include_text_overlay=True
        )

        self.assertEqual(len(variants), 2)
        for variant in variants:
            self.assertIn("16:9", variant.formats)
            self.assertIn("1:1", variant.formats)
            self.assertTrue(variant.overlay_applied)

if __name__ == "__main__":
    unittest.main()
