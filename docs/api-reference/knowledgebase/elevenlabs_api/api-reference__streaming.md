# Streaming Audio from ElevenLabs API

The ElevenLabs API enables real-time audio streaming through chunked transfer encoding, allowing clients to process audio incrementally as it's generated. The capability extends to three endpoints: Text to Speech, Voice Changer, and Audio Isolation APIs.

## Key Features

The service returns raw audio bytes (such as MP3 data) directly via HTTP. Official libraries for Python and Node.js provide utilities that simplify working with continuous audio streams.

## Implementation Examples

**Python approach:**
The Python SDK allows developers to either play streamed audio locally or manually process audio bytes by iterating through the stream and handling each chunk individually.

**Node/TypeScript approach:**
Similarly, the JavaScript client supports both local playback through a streaming utility and manual chunk processing using asynchronous iteration.

Both implementations follow the same pattern: initialize the client, call the appropriate streaming method with text and voice parameters, then either play the audio or process the byte chunks directly. The model identifier and voice ID are specified as part of the request configuration.
