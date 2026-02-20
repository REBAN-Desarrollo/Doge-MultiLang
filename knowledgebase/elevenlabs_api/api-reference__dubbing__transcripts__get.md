# Retrieve A Transcript

GET https://api.elevenlabs.io/v1/dubbing/{dubbing_id}/transcripts/{language_code}/format/{format_type}

Fetch the transcript for one of the languages in a dub.

Reference: https://elevenlabs.io/docs/api-reference/dubbing/transcripts/get

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Retrieve A Transcript
  version: endpoint_dubbing/transcripts.get
paths:
  /v1/dubbing/{dubbing_id}/transcripts/{language_code}/format/{format_type}:
    get:
      operationId: get
      summary: Retrieve A Transcript
      description: Fetch the transcript for one of the languages in a dub.
      tags:
        - - subpackage_dubbing
          - subpackage_dubbing/transcripts
      parameters:
        - name: dubbing_id
          in: path
          description: ID of the dubbing project.
          required: true
          schema:
            type: string
        - name: language_code
          in: path
          description: >-
            ISO-693 language code to retrieve the transcript for. Use 'source'
            to fetch the transcript of the original media.
          required: true
          schema:
            type: string
        - name: format_type
          in: path
          description: >-
            Format to return transcript in. For subtitles use either 'srt' or
            'webvtt', and for a full transcript use 'json'. The 'json' format is
            not yet supported for Dubbing Studio.
          required: true
          schema:
            $ref: >-
              #/components/schemas/type_dubbing/transcripts:TranscriptsGetRequestFormatType
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
                $ref: '#/components/schemas/type_:DubbingTranscriptsResponseModel'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_dubbing/transcripts:TranscriptsGetRequestFormatType:
      type: string
      enum:
        - value: srt
        - value: webvtt
        - value: json
    type_:DubbingTranscriptsResponseModelTranscriptFormat:
      type: string
      enum:
        - value: srt
        - value: webvtt
        - value: json
    type_:DubbingTranscriptCharacter:
      type: object
      properties:
        text:
          type: string
          default: ''
        start_s:
          type: number
          format: double
          default: 0
        end_s:
          type: number
          format: double
          default: 0
    type_:DubbingTranscriptWord:
      type: object
      properties:
        text:
          type: string
          default: ''
        word_type:
          type: string
          default: unknown
        start_s:
          type: number
          format: double
          default: 0
        end_s:
          type: number
          format: double
          default: 0
        characters:
          type: array
          items:
            $ref: '#/components/schemas/type_:DubbingTranscriptCharacter'
    type_:DubbingTranscriptUtterance:
      type: object
      properties:
        text:
          type: string
          default: ''
        speaker_id:
          type: string
          default: unknown
        start_s:
          type: number
          format: double
          default: 0
        end_s:
          type: number
          format: double
          default: 0
        words:
          type: array
          items:
            $ref: '#/components/schemas/type_:DubbingTranscriptWord'
    type_:DubbingTranscript:
      type: object
      properties:
        language:
          type: string
        utterances:
          type: array
          items:
            $ref: '#/components/schemas/type_:DubbingTranscriptUtterance'
      required:
        - language
        - utterances
    type_:DubbingTranscriptsResponseModel:
      type: object
      properties:
        transcript_format:
          $ref: >-
            #/components/schemas/type_:DubbingTranscriptsResponseModelTranscriptFormat
        srt:
          type: string
        webvtt:
          type: string
        json:
          $ref: '#/components/schemas/type_:DubbingTranscript'
      required:
        - transcript_format

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.dubbing.transcripts.get("dubbing_id", "source", "srt");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.dubbing.transcripts.get(
    dubbing_id="dubbing_id",
    language_code="source",
    format_type="srt"
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

	url := "https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcripts/source/format/srt"

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

url = URI("https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcripts/source/format/srt")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcripts/source/format/srt")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcripts/source/format/srt');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcripts/source/format/srt");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcripts/source/format/srt")! as URL,
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