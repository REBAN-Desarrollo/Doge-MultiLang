***

title: Using pronunciation dictionaries
subtitle: Learn how to manage pronunciation dictionaries programmatically.
--------------------------------------------------------------------------

## Overview

Pronunciation dictionaries allow you to customize how your AI agent pronounces specific words or phrases. This is particularly useful for:

* Correcting pronunciation of names, places, or technical terms
* Ensuring consistent pronunciation across conversations
* Customizing regional pronunciation variations

ElevenLabs supports both [IPA](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet) and [CMU](https://en.wikipedia.org/wiki/CMU_Pronouncing_Dictionary) alphabets.

<Info>
  Phoneme tags only work with `eleven_flash_v2`, `eleven_turbo_v2` & `eleven_monolingual_v1` models.
  If you use phoneme tags with other models, they will silently skip the word.
</Info>

<Info>
  Phoneme tags (IPA/CMU) only work for English. For other languages, use Alias tags instead, which
  replace words with alternative spellings or phrases that produce the desired pronunciation.
</Info>

## Quickstart

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

  <Step title="Create a pronunciation dictionary file">
    In this example, we will create a pronunciation dictionary file for the word `tomato`.

    This rule will use the "IPA" alphabet and update the pronunciation for `tomato` and `Tomato` with a different pronunciation. PLS files are case sensitive which is why we include it both with and without a capital "T".

    <Tip>
      You can use AI tools like Claude or ChatGPT to help generate IPA or CMU notations for specific words.
    </Tip>

    ```xml title="dictionary.pls"
    <?xml version="1.0" encoding="UTF-8"?>
    <lexicon version="1.0"
        xmlns="http://www.w3.org/2005/01/pronunciation-lexicon"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.w3.org/2005/01/pronunciation-lexicon
            http://www.w3.org/TR/2007/CR-pronunciation-lexicon-20071212/pls.xsd"
        alphabet="ipa" xml:lang="en-US">
    <lexeme>
        <grapheme>tomato</grapheme>
        <phoneme>/tə'meɪtoʊ/</phoneme>
    </lexeme>
    <lexeme>
        <grapheme>Tomato</grapheme>
        <phoneme>/tə'meɪtoʊ/</phoneme>
    </lexeme>
    </lexicon>
    ```
  </Step>

  <Step title="Create a pronunciation dictionary from a file via the SDK">
    Create a new file named `example.py` or `example.mts`, depending on your language of choice and add the following code:

    <CodeBlocks>
      ```python maxLines=0
      import requests
      from elevenlabs.play import play, PronunciationDictionaryVersionLocator

      with open("dictionary.pls", "rb") as f:
          # this dictionary changes how tomato is pronounced
          pronunciation_dictionary = elevenlabs.pronunciation_dictionaries.create_from_file(
              file=f.read(), name="example"
          )

      audio_1 = elevenlabs.text_to_speech.convert(
          text="Without the dictionary: tomato",
          voice_id="aMSt68OGf4xUZAnLpTU8",
          model_id="eleven_turbo_v2",
      )

      audio_2 = elevenlabs.text_to_speech.convert(
          text="With the dictionary: tomato",
          voice_id="aMSt68OGf4xUZAnLpTU8",
          model_id="eleven_turbo_v2",
          pronunciation_dictionary_locators=[
              PronunciationDictionaryVersionLocator(
                  pronunciation_dictionary_id=pronunciation_dictionary.id,
                  version_id=pronunciation_dictionary.version_id,
              )
          ],
      )

      # play the audio
      play(audio_1)
      play(audio_2)
      ```

      ```typescript maxLines=0
      import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
      import "dotenv/config";
      import fs from "node:fs";

      const elevenlabs = new ElevenLabsClient();

      const pronunciationDictionary = await elevenlabs.pronunciationDictionaries.createFromFile({
          file: fs.createReadStream("dictionary.pls"),
      });

      const audio1 = await elevenlabs.textToSpeech.convert("Without the dictionary: tomato", {
          voiceId: "aMSt68OGf4xUZAnLpTU8",
          modelId: "eleven_turbo_v2",
      });

      const audio2 = await elevenlabs.textToSpeech.convert("With the dictionary: tomato", {
          voiceId: "aMSt68OGf4xUZAnLpTU8",
          modelId: "eleven_turbo_v2",
          pronunciationDictionaryLocators: [
              {
                  pronunciationDictionaryId: pronunciationDictionary.id,
                  versionId: pronunciationDictionary.versionId,
              },
          ],
      });

      play(audio1);
      play(audio2);
      ```
    </CodeBlocks>
  </Step>

  <Step title="Execute the code">
    <CodeBlocks>
      ```python
      python example.py
      ```

      ```typescript
      npx tsx example.mts
      ```
    </CodeBlocks>

    You should hear two versions of the audio playing through your speakers, one with and one without the pronunciation dictionary.
  </Step>
</Steps>

## Next steps

To learn more about pronunciation dictionaries, please refer to the [API reference](/docs/api-reference/pronunciation-dictionaries/create-from-file).
