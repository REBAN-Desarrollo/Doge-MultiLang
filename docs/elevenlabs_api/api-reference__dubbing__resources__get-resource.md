# Get dubbing resource

GET https://api.elevenlabs.io/v1/dubbing/resource/{dubbing_id}

Given a dubbing ID generated from the '/v1/dubbing' endpoint with studio enabled, returns the dubbing resource.

Reference: https://elevenlabs.io/docs/api-reference/dubbing/resources/get-resource

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get dubbing resource
  version: endpoint_dubbing/resource.get
paths:
  /v1/dubbing/resource/{dubbing_id}:
    get:
      operationId: get
      summary: Get dubbing resource
      description: >-
        Given a dubbing ID generated from the '/v1/dubbing' endpoint with studio
        enabled, returns the dubbing resource.
      tags:
        - - subpackage_dubbing
          - subpackage_dubbing/resource
      parameters:
        - name: dubbing_id
          in: path
          description: ID of the dubbing project.
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
                $ref: '#/components/schemas/type_:DubbingResource'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:DubbingMediaReference:
      type: object
      properties:
        src:
          type: string
        content_type:
          type: string
        bucket_name:
          type: string
        random_path_slug:
          type: string
        duration_secs:
          type: number
          format: double
        is_audio:
          type: boolean
        url:
          type: string
      required:
        - src
        - content_type
        - bucket_name
        - random_path_slug
        - duration_secs
        - is_audio
        - url
    type_:SpeakerTrack:
      type: object
      properties:
        id:
          type: string
        media_ref:
          $ref: '#/components/schemas/type_:DubbingMediaReference'
        speaker_name:
          type: string
        voices:
          type: object
          additionalProperties:
            type: string
        segments:
          type: array
          items:
            type: string
      required:
        - id
        - media_ref
        - speaker_name
        - voices
        - segments
    type_:SegmentSubtitleFrame:
      type: object
      properties:
        start_time:
          type: number
          format: double
        end_time:
          type: number
          format: double
        lines:
          type: array
          items:
            type: string
      required:
        - start_time
        - end_time
        - lines
    type_:DubbedSegment:
      type: object
      properties:
        start_time:
          type: number
          format: double
        end_time:
          type: number
          format: double
        text:
          type: string
        subtitles:
          type: array
          items:
            $ref: '#/components/schemas/type_:SegmentSubtitleFrame'
        audio_stale:
          type: boolean
        media_ref:
          $ref: '#/components/schemas/type_:DubbingMediaReference'
      required:
        - start_time
        - end_time
        - subtitles
        - audio_stale
    type_:SpeakerSegment:
      type: object
      properties:
        id:
          type: string
        start_time:
          type: number
          format: double
        end_time:
          type: number
          format: double
        text:
          type: string
        subtitles:
          type: array
          items:
            $ref: '#/components/schemas/type_:SegmentSubtitleFrame'
        dubs:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/type_:DubbedSegment'
      required:
        - id
        - start_time
        - end_time
        - text
        - subtitles
        - dubs
    type_:RenderType:
      type: string
      enum:
        - value: mp4
        - value: aac
        - value: mp3
        - value: wav
        - value: aaf
        - value: tracks_zip
        - value: clips_zip
    type_:RenderStatus:
      type: string
      enum:
        - value: complete
        - value: processing
        - value: failed
    type_:Render:
      type: object
      properties:
        id:
          type: string
        version:
          type: integer
        language:
          type: string
        type:
          $ref: '#/components/schemas/type_:RenderType'
        media_ref:
          $ref: '#/components/schemas/type_:DubbingMediaReference'
        status:
          $ref: '#/components/schemas/type_:RenderStatus'
      required:
        - id
        - version
        - status
    type_:DubbingResource:
      type: object
      properties:
        id:
          type: string
        version:
          type: integer
        source_language:
          type: string
        target_languages:
          type: array
          items:
            type: string
        input:
          $ref: '#/components/schemas/type_:DubbingMediaReference'
        background:
          $ref: '#/components/schemas/type_:DubbingMediaReference'
        foreground:
          $ref: '#/components/schemas/type_:DubbingMediaReference'
        speaker_tracks:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/type_:SpeakerTrack'
        speaker_segments:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/type_:SpeakerSegment'
        renders:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/type_:Render'
      required:
        - id
        - version
        - source_language
        - target_languages
        - input
        - speaker_tracks
        - speaker_segments
        - renders

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.dubbing.resource.get("dubbing_id");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.dubbing.resource.get(
    dubbing_id="dubbing_id"
)

```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id"

	req, _ := http.NewRequest("GET", url, nil)

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

url = URI("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"

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