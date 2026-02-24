# Remove pronunciation dictionary rules

POST https://api.elevenlabs.io/v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/remove-rules
Content-Type: application/json

Remove rules from the pronunciation dictionary

Reference: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/rules/remove

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Remove pronunciation dictionary rules
  version: endpoint_pronunciationDictionaries/rules.remove
paths:
  /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/remove-rules:
    post:
      operationId: remove
      summary: Remove pronunciation dictionary rules
      description: Remove rules from the pronunciation dictionary
      tags:
        - - subpackage_pronunciationDictionaries
          - subpackage_pronunciationDictionaries/rules
      parameters:
        - name: pronunciation_dictionary_id
          in: path
          description: The id of the pronunciation dictionary
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
                  #/components/schemas/type_:PronunciationDictionaryRulesResponseModel
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                rule_strings:
                  type: array
                  items:
                    type: string
                  description: List of strings to remove from the pronunciation dictionary.
              required:
                - rule_strings
components:
  schemas:
    type_:PronunciationDictionaryRulesResponseModel:
      type: object
      properties:
        id:
          type: string
          description: The ID of the pronunciation dictionary.
        version_id:
          type: string
          description: The version ID of the pronunciation dictionary.
        version_rules_num:
          type: integer
          description: The number of rules in the version of the pronunciation dictionary.
      required:
        - id
        - version_id
        - version_rules_num

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.pronunciationDictionaries.rules.remove("21m00Tcm4TlvDq8ikWAM", {
        ruleStrings: [
            "rule_strings",
        ],
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

client.pronunciation_dictionaries.rules.remove(
    pronunciation_dictionary_id="21m00Tcm4TlvDq8ikWAM",
    rule_strings=[
        "rule_strings"
    ]
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

	url := "https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/remove-rules"

	payload := strings.NewReader("{\n  \"rule_strings\": [\n    \"rule_strings\"\n  ]\n}")

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

url = URI("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/remove-rules")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"rule_strings\": [\n    \"rule_strings\"\n  ]\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/remove-rules")
  .header("Content-Type", "application/json")
  .body("{\n  \"rule_strings\": [\n    \"rule_strings\"\n  ]\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/remove-rules', [
  'body' => '{
  "rule_strings": [
    "rule_strings"
  ]
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/remove-rules");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"rule_strings\": [\n    \"rule_strings\"\n  ]\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["rule_strings": ["rule_strings"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/remove-rules")! as URL,
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