# Get similar voices

GET https://api.elevenlabs.io/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/similar-voices

Fetch the top 10 similar voices to a speaker, including the voice IDs, names, descriptions, and, where possible, a sample audio recording.

Reference: https://elevenlabs.io/docs/api-reference/dubbing/resources/get-similar-voices

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Search The Elevenlabs Library For Voices Similar To A Speaker.
  version: endpoint_dubbing/resource/speaker.find_similar_voices
paths:
  /v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/similar-voices:
    get:
      operationId: find-similar-voices
      summary: Search The Elevenlabs Library For Voices Similar To A Speaker.
      description: >-
        Fetch the top 10 similar voices to a speaker, including the voice IDs,
        names, descriptions, and, where possible, a sample audio recording.
      tags:
        - - subpackage_dubbing
          - subpackage_dubbing/resource
          - subpackage_dubbing/resource/speaker
      parameters:
        - name: dubbing_id
          in: path
          description: ID of the dubbing project.
          required: true
          schema:
            type: string
        - name: speaker_id
          in: path
          description: ID of the speaker.
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
                $ref: '#/components/schemas/type_:SimilarVoicesForSpeakerResponse'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:VoiceCategory:
      type: string
      enum:
        - value: premade
        - value: cloned
        - value: generated
        - value: professional
        - value: famous
    type_:SimilarVoice:
      type: object
      properties:
        voice_id:
          type: string
        name:
          type: string
        category:
          $ref: '#/components/schemas/type_:VoiceCategory'
        description:
          type: string
        preview_url:
          type: string
      required:
        - voice_id
        - name
        - category
    type_:SimilarVoicesForSpeakerResponse:
      type: object
      properties:
        voices:
          type: array
          items:
            $ref: '#/components/schemas/type_:SimilarVoice'
      required:
        - voices

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.dubbing.resource.speaker.findSimilarVoices("dubbing_id", "speaker_id");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.dubbing.resource.speaker.find_similar_voices(
    dubbing_id="dubbing_id",
    speaker_id="speaker_id"
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

	url := "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/similar-voices"

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

url = URI("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/similar-voices")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/similar-voices")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/similar-voices');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/similar-voices");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/similar-voices")! as URL,
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