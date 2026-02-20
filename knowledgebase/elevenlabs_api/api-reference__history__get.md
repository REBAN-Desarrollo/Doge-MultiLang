# Get History Item - ElevenLabs API Documentation

This page documents the ElevenLabs API endpoint for retrieving a specific history item.

## Endpoint Overview

The endpoint retrieves details about a generated audio item from a user's history. It uses a GET request to `https://api.elevenlabs.io/v1/history/{history_item_id}`.

## Key Parameters

The request requires a `history_item_id` path parameter. An optional `xi-api-key` header can be included for authentication.

## Response Structure

The successful response includes comprehensive details about the generated item:

- **Identifiers**: history_item_id, request_id, voice_id, model_id
- **Voice Information**: voice_name and voice_category (premade, cloned, generated, or professional)
- **Content Details**: The text used for generation, creation timestamp, and character count changes
- **Feedback Data**: Optional user feedback including ratings, emotions, quality assessments, and glitch reports
- **Source Information**: Where the item originated (TTS, STS, Projects, Dubbing, etc.)
- **Advanced Features**: Character-level alignment data and dialogue pairs for multi-voice generations

## Code Examples

The documentation provides implementation examples in TypeScript, Python, Go, Ruby, Java, PHP, C#, and Swift, demonstrating how to call this endpoint using both SDK clients and raw HTTP requests.
