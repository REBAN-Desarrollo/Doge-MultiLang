# Stream Archive With Studio Project Audio

POST https://api.elevenlabs.io/v1/studio/projects/{project_id}/snapshots/{project_snapshot_id}/archive

Returns a compressed archive of the Studio project's audio.

Reference: https://elevenlabs.io/docs/api-reference/studio/archive-snapshot

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Stream Archive With Studio Project Audio
  version: endpoint_studio/projects/snapshots.stream_archive
paths:
  /v1/studio/projects/{project_id}/snapshots/{project_snapshot_id}/archive:
    post:
      operationId: stream-archive
      summary: Stream Archive With Studio Project Audio
      description: Returns a compressed archive of the Studio project's audio.
      tags:
        - - subpackage_studio
          - subpackage_studio/projects
          - subpackage_studio/projects/snapshots
      parameters:
        - name: project_id
          in: path
          description: >-
            The ID of the project to be used. You can use the [List
            projects](/docs/api-reference/studio/get-projects) endpoint to list
            all the available projects.
          required: true
          schema:
            type: string
        - name: project_snapshot_id
          in: path
          description: The ID of the Studio project snapshot.
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
          description: Streaming archive data
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
    await client.studio.projects.snapshots.streamArchive("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.studio.projects.snapshots.stream_archive(
    project_id="21m00Tcm4TlvDq8ikWAM",
    project_snapshot_id="21m00Tcm4TlvDq8ikWAM"
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

	url := "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM/archive"

	payload := strings.NewReader("{}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("xi-api-key", "sk-1234567890abcdef1234567890abcdef")
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

url = URI("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM/archive")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'sk-1234567890abcdef1234567890abcdef'
request["Content-Type"] = 'application/json'
request.body = "{}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM/archive")
  .header("xi-api-key", "sk-1234567890abcdef1234567890abcdef")
  .header("Content-Type", "application/json")
  .body("{}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM/archive', [
  'body' => '{}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'sk-1234567890abcdef1234567890abcdef',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM/archive");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "sk-1234567890abcdef1234567890abcdef");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "sk-1234567890abcdef1234567890abcdef",
  "Content-Type": "application/json"
]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM/archive")! as URL,
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