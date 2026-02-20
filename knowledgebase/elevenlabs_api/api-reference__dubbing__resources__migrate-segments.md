# Migrate segments

POST https://api.elevenlabs.io/v1/dubbing/resource/{dubbing_id}/migrate-segments
Content-Type: application/json

Change the attribution of one or more segments to a different speaker.

Reference: https://elevenlabs.io/docs/api-reference/dubbing/resources/migrate-segments

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Move Segments Between Speakers
  version: endpoint_dubbing/resource.migrate_segments
paths:
  /v1/dubbing/resource/{dubbing_id}/migrate-segments:
    post:
      operationId: migrate-segments
      summary: Move Segments Between Speakers
      description: Change the attribution of one or more segments to a different speaker.
      tags:
        - - subpackage_dubbing
          - subpackage_dubbing/resource
      parameters:
        - name: dubbing_id
          in: path
          description: ID of the dubbing project.
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
                $ref: '#/components/schemas/type_:SegmentMigrationResponse'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                segment_ids:
                  type: array
                  items:
                    type: string
                speaker_id:
                  type: string
              required:
                - segment_ids
                - speaker_id
components:
  schemas:
    type_:SegmentMigrationResponse:
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
    await client.dubbing.resource.migrateSegments("dubbing_id", {
        segmentIds: [
            "segment_ids",
        ],
        speakerId: "speaker_id",
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

client.dubbing.resource.migrate_segments(
    dubbing_id="dubbing_id",
    segment_ids=[
        "segment_ids"
    ],
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

	url := "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/migrate-segments"

	payload := strings.NewReader("{\n  \"segment_ids\": [\n    \"segment_ids\"\n  ],\n  \"speaker_id\": \"speaker_id\"\n}")

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

url = URI("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/migrate-segments")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"segment_ids\": [\n    \"segment_ids\"\n  ],\n  \"speaker_id\": \"speaker_id\"\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/migrate-segments")
  .header("Content-Type", "application/json")
  .body("{\n  \"segment_ids\": [\n    \"segment_ids\"\n  ],\n  \"speaker_id\": \"speaker_id\"\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/migrate-segments', [
  'body' => '{
  "segment_ids": [
    "segment_ids"
  ],
  "speaker_id": "speaker_id"
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/migrate-segments");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"segment_ids\": [\n    \"segment_ids\"\n  ],\n  \"speaker_id\": \"speaker_id\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [
  "segment_ids": ["segment_ids"],
  "speaker_id": "speaker_id"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/resource/dubbing_id/migrate-segments")! as URL,
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