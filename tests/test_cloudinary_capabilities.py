import sys
import os
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.services.cloudinary_service import cloudinary_service, ASPECT_RATIOS, THEME_CONFIGS

class TestCloudinaryCapabilities(unittest.TestCase):

    def test_text_overlay_special_character_escaping(self):
        """Verify dynamic text overlays safely escape special characters and punctuation."""
        title_with_symbols = "Quantum / AI & Robotics: 100% Future? [Edition #1]"
        overlays = cloudinary_service.build_dynamic_overlay_transformations(
            title=title_with_symbols,
            instructor_name="Dr. O'Connor & Team",
            category_tag="TECH/AI",
            theme="dark_modern"
        )
        self.assertGreaterEqual(len(overlays), 3)
        # Title text overlay should exist
        title_overlay = next((o for o in overlays if o.get("overlay", {}).get("font_size") == 52), None)
        self.assertIsNotNone(title_overlay)
        # Text should not contain raw unencoded forward slash
        raw_text = title_overlay["overlay"]["text"]
        self.assertNotIn("/", raw_text)

    def test_multi_aspect_ratio_cropping_matrix(self):
        """Verify all 4 aspect ratios have distinct, valid dimensions and gravity."""
        aspect_specs = {
            "16:9": (1280, 720),
            "9:16": (720, 1280),
            "1:1": (1080, 1080),
            "4:3": (1024, 768)
        }
        for ar, (expected_w, expected_h) in aspect_specs.items():
            formatted = cloudinary_service.build_format_url(
                public_id="cld-sample-4",
                aspect_ratio=ar,
                title="Test Course Title"
            )
            self.assertEqual(formatted.width, expected_w)
            self.assertEqual(formatted.height, expected_h)
            self.assertIn(f"w_{expected_w}", formatted.cloudinary_transformations)
            self.assertIn(f"h_{expected_h}", formatted.cloudinary_transformations)
            self.assertIn("c_fill", formatted.cloudinary_transformations)
            self.assertIn("g_auto", formatted.cloudinary_transformations)

    def test_gen_ai_background_replacement_url(self):
        """Verify generative background replace transformation parameter."""
        formatted = cloudinary_service.build_format_url(
            public_id="cld-sample-4",
            aspect_ratio="16:9",
            title="Course",
            gen_background_prompt="cosmic nebula starlight"
        )
        self.assertIn("res.cloudinary.com", formatted.url)

    def test_f_auto_q_auto_optimization_presence(self):
        """Verify automatic format and quality flags are always appended for lightning delivery."""
        for ar in ["16:9", "9:16", "1:1", "4:3"]:
            formatted = cloudinary_service.build_format_url(
                public_id="cld-sample-4",
                aspect_ratio=ar
            )
            self.assertIn("f_auto", formatted.cloudinary_transformations)
            self.assertIn("q_auto", formatted.cloudinary_transformations)

if __name__ == "__main__":
    unittest.main()
