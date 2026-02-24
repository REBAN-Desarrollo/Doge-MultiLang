# Update Studio Project Content

POST https://api.elevenlabs.io/v1/studio/projects/{project_id}/content
Content-Type: multipart/form-data

Updates Studio project content.

Reference: https://elevenlabs.io/docs/api-reference/studio/update-content

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update Studio Project Content
  version: endpoint_studio/projects/content.update
paths:
  /v1/studio/projects/{project_id}/content:
    post:
      operationId: update
      summary: Update Studio Project Content
      description: Updates Studio project content.
      tags:
        - - subpackage_studio
          - subpackage_studio/projects
          - subpackage_studio/projects/content
      parameters:
        - name: project_id
          in: path
          description: >-
            The ID of the project to be used. You can use the [List
            projects](/docs/api-reference/studio/get-projects) endpoint to list
            all the available projects.
          required: true
          schema:
            type: string
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
                $ref: '#/components/schemas/type_:EditProjectResponseModel'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
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
                        
                auto_convert:
                  type: boolean
                  default: false
                  description: Whether to auto convert the Studio project to audio or not.
components:
  schemas:
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
    type_:EditProjectResponseModel:
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
    await client.studio.projects.content.update("21m00Tcm4TlvDq8ikWAM", {});
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.studio.projects.content.update(
    project_id="21m00Tcm4TlvDq8ikWAM"
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

	url := "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/content"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

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

url = URI("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/content")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001--\r\n"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/content")
  .header("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/content', [
  'multipart' => [
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

var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/content");
var request = new RestRequest(Method.POST);
request.AddParameter("multipart/form-data; boundary=---011000010111000001101001", "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001--\r\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "multipart/form-data; boundary=---011000010111000001101001"]
let parameters = [
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
    "name": "auto_convert",
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

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/content")! as URL,
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