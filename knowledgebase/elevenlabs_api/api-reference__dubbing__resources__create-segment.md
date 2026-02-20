# Create segment

POST https://api.elevenlabs.io/v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/segment
Content-Type: application/json

Creates a new segment in dubbing resource with a start and end time for the speaker in every available language. Does not automatically generate transcripts/translations/audio.

Reference: https://elevenlabs.io/docs/api-reference/dubbing/resources/create-segment

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Add speaker segment to dubbing resource
  version: endpoint_dubbing/resource/speaker/segment.create
paths:
  /v1/dubbing/resource/{dubbing_id}/speaker/{speaker_id}/segment:
    post:
      operationId: create
      summary: Add speaker segment to dubbing resource
      description: >-
        Creates a new segment in dubbing resource with a start and end time for
        the speaker in every available language. Does not automatically generate
        transcripts/translations/audio.
      tags:
        - - subpackage_dubbing
          - subpackage_dubbing/resource
          - subpackage_dubbing/resource/speaker
          - subpackage_dubbing/resource/speaker/segment
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
        '201':
          description: Successful Response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/type_:SegmentCreateResponse'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                start_time:
                  type: number
                  format: double
                end_time:
                  type: number
                  format: double
                text:
                  type: string
                translations:
                  type: object
                  additionalProperties:
                    type: string
              required:
                - start_time
                - end_time
components:
  schemas:
    type_:SegmentCreateResponse:
      type: object
      properties:
        version:
          type: integer
        new_segment:
          type: string
      required:
        - version
        - new_segment

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.dubbing.resource.speaker.segment.create("dubbing_id", "speaker_id", {
        startTime: 1.1,
        endTime: 1.1,
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

client.dubbing.resource.speaker.segment.create(
    dubbing_id="dubbing_id",
    speaker_id="speaker_id",
    start_time=1.1,
    end_time=1.1
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

	url := "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/segment"

	payload := strings.NewReader("{\n  \"start_time\": 1.1,\n  \"end_time\": 1.1\n}")

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

url = URI("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/segment")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"start_time\": 1.1,\n  \"end_time\": 1.1\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/segment")
  .header("Content-Type", "application/json")
  .body("{\n  \"start_time\": 1.1,\n  \"end_time\": 1.1\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/segment', [
  'body' => '{
  "start_time": 1.1,
  "end_time": 1.1
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/segment");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"start_time\": 1.1,\n  \"end_time\": 1.1\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [
  "start_time": 1.1,
  "end_time": 1.1
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/speaker/speaker_id/segment")! as URL,
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