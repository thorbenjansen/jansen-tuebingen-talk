# Experiments

## E01: Verify source design and population
- **Verifies**: C01
- **Setup**: Full-text source loaded from `rawmarkdown_full/paper-02-kriegbaum-et-al-2018-the-relative-importance-of-intelligence-and-motivation.md`.
- **Procedure**:
  1. Check the extracted methods/design sentences against the original PDF.
  2. Record study type, sample/population, task, intervention/comparison, measures, and analysis strategy.
  3. Narrow claims if the extracted method cues overstate the design.
- **Metrics**: Accuracy of design, population, variable, and measure extraction.
- **Expected outcome**: The source-specific design profile is confirmed or corrected.
- **Baselines**: Former abstract-only ARA scaffold.
- **Dependencies**: none

## E02: Verify source results and outcomes
- **Verifies**: C02, C03
- **Setup**: Result-oriented source sentences and table snippets in `evidence/`.
- **Procedure**:
  1. Match each claim to exact result, discussion, table, or figure evidence.
  2. Preserve exact numeric results where available.
  3. Separate direct results from broader interpretation.
- **Metrics**: Claim-evidence alignment and numeric fidelity.
- **Expected outcome**: Result claims are either supported, narrowed, or removed.
- **Baselines**: Abstract-level candidate claims.
- **Dependencies**: E01

## E03: Verify boundaries and limitations
- **Verifies**: C01, C02, C03
- **Setup**: Extracted limitations and discussion cues.
- **Procedure**:
  1. Identify stated limitations, sample restrictions, model/tool restrictions, and transfer boundaries.
  2. Add those boundaries to claims and constraints.
  3. Check whether any claim outruns these limitations.
- **Metrics**: Scope calibration and limitation coverage.
- **Expected outcome**: Claims become better bounded to what the source can actually support.
- **Baselines**: Unbounded source-extracted claims.
- **Dependencies**: E01, E02
