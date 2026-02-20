# Get voice sample audio

GET https://api.elevenlabs.io/v1/voices/{voice_id}/samples/{sample_id}/audio

Returns the audio corresponding to a sample attached to a voice.

Reference: https://elevenlabs.io/docs/api-reference/voices/samples/get

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get audio from sample
  version: endpoint_voices/samples/audio.get
paths:
  /v1/voices/{voice_id}/samples/{sample_id}/audio:
    get:
      operationId: get
      summary: Get audio from sample
      description: Returns the audio corresponding to a sample attached to a voice.
      tags:
        - - subpackage_voices
          - subpackage_voices/samples
          - subpackage_voices/samples/audio
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
        - name: sample_id
          in: path
          description: >-
            ID of the sample to be used. You can use the [Get
            voices](/docs/api-reference/voices/get) endpoint list all the
            available samples for a voice.
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
            application/octet-stream:
              schema:
                type: string
                format: binary
        '422':
          description: Validation Error
          content: {}

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.voices.samples.audio.get("voice_id", "sample_id");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.voices.samples.audio.get(
    voice_id="voice_id",
    sample_id="sample_id"
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

	url := "https://api.elevenlabs.io/v1/voices/voice_id/samples/sample_id/audio"

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

url = URI("https://api.elevenlabs.io/v1/voices/voice_id/samples/sample_id/audio")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/voices/voice_id/samples/sample_id/audio")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/voices/voice_id/samples/sample_id/audio');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/voice_id/samples/sample_id/audio");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/voice_id/samples/sample_id/audio")! as URL,
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