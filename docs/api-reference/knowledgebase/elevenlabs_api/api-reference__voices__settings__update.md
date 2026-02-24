# Edit voice settings

POST https://api.elevenlabs.io/v1/voices/{voice_id}/settings/edit
Content-Type: application/json

Edit your settings for a specific voice. "similarity_boost" corresponds to "Clarity + Similarity Enhancement" in the web app and "stability" corresponds to "Stability" slider in the web app.

Reference: https://elevenlabs.io/docs/api-reference/voices/settings/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Edit voice settings
  version: endpoint_voices/settings.update
paths:
  /v1/voices/{voice_id}/settings/edit:
    post:
      operationId: update
      summary: Edit voice settings
      description: >-
        Edit your settings for a specific voice. "similarity_boost" corresponds
        to "Clarity + Similarity Enhancement" in the web app and "stability"
        corresponds to "Stability" slider in the web app.
      tags:
        - - subpackage_voices
          - subpackage_voices/settings
      parameters:
        - name: voice_id
          in: path
          description: >-
            ID of the voice to be used. You can use the [Get
            voices](/docs/api-reference/voices/search) endpoint list all the
            available voices.
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
                $ref: '#/components/schemas/type_:EditVoiceSettingsResponseModel'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        description: The settings for a specific voice.
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/type_:VoiceSettings'
components:
  schemas:
    type_:VoiceSettings:
      type: object
      properties:
        stability:
          type: number
          format: double
          description: >-
            Determines how stable the voice is and the randomness between each
            generation. Lower values introduce broader emotional range for the
            voice. Higher values can result in a monotonous voice with limited
            emotion.
        use_speaker_boost:
          type: boolean
          description: >-
            This setting boosts the similarity to the original speaker. Using
            this setting requires a slightly higher computational load, which in
            turn increases latency.
        similarity_boost:
          type: number
          format: double
          description: >-
            Determines how closely the AI should adhere to the original voice
            when attempting to replicate it.
        style:
          type: number
          format: double
          description: >-
            Determines the style exaggeration of the voice. This setting
            attempts to amplify the style of the original speaker. It does
            consume additional computational resources and might increase
            latency if set to anything other than 0.
        speed:
          type: number
          format: double
          description: >-
            Adjusts the speed of the voice. A value of 1.0 is the default speed,
            while values less than 1.0 slow down the speech, and values greater
            than 1.0 speed it up.
    type_:EditVoiceSettingsResponseModel:
      type: object
      properties:
        status:
          type: string
          description: >-
            The status of the voice settings edit request. If the request was
            successful, the status will be 'ok'. Otherwise an error message with
            status 500 will be returned.
      required:
        - status

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.voices.settings.update("21m00Tcm4TlvDq8ikWAM", {
        stability: 0,
        useSpeakerBoost: true,
        similarityBoost: 0,
        style: 0,
        speed: 1,
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

client.voices.settings.update(
    voice_id="21m00Tcm4TlvDq8ikWAM",
    stability=0,
    use_speaker_boost=True,
    similarity_boost=0,
    style=0,
    speed=1
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

	url := "https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/settings/edit"

	payload := strings.NewReader("{\n  \"stability\": 0,\n  \"use_speaker_boost\": true,\n  \"similarity_boost\": 0,\n  \"style\": 0,\n  \"speed\": 1\n}")

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

url = URI("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/settings/edit")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"stability\": 0,\n  \"use_speaker_boost\": true,\n  \"similarity_boost\": 0,\n  \"style\": 0,\n  \"speed\": 1\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/settings/edit")
  .header("Content-Type", "application/json")
  .body("{\n  \"stability\": 0,\n  \"use_speaker_boost\": true,\n  \"similarity_boost\": 0,\n  \"style\": 0,\n  \"speed\": 1\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/settings/edit', [
  'body' => '{
  "stability": 0,
  "use_speaker_boost": true,
  "similarity_boost": 0,
  "style": 0,
  "speed": 1
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/settings/edit");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"stability\": 0,\n  \"use_speaker_boost\": true,\n  \"similarity_boost\": 0,\n  \"style\": 0,\n  \"speed\": 1\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [
  "stability": 0,
  "use_speaker_boost": true,
  "similarity_boost": 0,
  "style": 0,
  "speed": 1
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/settings/edit")! as URL,
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