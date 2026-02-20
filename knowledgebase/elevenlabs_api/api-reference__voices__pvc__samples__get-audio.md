# Get PVC voice sample audio

GET https://api.elevenlabs.io/v1/voices/pvc/{voice_id}/samples/{sample_id}/audio

Retrieve the first 30 seconds of voice sample audio with or without noise removal.

Reference: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-audio

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Retrieve Voice Sample Audio
  version: endpoint_voices/pvc/samples/audio.get
paths:
  /v1/voices/pvc/{voice_id}/samples/{sample_id}/audio:
    get:
      operationId: get
      summary: Retrieve Voice Sample Audio
      description: >-
        Retrieve the first 30 seconds of voice sample audio with or without
        noise removal.
      tags:
        - - subpackage_voices
          - subpackage_voices/pvc
          - subpackage_voices/pvc/samples
          - subpackage_voices/pvc/samples/audio
      parameters:
        - name: voice_id
          in: path
          description: >-
            Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices
            to list all the available voices.
          required: true
          schema:
            type: string
        - name: sample_id
          in: path
          description: Sample ID to be used
          required: true
          schema:
            type: string
        - name: remove_background_noise
          in: query
          description: >-
            If set will remove background noise for voice samples using our
            audio isolation model. If the samples do not include background
            noise, it can make the quality worse.
          required: false
          schema:
            type: boolean
            default: false
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
                $ref: '#/components/schemas/type_:VoiceSamplePreviewResponseModel'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:VoiceSamplePreviewResponseModel:
      type: object
      properties:
        audio_base_64:
          type: string
          description: The base64 encoded audio.
        voice_id:
          type: string
          description: The ID of the voice.
        sample_id:
          type: string
          description: The ID of the sample.
        media_type:
          type: string
          description: The media type of the audio.
        duration_secs:
          type: number
          format: double
          description: The duration of the audio in seconds.
      required:
        - audio_base_64
        - voice_id
        - sample_id
        - media_type

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.voices.pvc.samples.audio.get("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L", {
        removeBackgroundNoise: true,
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

client.voices.pvc.samples.audio.get(
    voice_id="21m00Tcm4TlvDq8ikWAM",
    sample_id="VW7YKqPnjY4h39yTbx2L",
    remove_background_noise=True
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

	url := "https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/audio?remove_background_noise=true"

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

url = URI("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/audio?remove_background_noise=true")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/audio?remove_background_noise=true")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/audio?remove_background_noise=true');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/audio?remove_background_noise=true");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/audio?remove_background_noise=true")! as URL,
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