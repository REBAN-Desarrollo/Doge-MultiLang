# Get Audio from History Item - ElevenLabs API

## Endpoint Overview
The "Get audio from history item" endpoint retrieves audio files associated with specific history items in the ElevenLabs API.

## Key Details

**Request Method:** GET endpoint at `https://api.elevenlabs.io/v1/history/{history_item_id}/audio`

**Required Parameter:** The `history_item_id` path parameter is mandatory. Users can obtain history items using the "Get generated items" endpoint.

**Authentication:** The optional `xi-api-key` header in the request allows API authentication.

**Response:** A successful 200 response returns the audio file in `application/octet-stream` format. The API may return a 422 validation error for improper requests.

## Available Code Examples

The documentation provides implementation examples across multiple programming languages:
- TypeScript/JavaScript via the ElevenLabsClient SDK
- Python using the ElevenLabs library
- Go with native HTTP package
- Ruby with Net::HTTP
- Java using Unirest
- PHP with Guzzle HTTP client
- C# via RestSharp
- Swift with Foundation URLSession

Each example demonstrates passing the history item ID and API key to retrieve the associated audio file.
