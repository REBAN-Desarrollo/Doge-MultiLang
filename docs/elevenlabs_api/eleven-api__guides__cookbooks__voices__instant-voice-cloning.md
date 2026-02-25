***

title: Instant Voice Cloning quickstart
subtitle: Learn how to clone a voice using the Clone Voice API.
---------------------------------------------------------------

This guide will show you how to create an Instant Voice Clone using the Clone Voice API. To create an Instant Voice Clone via the dashboard, refer to the [Instant Voice Clone](/docs/creative-platform/voices/voice-cloning/instant-voice-cloning) product guide.

For an outline of the differences between Instant Voice Clones and Professional Voice Clones, refer to the [Voices capability](/docs/overview/capabilities/voices) guide.

## Using the Instant Voice Clone API

<Steps>
  <Step title="Create an API key">
    [Create an API key in the dashboard here](https://elevenlabs.io/app/settings/api-keys), which you’ll use to securely [access the API](/docs/api-reference/authentication).

    Store the key as a managed secret and pass it to the SDKs either as a environment variable via an `.env` file, or directly in your app’s configuration depending on your preference.

    ```js title=".env"
    ELEVENLABS_API_KEY=<your_api_key_here>
    ```
  </Step>

  <Step title="Install the SDK">
    We'll also use the `dotenv` library to load our API key from an environment variable.

    <CodeBlocks>
      ```python
      pip install elevenlabs
      pip install python-dotenv
      ```

      ```typescript
      npm install @elevenlabs/elevenlabs-js
      npm install dotenv
      ```
    </CodeBlocks>
  </Step>

  <Step title="Make the API request">
    Create a new file named `example.py` or `example.mts`, depending on your language of choice and add the following code:

    <CodeBlock>
      ```python maxLines=0
      # example.py
      import os
      from dotenv import load_dotenv
      from elevenlabs.client import ElevenLabs
      from io import BytesIO

      load_dotenv()

      elevenlabs = ElevenLabs(
        api_key=os.getenv("ELEVENLABS_API_KEY"),
      )

      voice = elevenlabs.voices.ivc.create(
          name="My Voice Clone",
          # Replace with the paths to your audio files.
          # The more files you add, the better the clone will be.
          files=[BytesIO(open("/path/to/your/audio/file.mp3", "rb").read())]
      )

      print(voice.voice_id)
      ```

      ```typescript maxLines=0
      // example.mts
      import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
      import "dotenv/config";
      import fs from "node:fs";

      const elevenlabs = new ElevenLabsClient();

      const voice = await elevenlabs.voices.ivc.create({
          name: "My Voice Clone",
          // Replace with the paths to your audio files.
          // The more files you add, the better the clone will be.
          files: [
              fs.createReadStream(
                  "/path/to/your/audio/file.mp3",
              ),
          ],
      });

      console.log(voice.voiceId);
      ```
    </CodeBlock>
  </Step>

  <Step title="Execute the code">
    <CodeBlock>
      ```python
      python example.py
      ```

      ```typescript
      npx tsx example.mts
      ```
    </CodeBlock>

    You should see the voice ID printed to the console.
  </Step>
</Steps>

## Next steps

Explore the [API reference](/docs/api-reference/voices/ivc/create) for more information on creating a voice clone.
