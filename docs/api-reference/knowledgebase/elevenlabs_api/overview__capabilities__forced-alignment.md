***

title: Forced Alignment
subtitle: >-
Learn how to turn spoken audio and text into a time-aligned transcript with
ElevenLabs.
-----------

## Overview

The ElevenLabs [Forced Alignment](/docs/api-reference/forced-alignment/create) API turns spoken audio and text into a time-aligned transcript. This is useful for cases where you have audio recording and a transcript, but need exact timestamps for each word or phrase in the transcript. This can be used for:

* Matching subtitles to a video recording
* Generating timings for an audiobook recording of an ebook

## Usage

The Forced Alignment API can be used by interfacing with the ElevenLabs API directly.

<CardGroup cols={1}>
  <Card title="Developers" icon="duotone code" href="/docs/developers/guides/cookbooks/forced-alignment">
    Learn how to integrate Forced Alignment into your application.
  </Card>
</CardGroup>

## Supported languages

Our multilingual v2 models support 29 languages:

*English (USA, UK, Australia, Canada), Japanese, Chinese, German, Hindi, French (France, Canada), Korean, Portuguese (Brazil, Portugal), Italian, Spanish (Spain, Mexico), Indonesian, Dutch, Turkish, Filipino, Polish, Swedish, Bulgarian, Romanian, Arabic (Saudi Arabia, UAE), Czech, Greek, Finnish, Croatian, Malay, Slovak, Danish, Tamil, Ukrainian & Russian.*

## FAQ

<AccordionGroup>
  <Accordion title="What is forced alignment?">
    Forced alignment is a technique used to align spoken audio with text. You provide an audio file and a transcript of the audio file and the API will return a time-aligned transcript.

    It's useful for cases where you have audio recording and a transcript, but need exact timestamps for each word or phrase in the transcript.
  </Accordion>

  <Accordion title="What text input formats are supported?">
    The input text should be a string with no special formatting i.e. JSON.

    Example of good input text:

    ```
    "Hello, how are you?"
    ```

    Example of bad input text:

    ```
    {
        "text": "Hello, how are you?"
    }
    ```
  </Accordion>

  <Accordion title="How much does Forced Alignment cost?">
    Forced Alignment costs the same as the [Speech to Text](https://elevenlabs.io/pricing/api?price.section=speech_to_text#pricing-table) API.
  </Accordion>

  <Accordion title="Does Forced Alignment support diarization?">
    Forced Alignment does not support diarization. If you provide diarized text, the API will likely return unwanted results.
  </Accordion>

  <Accordion title="What is the maximum audio file size for Forced Alignment?">
    The maximum file size for Forced Alignment is 3GB.
  </Accordion>

  <Accordion title="What is the maximum duration for a Forced Alignment input file?">
    For audio files, the maximum duration is 10 hours.

    For the text input, the maximum length is 675k characters.
  </Accordion>
</AccordionGroup>
