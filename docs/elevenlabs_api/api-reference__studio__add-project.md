# Create Studio Project

POST https://api.elevenlabs.io/v1/studio/projects
Content-Type: multipart/form-data

Creates a new Studio project, it can be either initialized as blank, from a document or from a URL.

Reference: https://elevenlabs.io/docs/api-reference/studio/add-project

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create Studio Project
  version: endpoint_studio/projects.create
paths:
  /v1/studio/projects:
    post:
      operationId: create
      summary: Create Studio Project
      description: >-
        Creates a new Studio project, it can be either initialized as blank,
        from a document or from a URL.
      tags:
        - - subpackage_studio
          - subpackage_studio/projects
      parameters:
        - name: xi-api-key
          in: header
          required: false
          schema:
            type: string
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/type_:AddProjectResponseModel'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: >-
                    The name of the Studio project, used for identification
                    only.
                default_title_voice_id:
                  type: string
                  description: >-
                    The voice_id that corresponds to the default voice used for
                    new titles.
                default_paragraph_voice_id:
                  type: string
                  description: >-
                    The voice_id that corresponds to the default voice used for
                    new paragraphs.
                default_model_id:
                  type: string
                  description: >-
                    The ID of the model to be used for this Studio project, you
                    can query GET /v1/models to list all available models.
                from_url:
                  type: string
                  description: >-
                    An optional URL from which we will extract content to
                    initialize the Studio project. If this is set, 'from_url'
                    and 'from_content' must be null. If neither 'from_url',
                    'from_document', 'from_content' are provided we will
                    initialize the Studio project as blank.
                from_document:
                  type: string
                  format: binary
                  description: >-
                    An optional .epub, .pdf, .txt or similar file can be
                    provided. If provided, we will initialize the Studio project
                    with its content. If this is set, 'from_url' and
                    'from_content' must be null. If neither 'from_url',
                    'from_document', 'from_content' are provided we will
                    initialize the Studio project as blank.
                from_content_json:
                  type: string
                  description: |2-

                        An optional content to initialize the Studio project with. If this is set, 'from_url' and 'from_document' must be null. If neither 'from_url', 'from_document', 'from_content' are provided we will initialize the Studio project as blank.

                        Example:
                        [{"name": "Chapter A", "blocks": [{"sub_type": "p", "nodes": [{"voice_id": "6lCwbsX1yVjD49QmpkT0", "text": "A", "type": "tts_node"}, {"voice_id": "6lCwbsX1yVjD49QmpkT1", "text": "B", "type": "tts_node"}]}, {"sub_type": "h1", "nodes": [{"voice_id": "6lCwbsX1yVjD49QmpkT0", "text": "C", "type": "tts_node"}, {"voice_id": "6lCwbsX1yVjD49QmpkT1", "text": "D", "type": "tts_node"}]}]}, {"name": "Chapter B", "blocks": [{"sub_type": "p", "nodes": [{"voice_id": "6lCwbsX1yVjD49QmpkT0", "text": "E", "type": "tts_node"}, {"voice_id": "6lCwbsX1yVjD49QmpkT1", "text": "F", "type": "tts_node"}]}, {"sub_type": "h2", "nodes": [{"voice_id": "6lCwbsX1yVjD49QmpkT0", "text": "G", "type": "tts_node"}, {"voice_id": "6lCwbsX1yVjD49QmpkT1", "text": "H", "type": "tts_node"}]}]}]
                        
                quality_preset:
                  $ref: >-
                    #/components/schemas/type_studio/projects:ProjectsCreateRequestQualityPreset
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
                title:
                  type: string
                  description: >-
                    An optional name of the author of the Studio project, this
                    will be added as metadata to the mp3 file on Studio project
                    or chapter download.
                author:
                  type: string
                  description: >-
                    An optional name of the author of the Studio project, this
                    will be added as metadata to the mp3 file on Studio project
                    or chapter download.
                description:
                  type: string
                  description: An optional description of the Studio project.
                genres:
                  type: array
                  items:
                    type: string
                  description: >-
                    An optional list of genres associated with the Studio
                    project.
                target_audience:
                  $ref: >-
                    #/components/schemas/type_studio/projects:ProjectsCreateRequestTargetAudience
                  description: An optional target audience of the Studio project.
                language:
                  type: string
                  description: >-
                    An optional language of the Studio project. Two-letter
                    language code (ISO 639-1).
                content_type:
                  type: string
                  description: An optional content type of the Studio project.
                original_publication_date:
                  type: string
                  description: >-
                    An optional original publication date of the Studio project,
                    in the format YYYY-MM-DD or YYYY.
                mature_content:
                  type: boolean
                  description: >-
                    An optional specification of whether this Studio project
                    contains mature content.
                isbn_number:
                  type: string
                  description: >-
                    An optional ISBN number of the Studio project you want to
                    create, this will be added as metadata to the mp3 file on
                    Studio project or chapter download.
                acx_volume_normalization:
                  type: boolean
                  default: false
                  description: >-
                    [Deprecated] When the Studio project is downloaded, should
                    the returned audio have postprocessing in order to make it
                    compliant with audiobook normalized volume requirements
                volume_normalization:
                  type: boolean
                  default: false
                  description: >-
                    When the Studio project is downloaded, should the returned
                    audio have postprocessing in order to make it compliant with
                    audiobook normalized volume requirements
                pronunciation_dictionary_locators:
                  type: array
                  items:
                    type: string
                  description: >-
                    A list of pronunciation dictionary locators
                    (pronunciation_dictionary_id, version_id) encoded as a list
                    of JSON strings for pronunciation dictionaries to be applied
                    to the text. A list of json encoded strings is required as
                    adding projects may occur through formData as opposed to
                    jsonBody. To specify multiple dictionaries use multiple
                    --form lines in your curl, such as --form
                    'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"Vmd4Zor6fplcA7WrINey\",\"version_id\":\"hRPaxjlTdR7wFMhV4w0b\"}"'
                    --form
                    'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"JzWtcGQMJ6bnlWwyMo7e\",\"version_id\":\"lbmwxiLu4q6txYxgdZqn\"}"'.
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
                        
                fiction:
                  $ref: >-
                    #/components/schemas/type_studio/projects:ProjectsCreateRequestFiction
                  description: >-
                    An optional specification of whether the content of this
                    Studio project is fiction.
                apply_text_normalization:
                  $ref: >-
                    #/components/schemas/type_studio/projects:ProjectsCreateRequestApplyTextNormalization
                  description: |2-

                        This parameter controls text normalization with four modes: 'auto', 'on', 'apply_english' and 'off'.
                        When set to 'auto', the system will automatically decide whether to apply text normalization
                        (e.g., spelling out numbers). With 'on', text normalization will always be applied, while
                        with 'off', it will be skipped. 'apply_english' is the same as 'on' but will assume that text is in English.
                        
                auto_convert:
                  type: boolean
                  default: false
                  description: Whether to auto convert the Studio project to audio or not.
                auto_assign_voices:
                  type: boolean
                  description: >-
                    [Alpha Feature] Whether automatically assign voices to
                    phrases in the create Project.
                source_type:
                  $ref: >-
                    #/components/schemas/type_studio/projects:ProjectsCreateRequestSourceType
                  description: The type of Studio project to create.
                voice_settings:
                  type: array
                  items:
                    type: string
                  description: |2-
                        Optional voice settings overrides for the project, encoded as a list of JSON strings.

                        Example:
                        ["{\"voice_id\": \"21m00Tcm4TlvDq8ikWAM\", \"stability\": 0.7, \"similarity_boost\": 0.8, \"style\": 0.5, \"speed\": 1.0, \"use_speaker_boost\": true}"]
                        
                create_publishing_read:
                  type: boolean
                  description: >-
                    If true, creates a corresponding read for direct publishing
                    in draft state
              required:
                - name
components:
  schemas:
    type_studio/projects:ProjectsCreateRequestQualityPreset:
      type: string
      enum:
        - value: standard
        - value: high
        - value: ultra
        - value: ultra_lossless
      default: standard
    type_studio/projects:ProjectsCreateRequestTargetAudience:
      type: string
      enum:
        - value: children
        - value: young adult
        - value: adult
        - value: all ages
    type_studio/projects:ProjectsCreateRequestFiction:
      type: string
      enum:
        - value: fiction
        - value: non-fiction
    type_studio/projects:ProjectsCreateRequestApplyTextNormalization:
      type: string
      enum:
        - value: auto
        - value: 'on'
        - value: 'off'
        - value: apply_english
    type_studio/projects:ProjectsCreateRequestSourceType:
      type: string
      enum:
        - value: blank
        - value: book
        - value: article
        - value: genfm
        - value: video
        - value: screenplay
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
    type_:AddProjectResponseModel:
      type: object
      properties:
        project:
          $ref: '#/components/schemas/type_:ProjectResponse'
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
    await client.studio.projects.create({});
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.studio.projects.create()

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

	url := "https://api.elevenlabs.io/v1/studio/projects"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nname\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_title_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_paragraph_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_model_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"quality_preset\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"author\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"genres\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"target_audience\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"content_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"original_publication_date\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"mature_content\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"isbn_number\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"acx_volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"pronunciation_dictionary_locators\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"callback_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"fiction\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"apply_text_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_assign_voices\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"source_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"voice_settings\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"create_publishing_read\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")

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

url = URI("https://api.elevenlabs.io/v1/studio/projects")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nname\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_title_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_paragraph_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_model_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"quality_preset\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"author\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"genres\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"target_audience\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"content_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"original_publication_date\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"mature_content\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"isbn_number\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"acx_volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"pronunciation_dictionary_locators\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"callback_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"fiction\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"apply_text_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_assign_voices\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"source_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"voice_settings\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"create_publishing_read\"\r\n\r\n\r\n-----011000010111000001101001--\r\n"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/projects")
  .header("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nname\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_title_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_paragraph_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_model_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"quality_preset\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"author\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"genres\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"target_audience\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"content_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"original_publication_date\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"mature_content\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"isbn_number\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"acx_volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"pronunciation_dictionary_locators\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"callback_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"fiction\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"apply_text_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_assign_voices\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"source_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"voice_settings\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"create_publishing_read\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/projects', [
  'multipart' => [
    [
        'name' => 'name',
        'contents' => 'name'
    ],
    [
        'name' => 'from_document',
        'filename' => '<file1>',
        'contents' => null
    ]
  ]
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects");
var request = new RestRequest(Method.POST);
request.AddParameter("multipart/form-data; boundary=---011000010111000001101001", "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nname\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_title_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_paragraph_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_model_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"quality_preset\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"author\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"genres\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"target_audience\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"content_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"original_publication_date\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"mature_content\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"isbn_number\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"acx_volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"pronunciation_dictionary_locators\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"callback_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"fiction\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"apply_text_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_assign_voices\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"source_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"voice_settings\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"create_publishing_read\"\r\n\r\n\r\n-----011000010111000001101001--\r\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "multipart/form-data; boundary=---011000010111000001101001"]
let parameters = [
  [
    "name": "name",
    "value": "name"
  ],
  [
    "name": "default_title_voice_id",
    "value": 
  ],
  [
    "name": "default_paragraph_voice_id",
    "value": 
  ],
  [
    "name": "default_model_id",
    "value": 
  ],
  [
    "name": "from_url",
    "value": 
  ],
  [
    "name": "from_document",
    "fileName": "<file1>"
  ],
  [
    "name": "from_content_json",
    "value": 
  ],
  [
    "name": "quality_preset",
    "value": 
  ],
  [
    "name": "title",
    "value": 
  ],
  [
    "name": "author",
    "value": 
  ],
  [
    "name": "description",
    "value": 
  ],
  [
    "name": "genres",
    "value": 
  ],
  [
    "name": "target_audience",
    "value": 
  ],
  [
    "name": "language",
    "value": 
  ],
  [
    "name": "content_type",
    "value": 
  ],
  [
    "name": "original_publication_date",
    "value": 
  ],
  [
    "name": "mature_content",
    "value": 
  ],
  [
    "name": "isbn_number",
    "value": 
  ],
  [
    "name": "acx_volume_normalization",
    "value": 
  ],
  [
    "name": "volume_normalization",
    "value": 
  ],
  [
    "name": "pronunciation_dictionary_locators",
    "value": 
  ],
  [
    "name": "callback_url",
    "value": 
  ],
  [
    "name": "fiction",
    "value": 
  ],
  [
    "name": "apply_text_normalization",
    "value": 
  ],
  [
    "name": "auto_convert",
    "value": 
  ],
  [
    "name": "auto_assign_voices",
    "value": 
  ],
  [
    "name": "source_type",
    "value": 
  ],
  [
    "name": "voice_settings",
    "value": 
  ],
  [
    "name": "create_publishing_read",
    "value": 
  ]
]

let boundary = "---011000010111000001101001"

var body = ""
var error: NSError? = nil
for param in parameters {
  let paramName = param["name"]!
  body += "--\(boundary)\r\n"
  body += "Content-Disposition:form-data; name=\"\(paramName)\""
  if let filename = param["fileName"] {
    let contentType = param["content-type"]!
    let fileContent = String(contentsOfFile: filename, encoding: String.Encoding.utf8)
    if (error != nil) {
      print(error as Any)
    }
    body += "; filename=\"\(filename)\"\r\n"
    body += "Content-Type: \(contentType)\r\n\r\n"
    body += fileContent
  } else if let paramValue = param["value"] {
    body += "\r\n\r\n\(paramValue)"
  }
}

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects")! as URL,
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