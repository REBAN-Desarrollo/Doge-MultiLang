# Dubbing Quickstart

> Learn how to dub audio and video files across languages using the Dubbing API.

This guide demonstrates how to dub an audio file across languages, using English to Spanish as an example.

## Using the Dubbing API

### Step 1: Create an API key

- Create an API key via the dashboard
- Store as a managed secret
- Pass to SDKs as an environment variable in `.env` file or directly in app configuration
- Environment variable format: `ELEVENLABS_API_KEY=<your_api_key_here>`

### Step 2: Install the SDK

Installation commands provided for Python (elevenlabs, python-dotenv) and TypeScript (elevenlabs-js, dotenv). Note mentions potential need to install MPV and/or ffmpeg for audio playback.

### Step 3: Make the API request

Complete code examples provided in both Python and TypeScript showing:
- API initialization
- Setting target language to Spanish ("es")
- Fetching sample audio from Google Cloud Storage
- Creating a dubbing request
- Polling for completion status
- Retrieving and playing the dubbed audio

### Step 4: Execute the code

- Python: `python example.py`
- TypeScript: `npx tsx example.mts`
- Expected result: dubbed audio plays through speakers

## Next Steps

Referral to API reference documentation for additional Dubbing API information and options.
