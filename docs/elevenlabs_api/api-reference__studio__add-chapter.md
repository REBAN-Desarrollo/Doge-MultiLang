# Create Chapter

POST https://api.elevenlabs.io/v1/studio/projects/{project_id}/chapters
Content-Type: application/json

Creates a new chapter either as blank or from a URL.

Reference: https://elevenlabs.io/docs/api-reference/studio/add-chapter

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create Chapter
  version: endpoint_studio/projects/chapters.create
paths:
  /v1/studio/projects/{project_id}/chapters:
    post:
      operationId: create
      summary: Create Chapter
      description: Creates a new chapter either as blank or from a URL.
      tags:
        - - subpackage_studio
          - subpackage_studio/projects
          - subpackage_studio/projects/chapters
      parameters:
        - name: project_id
          in: path
          description: The ID of the Studio project.
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
                $ref: '#/components/schemas/type_:AddChapterResponseModel'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: The name of the chapter, used for identification only.
                from_url:
                  type: string
                  description: >-
                    An optional URL from which we will extract content to
                    initialize the Studio project. If this is set, 'from_url'
                    and 'from_content' must be null. If neither 'from_url',
                    'from_document', 'from_content' are provided we will
                    initialize the Studio project as blank.
              required:
                - name
components:
  schemas:
    type_:ChapterWithContentResponseModelState:
      type: string
      enum:
        - value: default
        - value: converting
    type_:ChapterStatisticsResponse:
      type: object
      properties:
        characters_unconverted:
          type: integer
          description: The number of unconverted characters.
        characters_converted:
          type: integer
          description: The number of converted characters.
        paragraphs_converted:
          type: integer
          description: The number of converted paragraphs.
        paragraphs_unconverted:
          type: integer
          description: The number of unconverted paragraphs.
      required:
        - characters_unconverted
        - characters_converted
        - paragraphs_converted
        - paragraphs_unconverted
    type_:ChapterContentBlockResponseModelNodesItem:
      oneOf:
        - type: object
          properties:
            type:
              type: string
              enum:
                - tts_node
              description: 'Discriminator value: tts_node'
            voice_id:
              type: string
            text:
              type: string
          required:
            - type
            - voice_id
            - text
        - type: object
          properties:
            type:
              type: string
              enum:
                - _other
              description: 'Discriminator value: _other'
          required:
            - type
      discriminator:
        propertyName: type
    type_:ChapterContentBlockResponseModel:
      type: object
      properties:
        block_id:
          type: string
        nodes:
          type: array
          items:
            $ref: >-
              #/components/schemas/type_:ChapterContentBlockResponseModelNodesItem
      required:
        - block_id
        - nodes
    type_:ChapterContentResponseModel:
      type: object
      properties:
        blocks:
          type: array
          items:
            $ref: '#/components/schemas/type_:ChapterContentBlockResponseModel'
      required:
        - blocks
    type_:ChapterWithContentResponseModel:
      type: object
      properties:
        chapter_id:
          type: string
          description: The ID of the chapter.
        name:
          type: string
          description: The name of the chapter.
        last_conversion_date_unix:
          type: integer
          description: The last conversion date of the chapter.
        conversion_progress:
          type: number
          format: double
          description: The conversion progress of the chapter.
        can_be_downloaded:
          type: boolean
          description: Whether the chapter can be downloaded.
        state:
          $ref: '#/components/schemas/type_:ChapterWithContentResponseModelState'
          description: The state of the chapter.
        has_video:
          type: boolean
          description: Whether the chapter has a video.
        voice_ids:
          type: array
          items:
            type: string
          description: List of voice ids used by the chapter
        statistics:
          $ref: '#/components/schemas/type_:ChapterStatisticsResponse'
          description: The statistics of the chapter.
        last_conversion_error:
          type: string
          description: The last conversion error of the chapter.
        content:
          $ref: '#/components/schemas/type_:ChapterContentResponseModel'
      required:
        - chapter_id
        - name
        - can_be_downloaded
        - state
        - content
    type_:AddChapterResponseModel:
      type: object
      properties:
        chapter:
          $ref: '#/components/schemas/type_:ChapterWithContentResponseModel'
      required:
        - chapter

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.studio.projects.chapters.create("21m00Tcm4TlvDq8ikWAM", {
        name: "Chapter 1",
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

client.studio.projects.chapters.create(
    project_id="21m00Tcm4TlvDq8ikWAM",
    name="Chapter 1"
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

	url := "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters"

	payload := strings.NewReader("{\n  \"name\": \"Chapter 1\"\n}")

	req, _ := http.NewRequest("POST", url, payload)

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

url = URI("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"name\": \"Chapter 1\"\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters")
  .header("Content-Type", "application/json")
  .body("{\n  \"name\": \"Chapter 1\"\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters', [
  'body' => '{
  "name": "Chapter 1"
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"name\": \"Chapter 1\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["name": "Chapter 1"] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters")! as URL,
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