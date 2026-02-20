# Create Podcast

POST https://api.elevenlabs.io/v1/studio/podcasts
Content-Type: application/json

Create and auto-convert a podcast project. Currently, the LLM cost is covered by us but you will still be charged for the audio generation. In the future, you will be charged for both the LLM and audio generation costs.

Reference: https://elevenlabs.io/docs/api-reference/studio/create-podcast

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create Podcast
  version: endpoint_studio.create_podcast
paths:
  /v1/studio/podcasts:
    post:
      operationId: create-podcast
      summary: Create Podcast
      description: >-
        Create and auto-convert a podcast project. Currently, the LLM cost is
        covered by us but you will still be charged for the audio generation. In
        the future, you will be charged for both the LLM and audio generation
        costs.
      tags:
        - - subpackage_studio
      parameters:
        - name: xi-api-key
          in: header
          required: false
          schema:
            type: string
        - name: safety-identifier
          in: header
          description: >-
            Used for moderation. Your workspace must be allowlisted to use this
            feature.
          required: false
          schema:
            type: string
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/type_:PodcastProjectResponseModel'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                model_id:
                  type: string
                  description: >-
                    The ID of the model to be used for this Studio project, you
                    can query GET /v1/models to list all available models.
                mode:
                  $ref: >-
                    #/components/schemas/type_studio:BodyCreatePodcastV1StudioPodcastsPostMode
                  description: >-
                    The type of podcast to generate. Can be 'conversation', an
                    interaction between two voices, or 'bulletin', a monologue.
                source:
                  $ref: >-
                    #/components/schemas/type_studio:BodyCreatePodcastV1StudioPodcastsPostSource
                  description: The source content for the Podcast.
                quality_preset:
                  $ref: >-
                    #/components/schemas/type_studio:BodyCreatePodcastV1StudioPodcastsPostQualityPreset
                  description: >-
                    Output quality of the generated audio. Must be one of:

                    'standard' - standard output format, 128kbps with 44.1kHz
                    sample rate.

                    'high' - high quality output format, 192kbps with 44.1kHz
                    sample rate and major improvements on our side.

                    'ultra' - ultra quality output format, 192kbps with 44.1kHz
                    sample rate and highest improvements on our side.

                    'ultra_lossless' - ultra quality output format, 705.6kbps
                    with 44.1kHz sample rate and highest improvements on our
                    side in a fully lossless format.
                duration_scale:
                  $ref: >-
                    #/components/schemas/type_studio:BodyCreatePodcastV1StudioPodcastsPostDurationScale
                  description: |-
                    Duration of the generated podcast. Must be one of:
                    short - produces podcasts shorter than 3 minutes.
                    default - produces podcasts roughly between 3-7 minutes.
                    long - produces podcasts longer than 7 minutes.
                language:
                  type: string
                  description: >-
                    An optional language of the Studio project. Two-letter
                    language code (ISO 639-1).
                intro:
                  type: string
                  description: >-
                    The intro text that will always be added to the beginning of
                    the podcast.
                outro:
                  type: string
                  description: >-
                    The outro text that will always be added to the end of the
                    podcast.
                instructions_prompt:
                  type: string
                  description: >-
                    Additional instructions prompt for the podcast generation
                    used to adjust the podcast's style and tone.
                highlights:
                  type: array
                  items:
                    type: string
                  description: >-
                    A brief summary or highlights of the Studio project's
                    content, providing key points or themes. This should be
                    between 10 and 70 characters.
                callback_url:
                  type: string
                  description: |2-

                        A url that will be called by our service when the Studio project is converted. Request will contain a json blob containing the status of the conversion
                        Messages:
                        1. When project was converted successfully:
                        {
                          type: "project_conversion_status",
                          event_timestamp: 1234567890,
                          data: {
                            request_id: "1234567890",
                            project_id: "21m00Tcm4TlvDq8ikWAM",
                            conversion_status: "success",
                            project_snapshot_id: "22m00Tcm4TlvDq8ikMAT",
                            error_details: None,
                          }
                        }
                        2. When project conversion failed:
                        {
                          type: "project_conversion_status",
                          event_timestamp: 1234567890,
                          data: {
                            request_id: "1234567890",
                            project_id: "21m00Tcm4TlvDq8ikWAM",
                            conversion_status: "error",
                            project_snapshot_id: None,
                            error_details: "Error details if conversion failed"
                          }
                        }

                        3. When chapter was converted successfully:
                        {
                          type: "chapter_conversion_status",
                          event_timestamp: 1234567890,
                          data: {
                            request_id: "1234567890",
                            project_id: "21m00Tcm4TlvDq8ikWAM",
                            chapter_id: "22m00Tcm4TlvDq8ikMAT",
                            conversion_status: "success",
                            chapter_snapshot_id: "23m00Tcm4TlvDq8ikMAV",
                            error_details: None,
                          }
                        }
                        4. When chapter conversion failed:
                        {
                          type: "chapter_conversion_status",
                          event_timestamp: 1234567890,
                          data: {
                            request_id: "1234567890",
                            project_id: "21m00Tcm4TlvDq8ikWAM",
                            chapter_id: "22m00Tcm4TlvDq8ikMAT",
                            conversion_status: "error",
                            chapter_snapshot_id: None,
                            error_details: "Error details if conversion failed"
                          }
                        }
                        
                apply_text_normalization:
                  $ref: >-
                    #/components/schemas/type_studio:BodyCreatePodcastV1StudioPodcastsPostApplyTextNormalization
                  description: |2-

                        This parameter controls text normalization with four modes: 'auto', 'on', 'apply_english' and 'off'.
                        When set to 'auto', the system will automatically decide whether to apply text normalization
                        (e.g., spelling out numbers). With 'on', text normalization will always be applied, while
                        with 'off', it will be skipped. 'apply_english' is the same as 'on' but will assume that text is in English.
                        
              required:
                - model_id
                - mode
                - source
components:
  schemas:
    type_:PodcastConversationModeData:
      type: object
      properties:
        host_voice_id:
          type: string
          description: The ID of the host voice.
        guest_voice_id:
          type: string
          description: The ID of the guest voice.
      required:
        - host_voice_id
        - guest_voice_id
    type_:PodcastBulletinModeData:
      type: object
      properties:
        host_voice_id:
          type: string
          description: The ID of the host voice.
      required:
        - host_voice_id
    type_studio:BodyCreatePodcastV1StudioPodcastsPostMode:
      oneOf:
        - type: object
          properties:
            type:
              type: string
              enum:
                - conversation
              description: 'Discriminator value: conversation'
            conversation:
              $ref: '#/components/schemas/type_:PodcastConversationModeData'
              description: The voice settings for the conversation.
          required:
            - type
            - conversation
        - type: object
          properties:
            type:
              type: string
              enum:
                - bulletin
              description: 'Discriminator value: bulletin'
            bulletin:
              $ref: '#/components/schemas/type_:PodcastBulletinModeData'
              description: The voice settings for the bulletin.
          required:
            - type
            - bulletin
      discriminator:
        propertyName: type
    type_:PodcastTextSource:
      type: object
      properties:
        type:
          type: string
          enum:
            - &ref_0
              type: stringLiteral
              value: text
          description: The type of source to create.
        text:
          type: string
          description: The text to create the podcast from.
      required:
        - type
        - text
    type_:PodcastUrlSource:
      type: object
      properties:
        type:
          type: string
          enum:
            - &ref_1
              type: stringLiteral
              value: url
          description: The type of source to create.
        url:
          type: string
          description: The URL to create the podcast from.
      required:
        - type
        - url
    type_studio:BodyCreatePodcastV1StudioPodcastsPostSourceTwoItem:
      oneOf:
        - type: object
          properties:
            type:
              type: string
              enum:
                - *ref_0
              description: The type of source to create.
            text:
              type: string
              description: The text to create the podcast from.
          required:
            - type
            - text
        - type: object
          properties:
            type:
              type: string
              enum:
                - *ref_1
              description: The type of source to create.
            url:
              type: string
              description: The URL to create the podcast from.
          required:
            - type
            - url
      discriminator:
        propertyName: type
    type_studio:BodyCreatePodcastV1StudioPodcastsPostSource:
      oneOf:
        - $ref: '#/components/schemas/type_:PodcastTextSource'
        - $ref: '#/components/schemas/type_:PodcastUrlSource'
        - type: array
          items:
            $ref: >-
              #/components/schemas/type_studio:BodyCreatePodcastV1StudioPodcastsPostSourceTwoItem
    type_studio:BodyCreatePodcastV1StudioPodcastsPostQualityPreset:
      type: string
      enum:
        - value: standard
        - value: high
        - value: highest
        - value: ultra
        - value: ultra_lossless
      default: standard
    type_studio:BodyCreatePodcastV1StudioPodcastsPostDurationScale:
      type: string
      enum:
        - value: short
        - value: default
        - value: long
      default: default
    type_studio:BodyCreatePodcastV1StudioPodcastsPostApplyTextNormalization:
      type: string
      enum:
        - value: auto
        - value: 'on'
        - value: 'off'
        - value: apply_english
    type_:ProjectResponseModelTargetAudience:
      type: string
      enum:
        - value: children
        - value: young adult
        - value: adult
        - value: all ages
    type_:ProjectState:
      type: string
      enum:
        - value: creating
        - value: default
        - value: converting
        - value: in_queue
    type_:ProjectResponseModelAccessLevel:
      type: string
      enum:
        - value: admin
        - value: editor
        - value: commenter
        - value: viewer
    type_:ProjectResponseModelFiction:
      type: string
      enum:
        - value: fiction
        - value: non-fiction
    type_:ProjectCreationMetaResponseModelStatus:
      type: string
      enum:
        - value: pending
        - value: creating
        - value: finished
        - value: failed
    type_:ProjectCreationMetaResponseModelType:
      type: string
      enum:
        - value: blank
        - value: generate_podcast
        - value: auto_assign_voices
        - value: dub_video
        - value: import_speech
    type_:ProjectCreationMetaResponseModel:
      type: object
      properties:
        creation_progress:
          type: number
          format: double
          description: The progress of the project creation.
        status:
          $ref: '#/components/schemas/type_:ProjectCreationMetaResponseModelStatus'
          description: The status of the project creation action.
        type:
          $ref: '#/components/schemas/type_:ProjectCreationMetaResponseModelType'
          description: The type of the project creation action.
      required:
        - creation_progress
        - status
        - type
    type_:ProjectResponseModelSourceType:
      type: string
      enum:
        - value: blank
        - value: book
        - value: article
        - value: genfm
        - value: video
        - value: screenplay
    type_:CaptionStyleTemplateModel:
      type: object
      properties:
        key:
          type: string
        label:
          type: string
        requires_high_fps:
          type: boolean
          default: false
      required:
        - key
        - label
    type_:CaptionStyleModelTextAlign:
      type: string
      enum:
        - value: start
        - value: center
        - value: end
    type_:CaptionStyleModelTextStyle:
      type: string
      enum:
        - value: normal
        - value: italic
    type_:CaptionStyleModelTextWeight:
      type: string
      enum:
        - value: normal
        - value: bold
    type_:CaptionStyleSectionAnimationModelEnterType:
      type: string
      enum:
        - value: none
        - value: fade
        - value: scale
    type_:CaptionStyleSectionAnimationModelExitType:
      type: string
      enum:
        - value: none
        - value: fade
        - value: scale
    type_:CaptionStyleSectionAnimationModel:
      type: object
      properties:
        enter_type:
          $ref: >-
            #/components/schemas/type_:CaptionStyleSectionAnimationModelEnterType
        exit_type:
          $ref: '#/components/schemas/type_:CaptionStyleSectionAnimationModelExitType'
      required:
        - enter_type
        - exit_type
    type_:CaptionStyleWordAnimationModelEnterType:
      type: string
      enum:
        - value: none
        - value: fade
        - value: scale
    type_:CaptionStyleWordAnimationModelExitType:
      type: string
      enum:
        - value: none
        - value: fade
        - value: scale
    type_:CaptionStyleWordAnimationModel:
      type: object
      properties:
        enter_type:
          $ref: '#/components/schemas/type_:CaptionStyleWordAnimationModelEnterType'
        exit_type:
          $ref: '#/components/schemas/type_:CaptionStyleWordAnimationModelExitType'
      required:
        - enter_type
        - exit_type
    type_:CaptionStyleCharacterAnimationModelEnterType:
      type: string
      enum:
        - value: none
        - value: fade
    type_:CaptionStyleCharacterAnimationModelExitType:
      type: string
      enum:
        - value: none
        - value: fade
    type_:CaptionStyleCharacterAnimationModel:
      type: object
      properties:
        enter_type:
          $ref: >-
            #/components/schemas/type_:CaptionStyleCharacterAnimationModelEnterType
        exit_type:
          $ref: >-
            #/components/schemas/type_:CaptionStyleCharacterAnimationModelExitType
      required:
        - enter_type
        - exit_type
    type_:CaptionStyleHorizontalPlacementModelAlign:
      type: string
      enum:
        - value: left
        - value: center
        - value: right
    type_:CaptionStyleHorizontalPlacementModel:
      type: object
      properties:
        align:
          $ref: '#/components/schemas/type_:CaptionStyleHorizontalPlacementModelAlign'
        translate_pct:
          type: number
          format: double
      required:
        - align
        - translate_pct
    type_:CaptionStyleVerticalPlacementModelAlign:
      type: string
      enum:
        - value: top
        - value: center
        - value: bottom
    type_:CaptionStyleVerticalPlacementModel:
      type: object
      properties:
        align:
          $ref: '#/components/schemas/type_:CaptionStyleVerticalPlacementModelAlign'
        translate_pct:
          type: number
          format: double
      required:
        - align
        - translate_pct
    type_:CaptionStyleModel:
      type: object
      properties:
        template:
          $ref: '#/components/schemas/type_:CaptionStyleTemplateModel'
        text_font:
          type: string
        text_scale:
          type: number
          format: double
        text_color:
          type: string
        text_align:
          $ref: '#/components/schemas/type_:CaptionStyleModelTextAlign'
        text_style:
          $ref: '#/components/schemas/type_:CaptionStyleModelTextStyle'
        text_weight:
          $ref: '#/components/schemas/type_:CaptionStyleModelTextWeight'
        background_enabled:
          type: boolean
        background_color:
          type: string
        background_opacity:
          type: number
          format: double
        word_highlights_enabled:
          type: boolean
        word_highlights_color:
          type: string
        word_highlights_background_color:
          type: string
        word_highlights_opacity:
          type: number
          format: double
        section_animation:
          $ref: '#/components/schemas/type_:CaptionStyleSectionAnimationModel'
        word_animation:
          $ref: '#/components/schemas/type_:CaptionStyleWordAnimationModel'
        character_animation:
          $ref: '#/components/schemas/type_:CaptionStyleCharacterAnimationModel'
        width_pct:
          type: number
          format: double
        horizontal_placement:
          $ref: '#/components/schemas/type_:CaptionStyleHorizontalPlacementModel'
        vertical_placement:
          $ref: '#/components/schemas/type_:CaptionStyleVerticalPlacementModel'
        auto_break_enabled:
          type: boolean
        max_lines_per_section:
          type: integer
        max_words_per_line:
          type: integer
    type_:ProjectResponseModelAspectRatio:
      type: string
      enum:
        - value: '16:9'
        - value: '9:16'
        - value: '4:5'
        - value: '1:1'
    type_:ProjectResponse:
      type: object
      properties:
        project_id:
          type: string
          description: The ID of the project.
        name:
          type: string
          description: The name of the project.
        create_date_unix:
          type: integer
          description: The creation date of the project.
        created_by_user_id:
          type: string
          description: The user ID who created the project.
        default_title_voice_id:
          type: string
          description: The default title voice ID.
        default_paragraph_voice_id:
          type: string
          description: The default paragraph voice ID.
        default_model_id:
          type: string
          description: The default model ID.
        last_conversion_date_unix:
          type: integer
          description: The last conversion date of the project.
        can_be_downloaded:
          type: boolean
          description: Whether the project can be downloaded.
        title:
          type: string
          description: The title of the project.
        author:
          type: string
          description: The author of the project.
        description:
          type: string
          description: The description of the project.
        genres:
          type: array
          items:
            type: string
          description: List of genres of the project.
        cover_image_url:
          type: string
          description: The cover image URL of the project.
        target_audience:
          $ref: '#/components/schemas/type_:ProjectResponseModelTargetAudience'
          description: The target audience of the project.
        language:
          type: string
          description: Two-letter language code (ISO 639-1) of the language of the project.
        content_type:
          type: string
          description: The content type of the project, e.g. 'Novel' or 'Short Story'
        original_publication_date:
          type: string
          description: The original publication date of the project.
        mature_content:
          type: boolean
          description: Whether the project contains mature content.
        isbn_number:
          type: string
          description: The ISBN number of the project.
        volume_normalization:
          type: boolean
          description: Whether the project uses volume normalization.
        state:
          $ref: '#/components/schemas/type_:ProjectState'
          description: The state of the project.
        access_level:
          $ref: '#/components/schemas/type_:ProjectResponseModelAccessLevel'
          description: The access level of the project.
        fiction:
          $ref: '#/components/schemas/type_:ProjectResponseModelFiction'
          description: Whether the project is fiction.
        quality_check_on:
          type: boolean
          description: Whether quality check is enabled for this project.
        quality_check_on_when_bulk_convert:
          type: boolean
          description: >-
            Whether quality check is enabled on the project when bulk
            converting.
        creation_meta:
          $ref: '#/components/schemas/type_:ProjectCreationMetaResponseModel'
          description: The creation meta of the project.
        source_type:
          $ref: '#/components/schemas/type_:ProjectResponseModelSourceType'
          description: The source type of the project.
        chapters_enabled:
          type: boolean
          description: Whether chapters are enabled for the project.
        captions_enabled:
          type: boolean
          description: Whether captions are enabled for the project.
        caption_style:
          $ref: '#/components/schemas/type_:CaptionStyleModel'
          description: Global styling to be applied to all captions
        caption_style_template_overrides:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/type_:CaptionStyleModel'
          description: Styling changes that have been made to the provided templates
        public_share_id:
          type: string
          description: The public share ID of the project.
        aspect_ratio:
          $ref: '#/components/schemas/type_:ProjectResponseModelAspectRatio'
          description: The aspect ratio of the project.
      required:
        - project_id
        - name
        - create_date_unix
        - default_title_voice_id
        - default_paragraph_voice_id
        - default_model_id
        - can_be_downloaded
        - volume_normalization
        - state
        - access_level
        - quality_check_on
        - quality_check_on_when_bulk_convert
    type_:PodcastProjectResponseModel:
      type: object
      properties:
        project:
          $ref: '#/components/schemas/type_:ProjectResponse'
          description: The project associated with the created podcast.
      required:
        - project

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.studio.createPodcast({
        safetyIdentifier: "safety-identifier",
        modelId: "eleven_multilingual_v2",
        mode: {
            type: "conversation",
            conversation: {
                hostVoiceId: "aw1NgEzBg83R7vgmiJt6",
                guestVoiceId: "aw1NgEzBg83R7vgmiJt7",
            },
        },
        source: {
            type: "text",
            text: "This is a test podcast.",
        },
    });
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.studio.create_podcast(
    safety_identifier="safety-identifier",
    model_id="eleven_multilingual_v2",
    mode={
        "type": "conversation",
        "conversation": {
            "host_voice_id": "aw1NgEzBg83R7vgmiJt6",
            "guest_voice_id": "aw1NgEzBg83R7vgmiJt7"
        }
    },
    source={
        "type": "text",
        "text": "This is a test podcast."
    }
)

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/studio/podcasts"

	payload := strings.NewReader("{\n  \"model_id\": \"eleven_multilingual_v2\",\n  \"mode\": {\n    \"type\": \"conversation\",\n    \"conversation\": {\n      \"host_voice_id\": \"aw1NgEzBg83R7vgmiJt6\",\n      \"guest_voice_id\": \"aw1NgEzBg83R7vgmiJt7\"\n    }\n  },\n  \"source\": {\n    \"type\": \"text\",\n    \"text\": \"This is a test podcast.\"\n  }\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("safety-identifier", "safety-identifier")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/studio/podcasts")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["safety-identifier"] = 'safety-identifier'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"model_id\": \"eleven_multilingual_v2\",\n  \"mode\": {\n    \"type\": \"conversation\",\n    \"conversation\": {\n      \"host_voice_id\": \"aw1NgEzBg83R7vgmiJt6\",\n      \"guest_voice_id\": \"aw1NgEzBg83R7vgmiJt7\"\n    }\n  },\n  \"source\": {\n    \"type\": \"text\",\n    \"text\": \"This is a test podcast.\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/podcasts")
  .header("safety-identifier", "safety-identifier")
  .header("Content-Type", "application/json")
  .body("{\n  \"model_id\": \"eleven_multilingual_v2\",\n  \"mode\": {\n    \"type\": \"conversation\",\n    \"conversation\": {\n      \"host_voice_id\": \"aw1NgEzBg83R7vgmiJt6\",\n      \"guest_voice_id\": \"aw1NgEzBg83R7vgmiJt7\"\n    }\n  },\n  \"source\": {\n    \"type\": \"text\",\n    \"text\": \"This is a test podcast.\"\n  }\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/podcasts', [
  'body' => '{
  "model_id": "eleven_multilingual_v2",
  "mode": {
    "type": "conversation",
    "conversation": {
      "host_voice_id": "aw1NgEzBg83R7vgmiJt6",
      "guest_voice_id": "aw1NgEzBg83R7vgmiJt7"
    }
  },
  "source": {
    "type": "text",
    "text": "This is a test podcast."
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
    'safety-identifier' => 'safety-identifier',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/studio/podcasts");
var request = new RestRequest(Method.POST);
request.AddHeader("safety-identifier", "safety-identifier");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"model_id\": \"eleven_multilingual_v2\",\n  \"mode\": {\n    \"type\": \"conversation\",\n    \"conversation\": {\n      \"host_voice_id\": \"aw1NgEzBg83R7vgmiJt6\",\n      \"guest_voice_id\": \"aw1NgEzBg83R7vgmiJt7\"\n    }\n  },\n  \"source\": {\n    \"type\": \"text\",\n    \"text\": \"This is a test podcast.\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "safety-identifier": "safety-identifier",
  "Content-Type": "application/json"
]
let parameters = [
  "model_id": "eleven_multilingual_v2",
  "mode": [
    "type": "conversation",
    "conversation": [
      "host_voice_id": "aw1NgEzBg83R7vgmiJt6",
      "guest_voice_id": "aw1NgEzBg83R7vgmiJt7"
    ]
  ],
  "source": [
    "type": "text",
    "text": "This is a test podcast."
  ]
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/podcasts")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```