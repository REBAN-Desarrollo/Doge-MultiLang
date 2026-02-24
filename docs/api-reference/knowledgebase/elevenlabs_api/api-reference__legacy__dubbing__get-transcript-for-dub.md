# Get dubbed transcript

GET https://api.elevenlabs.io/v1/dubbing/{dubbing_id}/transcript/{language_code}

Returns transcript for the dub as an SRT or WEBVTT file.

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get dubbed transcript
  version: endpoint_dubbing/transcript.get_transcript_for_dub
paths:
  /v1/dubbing/{dubbing_id}/transcript/{language_code}:
    get:
      operationId: get-transcript-for-dub
      summary: Get dubbed transcript
      description: Returns transcript for the dub as an SRT or WEBVTT file.
      tags:
        - - subpackage_dubbing
          - subpackage_dubbing/transcript
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
          in: query
          description: >-
            Format to return transcript in. For subtitles use either 'srt' or
            'webvtt', and for a full transcript use 'json'. The 'json' format is
            not yet supported for Dubbing Studio.
          required: false
          schema:
            $ref: >-
              #/components/schemas/type_dubbing/transcript:TranscriptGetTranscriptForDubRequestFormatType
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
                $ref: >-
                  #/components/schemas/type_dubbing/transcript:TranscriptGetTranscriptForDubResponse
        '403':
          description: Anonymous users cannot use this function
          content: {}
        '404':
          description: Dubbing or transcript not found
          content: {}
        '422':
          description: Validation Error
          content: {}
        '425':
          description: Dubbing not ready
          content: {}
components:
  schemas:
    type_dubbing/transcript:TranscriptGetTranscriptForDubRequestFormatType:
      type: string
      enum:
        - value: srt
        - value: webvtt
        - value: json
      default: srt
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
    type_:DubbingTranscriptResponseModel:
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
    type_dubbing/transcript:TranscriptGetTranscriptForDubResponse:
      oneOf:
        - $ref: '#/components/schemas/type_:DubbingTranscriptResponseModel'
        - type: string
```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.dubbing.transcript.getTranscriptForDub("dubbing_id", "source", {
        formatType: "srt",
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

client.dubbing.transcript.get_transcript_for_dub(
    dubbing_id="dubbing_id",
    language_code="source",
    format_type="srt"
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

	url := "https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcript/source?format_type=srt"

	payload := strings.NewReader("{}")

	req, _ := http.NewRequest("GET", url, payload)

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

url = URI("https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcript/source?format_type=srt")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Content-Type"] = 'application/json'
request.body = "{}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcript/source?format_type=srt")
  .header("Content-Type", "application/json")
  .body("{}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcript/source?format_type=srt', [
  'body' => '{}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcript/source?format_type=srt");
var request = new RestRequest(Method.GET);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcript/source?format_type=srt")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
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
