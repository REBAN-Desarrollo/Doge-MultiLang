# Get pronunciation dictionary by version

GET https://api.elevenlabs.io/v1/pronunciation-dictionaries/{dictionary_id}/{version_id}/download

Get a PLS file with a pronunciation dictionary version rules

Reference: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/download

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get pronunciation dictionary by version
  version: endpoint_pronunciationDictionaries.download
paths:
  /v1/pronunciation-dictionaries/{dictionary_id}/{version_id}/download:
    get:
      operationId: download
      summary: Get pronunciation dictionary by version
      description: Get a PLS file with a pronunciation dictionary version rules
      tags:
        - - subpackage_pronunciationDictionaries
      parameters:
        - name: dictionary_id
          in: path
          description: The id of the pronunciation dictionary
          required: true
          schema:
            type: string
        - name: version_id
          in: path
          description: The id of the pronunciation dictionary version
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
          description: The PLS file containing pronunciation dictionary rules
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
    await client.pronunciationDictionaries.download("21m00Tcm4TlvDq8ikWAM", "BdF0s0aZ3oFoKnDYdTox");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.pronunciation_dictionaries.download(
    dictionary_id="21m00Tcm4TlvDq8ikWAM",
    version_id="BdF0s0aZ3oFoKnDYdTox"
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

	url := "https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/BdF0s0aZ3oFoKnDYdTox/download"

	payload := strings.NewReader("{}")

	req, _ := http.NewRequest("GET", url, payload)

	req.Header.Add("xi-api-key", "123e4567-e89b-12d3-a456-426614174000")
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

url = URI("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/BdF0s0aZ3oFoKnDYdTox/download")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = '123e4567-e89b-12d3-a456-426614174000'
request["Content-Type"] = 'application/json'
request.body = "{}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/BdF0s0aZ3oFoKnDYdTox/download")
  .header("xi-api-key", "123e4567-e89b-12d3-a456-426614174000")
  .header("Content-Type", "application/json")
  .body("{}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/BdF0s0aZ3oFoKnDYdTox/download', [
  'body' => '{}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => '123e4567-e89b-12d3-a456-426614174000',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/BdF0s0aZ3oFoKnDYdTox/download");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "123e4567-e89b-12d3-a456-426614174000");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "123e4567-e89b-12d3-a456-426614174000",
  "Content-Type": "application/json"
]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/BdF0s0aZ3oFoKnDYdTox/download")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
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