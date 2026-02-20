# Add samples to PVC voice

POST https://api.elevenlabs.io/v1/voices/pvc/{voice_id}/samples
Content-Type: multipart/form-data

Add audio samples to a PVC voice

Reference: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Add Samples To Pvc Voice
  version: endpoint_voices/pvc/samples.create
paths:
  /v1/voices/pvc/{voice_id}/samples:
    post:
      operationId: create
      summary: Add Samples To Pvc Voice
      description: Add audio samples to a PVC voice
      tags:
        - - subpackage_voices
          - subpackage_voices/pvc
          - subpackage_voices/pvc/samples
      parameters:
        - name: voice_id
          in: path
          description: >-
            Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices
            to list all the available voices.
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
                type: array
                items:
                  $ref: '#/components/schemas/type_:VoiceSample'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                files:
                  type: array
                  items:
                    type: string
                    format: binary
                  description: Audio files used to create the voice.
                remove_background_noise:
                  type: boolean
                  default: false
                  description: >-
                    If set will remove background noise for voice samples using
                    our audio isolation model. If the samples do not include
                    background noise, it can make the quality worse.
              required:
                - files
components:
  schemas:
    type_:SpeakerSeparationResponseModelStatus:
      type: string
      enum:
        - value: not_started
        - value: pending
        - value: completed
        - value: failed
    type_:UtteranceResponseModel:
      type: object
      properties:
        start:
          type: number
          format: double
          description: The start time of the utterance in seconds.
        end:
          type: number
          format: double
          description: The end time of the utterance in seconds.
      required:
        - start
        - end
    type_:SpeakerResponseModel:
      type: object
      properties:
        speaker_id:
          type: string
          description: The ID of the speaker.
        duration_secs:
          type: number
          format: double
          description: The duration of the speaker segment in seconds.
        utterances:
          type: array
          items:
            $ref: '#/components/schemas/type_:UtteranceResponseModel'
          description: The utterances of the speaker.
      required:
        - speaker_id
        - duration_secs
    type_:SpeakerSeparationResponseModel:
      type: object
      properties:
        voice_id:
          type: string
          description: The ID of the voice.
        sample_id:
          type: string
          description: The ID of the sample.
        status:
          $ref: '#/components/schemas/type_:SpeakerSeparationResponseModelStatus'
          description: The status of the speaker separation.
        speakers:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/type_:SpeakerResponseModel'
          description: The speakers of the sample.
        selected_speaker_ids:
          type: array
          items:
            type: string
          description: The IDs of the selected speakers.
      required:
        - voice_id
        - sample_id
        - status
    type_:VoiceSample:
      type: object
      properties:
        sample_id:
          type: string
          description: The ID of the sample.
        file_name:
          type: string
          description: The name of the sample file.
        mime_type:
          type: string
          description: The MIME type of the sample file.
        size_bytes:
          type: integer
          description: The size of the sample file in bytes.
        hash:
          type: string
          description: The hash of the sample file.
        duration_secs:
          type: number
          format: double
        remove_background_noise:
          type: boolean
        has_isolated_audio:
          type: boolean
        has_isolated_audio_preview:
          type: boolean
        speaker_separation:
          $ref: '#/components/schemas/type_:SpeakerSeparationResponseModel'
        trim_start:
          type: integer
        trim_end:
          type: integer

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.voices.pvc.samples.create("21m00Tcm4TlvDq8ikWAM", {});
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.voices.pvc.samples.create(
    voice_id="21m00Tcm4TlvDq8ikWAM"
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

	url := "https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"; filename=\"voice_sample_01.wav\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"; filename=\"voice_sample_02.wav\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"remove_background_noise\"\r\n\r\ntrue\r\n-----011000010111000001101001--\r\n")

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

url = URI("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"; filename=\"voice_sample_01.wav\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"; filename=\"voice_sample_02.wav\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"remove_background_noise\"\r\n\r\ntrue\r\n-----011000010111000001101001--\r\n"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples")
  .header("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"; filename=\"voice_sample_01.wav\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"; filename=\"voice_sample_02.wav\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"remove_background_noise\"\r\n\r\ntrue\r\n-----011000010111000001101001--\r\n")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples', [
  'multipart' => [
    [
        'name' => 'files',
        'filename' => 'voice_sample_01.wav',
        'contents' => null
    ],
    [
        'name' => 'files',
        'filename' => 'voice_sample_02.wav',
        'contents' => null
    ],
    [
        'name' => 'remove_background_noise',
        'contents' => 'true'
    ]
  ]
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples");
var request = new RestRequest(Method.POST);
request.AddParameter("multipart/form-data; boundary=---011000010111000001101001", "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"; filename=\"voice_sample_01.wav\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"; filename=\"voice_sample_02.wav\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"remove_background_noise\"\r\n\r\ntrue\r\n-----011000010111000001101001--\r\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "multipart/form-data; boundary=---011000010111000001101001"]
let parameters = [
  [
    "name": "files",
    "fileName": "voice_sample_01.wav"
  ],
  [
    "name": "files",
    "fileName": "voice_sample_02.wav"
  ],
  [
    "name": "remove_background_noise",
    "value": "true"
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

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples")! as URL,
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