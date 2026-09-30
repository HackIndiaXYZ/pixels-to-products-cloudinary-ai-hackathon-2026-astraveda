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

    def test_health_endpoint(self):
        """Test GET /api/health returns valid status and configuration flags."""
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("cloudinary_configured", data)
        self.assertIn("version", data)

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

        # Inspect format properties
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

    def test_validation_error_handling(self):
        """Test that invalid payloads return 422 Unprocessable Entity."""
        # Missing required field 'lesson_title'
        invalid_payload = {
            "lesson_text": "Sample text without title"
        }
        response = self.client.post("/api/extract-concepts", json=invalid_payload)
        self.assertEqual(response.status_code, 422)

if __name__ == "__main__":
    unittest.main()
