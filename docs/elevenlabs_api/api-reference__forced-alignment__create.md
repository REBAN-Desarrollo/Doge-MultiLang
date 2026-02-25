# Create Forced Alignment

POST https://api.elevenlabs.io/v1/forced-alignment
Content-Type: multipart/form-data

Force align an audio file to text. Use this endpoint to get the timing information for each character and word in an audio file based on a provided text transcript.

Reference: https://elevenlabs.io/docs/api-reference/forced-alignment/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create Forced Alignment
  version: endpoint_forcedAlignment.create
paths:
  /v1/forced-alignment:
    post:
      operationId: create
      summary: Create Forced Alignment
      description: >-
        Force align an audio file to text. Use this endpoint to get the timing
        information for each character and word in an audio file based on a
        provided text transcript.
      tags:
        - - subpackage_forcedAlignment
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
                $ref: '#/components/schemas/type_:ForcedAlignmentResponseModel'
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                  description: >-
                    The file to align. All major audio formats are supported.
                    The file size must be less than 1GB.
                text:
                  type: string
                  description: >-
                    The text to align with the audio. The input text can be in
                    any format, however diarization is not supported at this
                    time.
                enabled_spooled_file:
                  type: boolean
                  default: false
                  description: >-
                    If true, the file will be streamed to the server and
                    processed in chunks. This is useful for large files that
                    cannot be loaded into memory. The default is false.
              required:
                - file
                - text
components:
  schemas:
    type_:ForcedAlignmentCharacterResponseModel:
      type: object
      properties:
        text:
          type: string
          description: The character that was transcribed.
        start:
          type: number
          format: double
          description: The start time of the character in seconds.
        end:
          type: number
          format: double
          description: The end time of the character in seconds.
      required:
        - text
        - start
        - end
    type_:ForcedAlignmentWordResponseModel:
      type: object
      properties:
        text:
          type: string
          description: The word that was transcribed.
        start:
          type: number
          format: double
          description: The start time of the word in seconds.
        end:
          type: number
          format: double
          description: The end time of the word in seconds.
        loss:
          type: number
          format: double
          description: >-
            The average alignment loss/confidence score for this word,
            calculated from its constituent characters.
      required:
        - text
        - start
        - end
        - loss
    type_:ForcedAlignmentResponseModel:
      type: object
      properties:
        characters:
          type: array
          items:
            $ref: '#/components/schemas/type_:ForcedAlignmentCharacterResponseModel'
          description: List of characters with their timing information.
        words:
          type: array
          items:
            $ref: '#/components/schemas/type_:ForcedAlignmentWordResponseModel'
          description: List of words with their timing information.
        loss:
          type: number
          format: double
          description: >-
            The average alignment loss/confidence score for the entire
            transcript, calculated from all characters.
      required:
        - characters
        - words
        - loss

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.forcedAlignment.create({});
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.forced_alignment.create()

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

	url := "https://api.elevenlabs.io/v1/forced-alignment"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\ntext\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"enabled_spooled_file\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

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

url = URI("https://api.elevenlabs.io/v1/forced-alignment")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\ntext\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"enabled_spooled_file\"\r\n\r\n\r\n-----011000010111000001101001--\r\n"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/forced-alignment")
  .header("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\ntext\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"enabled_spooled_file\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/forced-alignment', [
  'multipart' => [
    [
        'name' => 'file',
        'filename' => '<file1>',
        'contents' => null
    ],
    [
        'name' => 'text',
        'contents' => 'text'
    ]
  ]
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/forced-alignment");
var request = new RestRequest(Method.POST);
request.AddParameter("multipart/form-data; boundary=---011000010111000001101001", "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\ntext\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"enabled_spooled_file\"\r\n\r\n\r\n-----011000010111000001101001--\r\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "multipart/form-data; boundary=---011000010111000001101001"]
let parameters = [
  [
    "name": "file",
    "fileName": "<file1>"
  ],
  [
    "name": "text",
    "value": "text"
  ],
  [
    "name": "enabled_spooled_file",
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

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/forced-alignment")! as URL,
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