# Update PVC voice sample

POST https://api.elevenlabs.io/v1/voices/pvc/{voice_id}/samples/{sample_id}
Content-Type: application/json

Update a PVC voice sample - apply noise removal, select speaker, change trim times or file name.

Reference: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update Pvc Voice Sample
  version: endpoint_voices/pvc/samples.update
paths:
  /v1/voices/pvc/{voice_id}/samples/{sample_id}:
    post:
      operationId: update
      summary: Update Pvc Voice Sample
      description: >-
        Update a PVC voice sample - apply noise removal, select speaker, change
        trim times or file name.
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
        - name: sample_id
          in: path
          description: Sample ID to be used
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
                $ref: '#/components/schemas/type_:AddVoiceResponseModel'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                remove_background_noise:
                  type: boolean
                  default: false
                  description: >-
                    If set will remove background noise for voice samples using
                    our audio isolation model. If the samples do not include
                    background noise, it can make the quality worse.
                selected_speaker_ids:
                  type: array
                  items:
                    type: string
                  description: >-
                    Speaker IDs to be used for PVC training. Make sure you send
                    all the speaker IDs you want to use for PVC training in one
                    request because the last request will override the previous
                    ones.
                trim_start_time:
                  type: integer
                  description: >-
                    The start time of the audio to be used for PVC training.
                    Time should be in milliseconds
                trim_end_time:
                  type: integer
                  description: >-
                    The end time of the audio to be used for PVC training. Time
                    should be in milliseconds
                file_name:
                  type: string
                  description: The name of the audio file to be used for PVC training.
components:
  schemas:
    type_:AddVoiceResponseModel:
      type: object
      properties:
        voice_id:
          type: string
          description: The ID of the voice.
      required:
        - voice_id

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.voices.pvc.samples.update("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L", {});
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.voices.pvc.samples.update(
    voice_id="21m00Tcm4TlvDq8ikWAM",
    sample_id="VW7YKqPnjY4h39yTbx2L"
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

	url := "https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L"

	payload := strings.NewReader("{}")

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

url = URI("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L")
  .header("Content-Type", "application/json")
  .body("{}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L', [
  'body' => '{}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L")! as URL,
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