# Research: Multilingual Translation Benchmarks & Models

This document aggregates SOTA metrics and models for multilingual translation evaluation, intended to serve as a reference for the `Multi_Idiomas` feature integration.

## 1. Evaluation Metrics (Multilingual)

### Metrics with Reference (Gold Standard)
- **COMET (wmt22-comet-da)**: Uses source text + system translation + human reference. High correlation with human judgment.
- **xCOMET**: Explainable evaluation. Provides span-level error detection for better interpretability.

### Metrics without Reference (Quality Estimation - QE)
- **COMETKiwi (wmt22-cometkiwi-da)**: Uses ONLY source text + system translation. Essential for real-time production gates where human references do not exist.

## 2. Top-Performing LLMs for Translation (WMT25)

According to official WMT25 (General MT) human evaluation clusters:

| Rank | Model Family | Performance Note | OpenRouter ID |
|------|--------------|------------------|---------------|
| **1** | **Gemini 2.5 Pro** | #1 Overall (Top cluster in 14 pairs) | `google/gemini-2.5-pro` |
| 2 | GPT-4.1 | Consistently in top tiers | `openai/gpt-4.1` |
| 3 | DeepSeek V3 | Highly competitive, cost-effective | `deepseek/deepseek-chat` |
| 4 | Claude 4.5 | Frontier performance | `anthropic/claude-opus-4.5` / `sonnet-4.5` |
| 5 | Mistral Medium | Strong European language support | `mistralai/mistral-medium-3.1` |
| 6 | Qwen3 235B | Excellent multilingual support (100+ langs) | `qwen/qwen3-235b-a22b` |

## 3. Standard Benchmarks & Leaderboards

- **WMT (Workshop on Machine Translation)**: The industry standard for MT comparison.
- **FLORES-200**: Evaluation across 200 different languages/dialects.
- **LMArena (MT/Translation)**: Community-driven leaderboard for LLM translation capabilities.

## 4. Implementation Recommendations for `Multi_Idiomas`

> [!TIP]
> **Production Strategy:**
> 1. Use **Gemini 2.5 Pro** or **GPT-4.1** for high-touch localization (Tier 1).
> 2. Use **COMETKiwi** as the automated "Judge" score in the `risk_report` to flag segments for human review.
> 3. Implement **DeepSeek V3** for cost-effective translations in Tier 2/3 markets.
