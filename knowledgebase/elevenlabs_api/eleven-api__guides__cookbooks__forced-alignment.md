# Forced Alignment API Quickstart Guide

This documentation provides instructions for using ElevenLabs' Forced Alignment API to synchronize text with audio.

## Key Steps Outlined

The guide walks through four primary stages:

1. **API Key Setup**: Users obtain credentials from the dashboard and store them as environment variables using `.env` files for secure access.

2. **SDK Installation**: Two package options are provided--Python developers install `elevenlabs` and `python-dotenv`, while TypeScript users install `@elevenlabs/elevenlabs-js` and `dotenv`.

3. **Code Implementation**: The guide provides parallel code examples for both languages. As one sample demonstrates, the Python approach involves "loading environment variables, initializing the ElevenLabs client, fetching audio from a URL, and calling the forced_alignment.create method with audio data and corresponding text."

4. **Execution**: Commands are provided to run the scripts (`python example.py` or `npx tsx example.mts`), with expected output being "the transcript of the audio file with exact timestamps printed to the console."

## Additional Resources

The documentation directs users to the API reference documentation for deeper exploration of available options and parameters.
