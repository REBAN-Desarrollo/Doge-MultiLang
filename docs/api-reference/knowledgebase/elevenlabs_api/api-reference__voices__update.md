# Edit voice

POST https://api.elevenlabs.io/v1/voices/{voice_id}/edit
Content-Type: multipart/form-data

Edit a voice created by you.

Reference: https://elevenlabs.io/docs/api-reference/voices/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Edit voice
  version: endpoint_voices.update
paths:
  /v1/voices/{voice_id}/edit:
    post:
      operationId: update
      summary: Edit voice
      description: Edit a voice created by you.
      tags:
        - - subpackage_voices
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
                $ref: '#/components/schemas/type_:EditVoiceResponseModel'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: >-
                    The name that identifies this voice. This will be displayed
                    in the dropdown of the website.
                files:
                  type: array
                  items:
                    type: string
                    format: binary
                  description: Audio files to add to the voice
                remove_background_noise:
                  type: boolean
                  default: false
                  description: >-
                    If set will remove background noise for voice samples using
                    our audio isolation model. If the samples do not include
                    background noise, it can make the quality worse.
                description:
                  type: string
                  description: A description of the voice.
                labels:
                  $ref: '#/components/schemas/type_voices:VoicesUpdateRequestLabels'
                  description: >-
                    Labels for the voice. Keys can be language, accent, gender,
                    or age.
              required:
                - name
components:
  schemas:
    type_voices:VoicesUpdateRequestLabels:
      oneOf:
        - type: object
          additionalProperties:
            type: string
        - type: string
    type_:EditVoiceResponseModel:
      type: object
      properties:
        status:
          type: string
          description: >-
            The status of the voice edit request. If the request was successful,
            the status will be 'ok'. Otherwise an error message with status 500
            will be returned.
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
    await client.voices.update("21m00Tcm4TlvDq8ikWAM", {});
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.voices.update(
    voice_id="21m00Tcm4TlvDq8ikWAM"
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

	url := "https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/edit"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nname\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"remove_background_noise\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"labels\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")

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

url = URI("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/edit")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nname\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"remove_background_noise\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"labels\"\r\n\r\n\r\n-----011000010111000001101001--\r\n"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/edit")
  .header("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nname\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"remove_background_noise\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"labels\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/edit', [
  'multipart' => [
    [
        'name' => 'name',
        'contents' => 'name'
    ]
  ]
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/edit");
var request = new RestRequest(Method.POST);
request.AddParameter("multipart/form-data; boundary=---011000010111000001101001", "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nname\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"remove_background_noise\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"labels\"\r\n\r\n\r\n-----011000010111000001101001--\r\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "multipart/form-data; boundary=---011000010111000001101001"]
let parameters = [
  [
    "name": "name",
    "value": "name"
  ],
  [
    "name": "remove_background_noise",
    "value": 
  ],
  [
    "name": "description",
    "value": 
  ],
  [
    "name": "labels",
    "value": 
  ]
]

let boundary = "---011000010111000001101001"

var body = ""
var error: NSError? = nil
for param in parameters {
  let paramName = param["name"]!
  body += "--\(boundary)\r\n"
  body += "Content-Disposition:form-data; name=\"\(paramName)\""
  if let filename = param["fileName"] {
    let contentType = param["content-type"]!
    let fileContent = String(contentsOfFile: filename, encoding: String.Encoding.utf8)
    if (error != nil) {
      print(error as Any)
    }
    body += "; filename=\"\(filename)\"\r\n"
    body += "Content-Type: \(contentType)\r\n\r\n"
    body += fileContent
  } else if let paramValue = param["value"] {
    body += "\r\n\r\n\(paramValue)"
  }
}

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/edit")! as URL,
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