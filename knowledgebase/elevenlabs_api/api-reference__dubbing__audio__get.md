# Get dubbed audio

GET https://api.elevenlabs.io/v1/dubbing/{dubbing_id}/audio/{language_code}

Returns dub as a streamed MP3 or MP4 file. If this dub has been edited using Dubbing Studio you need to use the resource render endpoint as this endpoint only returns the original automatic dub result.

Reference: https://elevenlabs.io/docs/api-reference/dubbing/audio/get

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get dubbed audio
  version: endpoint_dubbing/audio.get
paths:
  /v1/dubbing/{dubbing_id}/audio/{language_code}:
    get:
      operationId: get
      summary: Get dubbed audio
      description: >-
        Returns dub as a streamed MP3 or MP4 file. If this dub has been edited
        using Dubbing Studio you need to use the resource render endpoint as
        this endpoint only returns the original automatic dub result.
      tags:
        - - subpackage_dubbing
          - subpackage_dubbing/audio
      parameters:
        - name: dubbing_id
          in: path
          description: ID of the dubbing project.
          required: true
          schema:
            type: string
        - name: language_code
          in: path
          description: ID of the language.
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
          description: The dubbed audio or video file
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
        '403':
          description: Permission denied
          content: {}
        '404':
          description: Dubbing not found
          content: {}
        '422':
          description: Validation Error
          content: {}
        '425':
          description: Dubbing not ready
          content: {}

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.dubbing.audio.get("dubbing_id", "language_code");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.dubbing.audio.get(
    dubbing_id="dubbing_id",
    language_code="language_code"
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

	url := "https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code"

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

url = URI("https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code")! as URL,
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