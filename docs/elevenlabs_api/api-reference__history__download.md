# Download History Items - ElevenLabs API

## Endpoint Overview

The ElevenLabs API provides a POST endpoint at `https://api.elevenlabs.io/v1/history/download` for retrieving previously generated audio files.

## Key Functionality

**Request Body Requirements:**
The endpoint requires `history_item_ids` as a mandatory parameter -- "a list of history items to download, you can get IDs of history items and other metadata using the GET https://api.elevenlabs.io/v1/history endpoint."

**Response Behavior:**
The service returns different file formats based on quantity: a single audio file when one ID is provided, or a ZIP archive containing multiple files when multiple IDs are submitted.

**Optional Parameters:**
An `output_format` field allows transcoding to WAV or the default format.

## Authentication

The API accepts an optional `xi-api-key` header parameter for authentication.

## Response Codes

- **200**: Returns the requested audio file or ZIP archive
- **400**: Invalid request
- **422**: Validation error

## SDK Availability

Code examples are provided for TypeScript/JavaScript, Python, Go, Ruby, Java, PHP, C#, and Swift, demonstrating how to integrate this functionality across multiple programming languages and frameworks.
