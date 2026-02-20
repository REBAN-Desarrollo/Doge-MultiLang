# Get PVC voice sample waveform

GET https://api.elevenlabs.io/v1/voices/pvc/{voice_id}/samples/{sample_id}/waveform

Retrieve the visual waveform of a voice sample.

Reference: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Retrieve Voice Sample Visual Waveform
  version: endpoint_voices/pvc/samples/waveform.get
paths:
  /v1/voices/pvc/{voice_id}/samples/{sample_id}/waveform:
    get:
      operationId: get
      summary: Retrieve Voice Sample Visual Waveform
      description: Retrieve the visual waveform of a voice sample.
      tags:
        - - subpackage_voices
          - subpackage_voices/pvc
          - subpackage_voices/pvc/samples
          - subpackage_voices/pvc/samples/waveform
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
                $ref: >-
                  #/components/schemas/type_:VoiceSampleVisualWaveformResponseModel
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:VoiceSampleVisualWaveformResponseModel:
      type: object
      properties:
        sample_id:
          type: string
          description: The ID of the sample.
        visual_waveform:
          type: array
          items:
            type: number
            format: double
          description: The visual waveform of the sample, represented as a list of floats.
      required:
        - sample_id
        - visual_waveform

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.voices.pvc.samples.waveform.get("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.voices.pvc.samples.waveform.get(
    voice_id="21m00Tcm4TlvDq8ikWAM",
    sample_id="VW7YKqPnjY4h39yTbx2L"
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

	url := "https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/waveform"

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

url = URI("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/waveform")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/waveform")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/waveform');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/waveform");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L/waveform")! as URL,
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