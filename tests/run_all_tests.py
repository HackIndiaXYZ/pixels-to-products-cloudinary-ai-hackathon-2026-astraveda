import unittest
import sys
import os
import time

# Ensure UTF-8 output on Windows terminals
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure project root in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def run_all_tests():
    print("=" * 70)
    print("[TEST SUITE] EduVision Phase 4: Full Pipeline & API Test Runner")
    print("[TRACK 2] Cloudinary AI Hackathon 2026")
    print("=" * 70)

    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    # Discover and add all tests from tests directory
    tests_dir = os.path.dirname(__file__)
    discovered_suite = loader.discover(start_dir=tests_dir, pattern="test_*.py")
    suite.addTests(discovered_suite)

    start_time = time.time()
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    elapsed = time.time() - start_time

    print("\n" + "=" * 70)
    print("Test Summary Report:")
    print(f"   * Total Tests Executed: {result.testsRun}")
    print(f"   * Tests Passed:        {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"   * Failures:            {len(result.failures)}")
    print(f"   * Errors:              {len(result.errors)}")
    print(f"   * Execution Time:      {elapsed:.3f} seconds")
    print("=" * 70)

    if result.wasSuccessful():
        print("[SUCCESS] ALL TESTS PASSED! Phase 4 Pipeline Validation Complete.")
        return 0
    else:
        print("[FAILURE] Some tests encountered issues. Review details above.")
        return 1

if __name__ == "__main__":
    exit_code = run_all_tests()
    sys.exit(exit_code)
