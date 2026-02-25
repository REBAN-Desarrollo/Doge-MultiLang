***

title: Voices
subtitle: 'Learn how to create, customize, and manage voices with ElevenLabs.'
------------------------------------------------------------------------------

## Overview

ElevenLabs provides models for voice creation & customization. The platform supports a wide range of voice options, including voices from our extensive [voice library](https://elevenlabs.io/app/voice-library), voice cloning, and artificially designed voices using text prompts.

### Voice types

* **Community**: Voices shared by the community from the ElevenLabs [voice library](/docs/creative-platform/voices/voice-library).
* **Cloned**: Custom voices created using instant or professional [voice cloning](/docs/creative-platform/voices/voice-cloning).
* **Voice design**: Artificially designed voices created with the [voice design](/docs/creative-platform/voices/voice-design) tool.
* **Default**: Pre-designed, high-quality voices optimized for general use.

<Tip>
  Voices that you personally own, either created with Instant Voice Cloning, Professional Voice
  Cloning, or Voice Design, can be used for [Voice
  Remixing](/docs/overview/capabilities/voice-remixing).
</Tip>

#### Community

The [voice library](/docs/creative-platform/voices/voice-library) contains over 10,000 voices shared by the ElevenLabs community. Use it to:

* Discover unique voices shared by the ElevenLabs community.
* Add voices to your personal collection.
* Share your own voice clones for cash rewards when other paid subscribers use it.

<Success>
  Share your voice with the community, set your terms, and earn cash rewards when others use it.
  We've paid out over **\$14M** already.
</Success>

<Warning>
  The voice library is not available via the API to free tier users.
</Warning>

<CardGroup cols={1}>
  <Card title="Products" icon="duotone book-user" iconPosition="left" href="/docs/creative-platform/voices/voice-library">
    Learn how to use voices from the voice library
  </Card>
</CardGroup>

#### Cloned

Clone your own voice from 30-second samples with Instant Voice Cloning, or create hyper-realistic voices using Professional Voice Cloning.

* **Instant Voice Cloning**: Quickly replicate a voice from short audio samples.
* **Professional Voice Cloning**: Generate professional-grade voice clones with extended training audio.

Voice-captcha technology is used to verify that **all** voice clones are created from your own voice samples.

<Note>
  A Creator plan or higher is required to create voice clones.
</Note>

<CardGroup cols={2}>
  <Card title="Products" icon="duotone book-user" iconPosition="left" href="/docs/creative-platform/voices/voice-cloning">
    Learn how to create instant & professional voice clones
  </Card>

  <Card title="Instant Voice Cloning" icon="duotone code" href="/docs/developers/guides/cookbooks/voices/instant-voice-cloning">
    Clone a voice instantly
  </Card>

  <Card title="Professional Voice Cloning" icon="duotone code" href="/docs/developers/guides/cookbooks/voices/professional-voice-cloning">
    Create a perfect voice clone
  </Card>
</CardGroup>

#### Voice design

With [Voice Design](/docs/creative-platform/voices/voice-design), you can create entirely new voices by specifying attributes like age, gender, accent, and tone. Generated voices are ideal for:

* Realistic voices with nuanced characteristics.
* Creative character voices for games and storytelling.

The voice design tool creates 3 voice previews, simply provide:

* A **voice description** between 20 and 1000 characters.
* A **text** to preview the voice between 100 and 1000 characters.

##### Voice design with Eleven v3

Using the [Eleven v3 model](/docs/overview/models#eleven-v3), voices that are capable of a wide range of emotion can be designed via a prompt.

Using v3 gets you the following benefits:

* More natural and versatile voice generation.
* Better control over voice characteristics.
* Audio tags supported in Preview generations.
* Backward compatibility with v2 models.

<CardGroup cols={2}>
  <Card title="Products" icon="duotone book-user" href="/docs/creative-platform/voices/voice-design">
    Learn how to craft voices from a single prompt.
  </Card>

  <Card title="Developers" icon="duotone code" href="/docs/developers/guides/cookbooks/voices/voice-design">
    Integrate voice design into your application.
  </Card>
</CardGroup>

#### Default

Our curated set of default voices is optimized for core use cases. These voices are:

* **Reliable**: Available long-term.
* **Consistent**: Carefully crafted and quality-checked for performance.
* **Model-ready**: Fine-tuned on new models upon release.

<Info>
  Default voices are available to all users via the **My Voices** tab in the [voice lab
  dashboard](https://elevenlabs.io/app/voice-lab). Default voices were previously referred to as
  `premade` voices. The latter term is still used when accessing default voices via the API.
</Info>

### Managing voices

All voices can be managed through **My Voices**, where you can:

* Search, filter, and categorize voices
* Add descriptions and custom tags
* Organize voices for quick access

Learn how to manage your voice collection in [My Voices documentation](/docs/creative-platform/voices/voice-library#my-voices).

* **Search and Filter**: Find voices using keywords or tags.
* **Preview Samples**: Listen to voice demos before adding them to **My Voices**.
* **Add to Collection**: Save voices for easy access in your projects.

> **Tip**: Try searching by specific accents or genres, such as "Australian narration" or "child-like character."

### Supported languages

All ElevenLabs voices support multiple languages. Experiment by converting phrases like `Hello! こんにちは! Bonjour!` into speech to hear how your own voice sounds across different languages.

ElevenLabs supports voice creation in 32 languages. Match your voice selection to your target region for the most natural results.

* **Default Voices**: Optimized for multilingual use.
* **Generated and Cloned Voices**: Accent fidelity depends on input samples or selected attributes.

Our multilingual v2 models support 29 languages:

*English (USA, UK, Australia, Canada), Japanese, Chinese, German, Hindi, French (France, Canada), Korean, Portuguese (Brazil, Portugal), Italian, Spanish (Spain, Mexico), Indonesian, Dutch, Turkish, Filipino, Polish, Swedish, Bulgarian, Romanian, Arabic (Saudi Arabia, UAE), Czech, Greek, Finnish, Croatian, Malay, Slovak, Danish, Tamil, Ukrainian & Russian.*

Flash v2.5 supports 32 languages - all languages from v2 models plus:

*Hungarian, Norwegian & Vietnamese*

[Learn more about our models](/docs/overview/models)

## FAQ

<AccordionGroup>
  <Accordion title="Can I create a custom voice?">
    Yes, you can create custom voices with Voice Design or clone voices using Instant or
    Professional Voice Cloning. Both options are accessible in **My Voices**.
  </Accordion>

  <Accordion title="What is the difference between Instant and Professional Voice Cloning?">
    Instant Voice Cloning uses short audio samples for near-instantaneous voice creation.
    Professional Voice Cloning requires longer samples but delivers hyper-realistic, high-quality
    results.
  </Accordion>

  <Accordion title="Can I share my created voices?">
    Professional Voice Clones can be shared privately or publicly in the Voice Library. Generated
    voices and Instant Voice Clones cannot currently be shared.
  </Accordion>

  <Accordion title="How do I manage my voices?">
    Use **My Voices** to search, filter, and organize your voice collection. You can also delete,
    tag, and categorize voices for easier management.
  </Accordion>

  <Accordion title="How can I ensure my cloned voice matches the original?">
    Use clean and consistent audio samples. For Professional Voice Cloning, provide a variety of
    recordings in the desired speaking style.
  </Accordion>

  <Accordion title="Can I share voices I create?">
    Yes, Professional Voice Clones can be shared in the Voice Library. Instant Voice Clones and
    Generated Voices cannot currently be shared.
  </Accordion>

  <Accordion title="What are some common use cases for Generated Voices?">
    Generated Voices are ideal for unique characters in games, animations, and creative
    storytelling.
  </Accordion>

  <Accordion title="How do I access the Voice Library?">
    Go to **Voices > Voice Library** in your dashboard or access it via API.
  </Accordion>
</AccordionGroup>
