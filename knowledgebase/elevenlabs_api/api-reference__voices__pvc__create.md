# Create PVC voice

POST https://api.elevenlabs.io/v1/voices/pvc
Content-Type: application/json

Creates a new PVC voice with metadata but no samples

Reference: https://elevenlabs.io/docs/api-reference/voices/pvc/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create PVC voice
  version: endpoint_voices/pvc.create
paths:
  /v1/voices/pvc:
    post:
      operationId: create
      summary: Create PVC voice
      description: Creates a new PVC voice with metadata but no samples
      tags:
        - - subpackage_voices
          - subpackage_voices/pvc
      parameters:
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
                name:
                  type: string
                  description: >-
                    The name that identifies this voice. This will be displayed
                    in the dropdown of the website.
                language:
                  type: string
                  description: Language used in the samples.
                description:
                  type: string
                  description: Description to use for the created voice.
                labels:
                  type: object
                  additionalProperties:
                    type: string
                  description: >-
                    Labels for the voice. Keys can be language, accent, gender,
                    or age.
              required:
                - name
                - language
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
    await client.voices.pvc.create({
        name: "John Smith",
        language: "en",
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

client.voices.pvc.create(
    name="John Smith",
    language="en"
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

	url := "https://api.elevenlabs.io/v1/voices/pvc"

	payload := strings.NewReader("{\n  \"name\": \"John Smith\",\n  \"language\": \"en\"\n}")

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

url = URI("https://api.elevenlabs.io/v1/voices/pvc")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"name\": \"John Smith\",\n  \"language\": \"en\"\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/voices/pvc")
  .header("Content-Type", "application/json")
  .body("{\n  \"name\": \"John Smith\",\n  \"language\": \"en\"\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/voices/pvc', [
  'body' => '{
  "name": "John Smith",
  "language": "en"
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/pvc");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"name\": \"John Smith\",\n  \"language\": \"en\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [
  "name": "John Smith",
  "language": "en"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/pvc")! as URL,
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