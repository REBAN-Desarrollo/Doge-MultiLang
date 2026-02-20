# Delete voice sample

DELETE https://api.elevenlabs.io/v1/voices/{voice_id}/samples/{sample_id}

Removes a sample by its ID.

Reference: https://elevenlabs.io/docs/api-reference/voices/samples/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete voice sample
  version: endpoint_samples.delete
paths:
  /v1/voices/{voice_id}/samples/{sample_id}:
    delete:
      operationId: delete
      summary: Delete voice sample
      description: Removes a sample by its ID.
      tags:
        - - subpackage_samples
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
        - name: sample_id
          in: path
          description: >-
            ID of the sample to be used. You can use the [Get
            voices](/docs/api-reference/voices/get) endpoint list all the
            available samples for a voice.
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
                $ref: '#/components/schemas/type_:DeleteSampleResponse'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:DeleteSampleResponse:
      type: object
      properties:
        status:
          type: string
          description: >-
            The status of the sample deletion request. If the request was
            successful, the status will be 'ok'. Otherwise an error message with
            status 500 will be returned.
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
    await client.samples.delete("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.samples.delete(
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

	url := "https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L"

	req, _ := http.NewRequest("DELETE", url, nil)

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

url = URI("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.delete("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "DELETE"

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