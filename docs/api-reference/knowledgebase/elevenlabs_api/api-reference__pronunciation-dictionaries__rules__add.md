# Add pronunciation dictionary rules

POST https://api.elevenlabs.io/v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/add-rules
Content-Type: application/json

Add rules to the pronunciation dictionary. If a rule with the same string_to_replace already exists, it will be replaced.

Reference: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/rules/add

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Add pronunciation dictionary rules
  version: endpoint_pronunciationDictionaries/rules.add
paths:
  /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/add-rules:
    post:
      operationId: add
      summary: Add pronunciation dictionary rules
      description: >-
        Add rules to the pronunciation dictionary. If a rule with the same
        string_to_replace already exists, it will be replaced.
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
                rules:
                  type: array
                  items:
                    $ref: >-
                      #/components/schemas/type_pronunciationDictionaries/rules:PronunciationDictionaryRule
                  description: |-
                    List of pronunciation rules. Rule can be either:
                        an alias rule: {'string_to_replace': 'a', 'type': 'alias', 'alias': 'b', }
                        or a phoneme rule: {'string_to_replace': 'a', 'type': 'phoneme', 'phoneme': 'b', 'alphabet': 'ipa' }
              required:
                - rules
components:
  schemas:
    type_pronunciationDictionaries/rules:PronunciationDictionaryRule:
      oneOf:
        - type: object
          properties:
            type:
              type: string
              enum:
                - alias
              description: 'Discriminator value: alias'
            string_to_replace:
              type: string
              description: The string to replace. Must be a non-empty string.
            alias:
              type: string
              description: The alias for the string to be replaced.
          required:
            - type
            - string_to_replace
            - alias
        - type: object
          properties:
            type:
              type: string
              enum:
                - phoneme
              description: 'Discriminator value: phoneme'
            string_to_replace:
              type: string
              description: The string to replace. Must be a non-empty string.
            phoneme:
              type: string
              description: The phoneme rule.
            alphabet:
              type: string
              description: The alphabet to use with the phoneme rule.
          required:
            - type
            - string_to_replace
            - phoneme
            - alphabet
      discriminator:
        propertyName: type
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
    await client.pronunciationDictionaries.rules.add("21m00Tcm4TlvDq8ikWAM", {
        rules: [
            {
                type: "alias",
                alias: "tie-land",
                stringToReplace: "Thailand",
            },
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

client.pronunciation_dictionaries.rules.add(
    pronunciation_dictionary_id="21m00Tcm4TlvDq8ikWAM",
    rules=[
        {
            "type": "alias",
            "alias": "tie-land",
            "string_to_replace": "Thailand"
        }
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

	url := "https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/add-rules"

	payload := strings.NewReader("{\n  \"rules\": [\n    {\n      \"type\": \"alias\",\n      \"alias\": \"tie-land\",\n      \"string_to_replace\": \"Thailand\"\n    }\n  ]\n}")

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

url = URI("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/add-rules")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"rules\": [\n    {\n      \"type\": \"alias\",\n      \"alias\": \"tie-land\",\n      \"string_to_replace\": \"Thailand\"\n    }\n  ]\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/add-rules")
  .header("Content-Type", "application/json")
  .body("{\n  \"rules\": [\n    {\n      \"type\": \"alias\",\n      \"alias\": \"tie-land\",\n      \"string_to_replace\": \"Thailand\"\n    }\n  ]\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/add-rules', [
  'body' => '{
  "rules": [
    {
      "type": "alias",
      "alias": "tie-land",
      "string_to_replace": "Thailand"
    }
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

var client = new RestClient("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/add-rules");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"rules\": [\n    {\n      \"type\": \"alias\",\n      \"alias\": \"tie-land\",\n      \"string_to_replace\": \"Thailand\"\n    }\n  ]\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["rules": [
    [
      "type": "alias",
      "alias": "tie-land",
      "string_to_replace": "Thailand"
    ]
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM/add-rules")! as URL,
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