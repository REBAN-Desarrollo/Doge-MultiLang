# ElevenLabs API Introduction

## Installation

The page provides setup commands for two official libraries:
- Python: `pip install elevenlabs`
- Node.js: `npm install @elevenlabs/elevenlabs-js`

## Cost Tracking

The documentation demonstrates how to access generation metadata through response headers in both languages. Developers can retrieve "character costs" and "request IDs" from response headers using methods like `response.headers.get("x-character-count")`.

## Code Examples

Two parallel code blocks illustrate text-to-speech conversion with raw response handling -- one using Python's ElevenLabs client and another using the JavaScript library, both showing how to access audio data and metadata from API responses.
