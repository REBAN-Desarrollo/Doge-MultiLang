# Troubleshooting

This page addresses common issues with non-deterministic AI voice models and provides solutions.

## General Issues

### 1. Volume and Quality Inconsistencies

These stem from training audio issues. Solutions include:

- Audio compression (targeting RMS between -23 dB and -18 dB)
- Removing background noise
- Maintaining speaker consistency
- Using appropriate audio lengths (1-2 minutes for instant cloning, 30+ minutes for professional cloning)

### 2. Mispronunciation

The multilingual models occasionally mispronounce words. Recommendations include:

- Using the Studio feature
- Employing properly cloned voices
- Specifying pronunciation for proper nouns and acronyms

### 3. Language Switching and Accent Drift

This occurs especially in longer generations. The guide suggests:

- Using quality voice clones trained in the target language
- Understanding voice limitations
- Selecting the correct language
- Keeping text under 800-900 characters

### 4. Numbers, Symbols, and Acronyms

These require phonetic spelling or written-out forms to ensure correct pronunciation across languages.

### 5. Corrupt Speech

Rare muffled or distorted audio requires regeneration to resolve.

### 6. Audio Degradation

Breaking text into sections under 800 characters helps maintain quality during extended generations.

### 7. Style Exaggeration

This setting can cause instability and is recommended to remain at 0.

## Studio-Specific Issues

Two dedicated sections address file imports and paragraph glitches, with EPUB recommended as the preferred format.
