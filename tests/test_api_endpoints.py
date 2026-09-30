import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app

class TestEduVisionAPIEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_endpoint(self):
        """Test GET / returns project metadata and status."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["project"], "EduVision: Ed-Tech Dynamic Asset Engine")
        self.assertEqual(data["team"], "ASTRAVEDA")

    def test_health_endpoint(self):
        """Test GET /api/health returns valid status and configuration flags."""
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("cloudinary_configured", data)
        self.assertIn("version", data)

    def test_styles_endpoint(self):
        """Test GET /api/styles returns supported style modifiers."""
        response = self.client.get("/api/styles")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("styles", data)
        self.assertIn("3D Render", data["styles"])
        self.assertIn("Photorealistic", data["styles"])

    def test_themes_endpoint(self):
        """Test GET /api/themes returns supported dynamic themes."""
        response = self.client.get("/api/themes")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("themes", data)
        self.assertIn("dark_modern", data["themes"])

    def test_sample_lessons_endpoint(self):
        """Test GET /api/sample-lessons returns curriculum presets."""
        response = self.client.get("/api/sample-lessons")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("samples", data)
        self.assertGreaterEqual(len(data["samples"]), 4)
        sample = data["samples"][0]
        self.assertIn("id", sample)
        self.assertIn("title", sample)
        self.assertIn("instructor", sample)
        self.assertIn("text", sample)

    def test_extract_concepts_endpoint(self):
        """Test POST /api/extract-concepts extracts structured visual concepts."""
        payload = {
            "lesson_title": "Deep Neural Networks & Transformers",
            "lesson_text": "Study of multi-head attention mechanisms and tensor embeddings in latent space.",
            "target_audience": "Undergraduate"
        }
        response = self.client.post("/api/extract-concepts", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        concept_data = data["data"]
        self.assertEqual(concept_data["key_topic"], payload["lesson_title"])
        self.assertIsNotNone(concept_data["visual_metaphor"])
        self.assertGreaterEqual(len(concept_data["color_palette"]), 3)
        self.assertIn("3D Render", concept_data["suggested_prompts"])

    def test_generate_assets_endpoint(self):
        """Test POST /api/generate-assets produces complete multi-format bundle."""
        payload = {
            "lesson_title": "Astrobiology: Exoplanetary Atmospheres",
            "instructor_name": "Dr. Sarah Lin",
            "category_tag": "SPACE SCIENCES",
            "prompt": "Bioluminescent exoplanet landscape under starlight",
            "styles": ["3D Render", "Photorealistic"],
            "aspect_ratios": ["16:9", "9:16", "1:1"],
            "include_text_overlay": True,
            "overlay_theme": "dark_modern"
        }
        response = self.client.post("/api/generate-assets", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["lesson_title"], payload["lesson_title"])
        self.assertEqual(len(data["variants"]), 2)
        self.assertEqual(data["total_assets_generated"], 6)

        first_variant = data["variants"][0]
        self.assertIn("16:9", first_variant["formats"])
        format_16_9 = first_variant["formats"]["16:9"]
        self.assertEqual(format_16_9["width"], 1280)
        self.assertEqual(format_16_9["height"], 720)
        self.assertIn("res.cloudinary.com", format_16_9["url"])
        self.assertIn("f_auto", format_16_9["cloudinary_transformations"])

    def test_preview_overlay_endpoint(self):
        """Test POST /api/preview-overlay returns on-the-fly transformed URL without regenerating."""
        payload = {
            "public_id": "cld-sample-4",
            "title": "Quantum Mechanics & Superposition",
            "instructor_name": "Dr. Elena Vance",
            "category_tag": "PHYSICS",
            "aspect_ratio": "16:9",
            "theme": "vibrant_gradient"
        }
        response = self.client.post("/api/preview-overlay", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["aspect_ratio"], "16:9")
        self.assertEqual(data["width"], 1280)
        self.assertEqual(data["height"], 720)
        self.assertIn("res.cloudinary.com", data["url"])

    def test_gen_transform_endpoint(self):
        """Test POST /api/gen-transform applies GenAI background replacement & restoration."""
        payload = {
            "public_id": "cld-sample-4",
            "aspect_ratio": "16:9",
            "gen_background_prompt": "cyberpunk laboratory with glowing blue lasers",
            "gen_restore": True,
            "title": "Advanced Cybernetics",
            "instructor_name": "Prof. Thorne",
            "theme": "dark_modern"
        }
        response = self.client.post("/api/gen-transform", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("res.cloudinary.com", data["url"])

    def test_export_bundle_endpoint(self):
        """Test POST /api/export-bundle builds downloadable export manifest."""
        payload = {
            "lesson_title": "Quantum Computing",
            "variants": [
                {
                    "style_name": "3D Render",
                    "base_public_id": "cld-sample-4",
                    "base_image_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    "generation_prompt": "Quantum core",
                    "formats": {
                        "16:9": {
                            "aspect_ratio": "16:9",
                            "label": "Thumbnail",
                            "url": "https://res.cloudinary.com/demo/image/upload/w_1280,h_720,f_auto,q_auto/sample.jpg",
                            "width": 1280,
                            "height": 720,
                            "cloudinary_transformations": "w_1280,h_720,f_auto,q_auto"
                        }
                    },
                    "overlay_applied": True
                }
            ]
        }
        response = self.client.post("/api/export-bundle", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["total_files"], 1)
        self.assertEqual(len(data["manifest"]), 1)
        self.assertEqual(len(data["download_urls"]), 1)

    def test_validation_error_handling(self):
        """Test that invalid payloads return 422 Unprocessable Entity."""
        invalid_payload = {
            "lesson_text": "Sample text without title"
        }
        response = self.client.post("/api/extract-concepts", json=invalid_payload)
        self.assertEqual(response.status_code, 422)

if __name__ == "__main__":
    unittest.main()
