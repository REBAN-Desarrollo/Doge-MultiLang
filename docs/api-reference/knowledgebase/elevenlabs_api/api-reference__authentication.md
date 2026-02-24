# API Authentication

This documentation page covers ElevenLabs API authentication methods.

## API Key Requirements

The service employs API keys for request authentication. "Every request to the API must include your API key, used to authenticate your requests and track usage quota."

## Scope Options

Keys can be configured with endpoint restrictions and custom credit limits to control which services are accessible and how many resources may be consumed.

## Security Warning

"Your API key is a secret. Do not share it with others or expose it in any client-side code (browsers, apps)."

## Implementation Methods

- Include the key via `xi-api-key` HTTP header
- Use official SDKs for Python and JavaScript that accept the API key during client initialization
- Access alternative authentication through single-use tokens for limited-time, client-side requests

## Example Integration

The documentation provides curl commands and code snippets demonstrating proper header formatting and SDK initialization across multiple languages.
