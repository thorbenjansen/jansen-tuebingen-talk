"""Source-specific paths and enrichment hints for this ARA."""

from pathlib import Path


def source_paths(root: Path) -> dict[str, Path]:
    """Return canonical source locations for manual enrichment."""
    return {
        "raw_pdf": root / "raw/paper__a-systematic-review-and-meta-analysis-of-growth-mindset-interventions.pdf",
        "artifact": root / "output/agent_native_artifacts/a-systematic-review-and-meta-analysis-of-growth-mindset-interventions",
    }


EXTRACTED_CONCEPTS = ['Feedback', 'Revision', 'Writing Processes', 'Assessment', 'Teachers', 'Students', 'Motivation', 'Bias And Fairness', 'Prompting', 'Validity']
