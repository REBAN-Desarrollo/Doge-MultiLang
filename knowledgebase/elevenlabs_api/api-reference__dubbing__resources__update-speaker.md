# Update speaker

PATCH https://api.elevenlabs.io/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}
Content-Type: application/json

Amend the metadata associated with a speaker, such as their voice. Both voice cloning and using voices from the ElevenLabs library are supported.

Reference: https://elevenlabs.io/docs/api-reference/dubbing/resources/update-speaker

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update Metadata For A Speaker
  version: endpoint_dubbing/resource/speaker.update
paths:
  /v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}:
    patch:
      operationId: update
      summary: Update Metadata For A Speaker
      description: >-
        Amend the metadata associated with a speaker, such as their voice. Both
        voice cloning and using voices from the ElevenLabs library are
        supported.
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
                $ref: '#/components/schemas/type_:SpeakerUpdatedResponse'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                speaker_name:
                  type: string
                  description: Name to attribute to this speaker.
                voice_id:
                  type: string
                  description: >-
                    Either the identifier of a voice from the ElevenLabs voice
                    library, or one of ['track-clone', 'clip-clone'].
                voice_stability:
                  type: number
                  format: double
                  description: >-
                    For models that support it, the voice similarity value to
                    use. This will default to 0.65, with a valid range of [0.0,
                    1.0].
                voice_similarity:
                  type: number
                  format: double
                  description: >-
                    For models that support it, the voice similarity value to
                    use. This will default to 1.0, with a valid range of [0.0,
                    1.0].
                voice_style:
                  type: number
                  format: double
                  description: >-
                    For models that support it, the voice style value to use.
                    This will default to 1.0, with a valid range of [0.0, 1.0].
                languages:
                  type: array
                  items:
                    type: string
                  description: >-
                    Languages to apply these changes to. If empty, will apply to
                    all languages.
components:
  schemas:
    type_:SpeakerUpdatedResponse:
      type: object
      properties:
        version:
          type: integer
      required:
        - version

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.dubbing.resource.speaker.update("dubbing_id", "speaker_id", {});
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.dubbing.resource.speaker.update(
    dubbing_id="dubbing_id",
    speaker_id="speaker_id"
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

	url := "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id"

	payload := strings.NewReader("{}")

	req, _ := http.NewRequest("PATCH", url, payload)

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

url = URI("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.patch("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id")
  .header("Content-Type", "application/json")
  .body("{}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id', [
  'body' => '{}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "PATCH"
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