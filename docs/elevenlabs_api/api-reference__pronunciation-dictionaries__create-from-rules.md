# Create a pronunciation dictionary from rules

POST https://api.elevenlabs.io/v1/pronunciation-dictionaries/add-from-rules
Content-Type: application/json

Creates a new pronunciation dictionary from provided rules.

Reference: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/create-from-rules

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create a pronunciation dictionary from rules
  version: endpoint_pronunciationDictionaries.create_from_rules
paths:
  /v1/pronunciation-dictionaries/add-from-rules:
    post:
      operationId: create-from-rules
      summary: Create a pronunciation dictionary from rules
      description: Creates a new pronunciation dictionary from provided rules.
      tags:
        - - subpackage_pronunciationDictionaries
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
                $ref: >-
                  #/components/schemas/type_:AddPronunciationDictionaryResponseModel
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
                      #/components/schemas/type_pronunciationDictionaries:BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostRulesItem
                  description: |-
                    List of pronunciation rules. Rule can be either:
                        an alias rule: {'string_to_replace': 'a', 'type': 'alias', 'alias': 'b', }
                        or a phoneme rule: {'string_to_replace': 'a', 'type': 'phoneme', 'phoneme': 'b', 'alphabet': 'ipa' }
                name:
                  type: string
                  description: >-
                    The name of the pronunciation dictionary, used for
                    identification only.
                description:
                  type: string
                  description: >-
                    A description of the pronunciation dictionary, used for
                    identification only.
                workspace_access:
                  $ref: >-
                    #/components/schemas/type_pronunciationDictionaries:BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostWorkspaceAccess
                  description: >-
                    Should be one of 'admin', 'editor' or 'viewer'. If not
                    provided, defaults to no access.
              required:
                - rules
                - name
components:
  schemas:
    type_pronunciationDictionaries:BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostRulesItem:
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
    type_pronunciationDictionaries:BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostWorkspaceAccess:
      type: string
      enum:
        - value: admin
        - value: editor
        - value: commenter
        - value: viewer
    type_:AddPronunciationDictionaryResponseModelPermissionOnResource:
      type: string
      enum:
        - value: admin
        - value: editor
        - value: commenter
        - value: viewer
    type_:AddPronunciationDictionaryResponseModel:
      type: object
      properties:
        id:
          type: string
          description: The ID of the created pronunciation dictionary.
        name:
          type: string
          description: The name of the created pronunciation dictionary.
        created_by:
          type: string
          description: The user ID of the creator of the pronunciation dictionary.
        creation_time_unix:
          type: integer
          description: The creation time of the pronunciation dictionary in Unix timestamp.
        version_id:
          type: string
          description: The ID of the created pronunciation dictionary version.
        version_rules_num:
          type: integer
          description: The number of rules in the version of the pronunciation dictionary.
        description:
          type: string
          description: The description of the pronunciation dictionary.
        permission_on_resource:
          $ref: >-
            #/components/schemas/type_:AddPronunciationDictionaryResponseModelPermissionOnResource
          description: The permission on the resource of the pronunciation dictionary.
      required:
        - id
        - name
        - created_by
        - creation_time_unix
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
    await client.pronunciationDictionaries.createFromRules({
        rules: [
            {
                type: "alias",
                alias: "tie-land",
                stringToReplace: "Thailand",
            },
        ],
        name: "My Dictionary",
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

client.pronunciation_dictionaries.create_from_rules(
    rules=[
        {
            "type": "alias",
            "alias": "tie-land",
            "string_to_replace": "Thailand"
        }
    ],
    name="My Dictionary"
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

	url := "https://api.elevenlabs.io/v1/pronunciation-dictionaries/add-from-rules"

	payload := strings.NewReader("{\n  \"rules\": [\n    {\n      \"type\": \"alias\",\n      \"alias\": \"tie-land\",\n      \"string_to_replace\": \"Thailand\"\n    }\n  ],\n  \"name\": \"My Dictionary\"\n}")

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

url = URI("https://api.elevenlabs.io/v1/pronunciation-dictionaries/add-from-rules")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"rules\": [\n    {\n      \"type\": \"alias\",\n      \"alias\": \"tie-land\",\n      \"string_to_replace\": \"Thailand\"\n    }\n  ],\n  \"name\": \"My Dictionary\"\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/pronunciation-dictionaries/add-from-rules")
  .header("Content-Type", "application/json")
  .body("{\n  \"rules\": [\n    {\n      \"type\": \"alias\",\n      \"alias\": \"tie-land\",\n      \"string_to_replace\": \"Thailand\"\n    }\n  ],\n  \"name\": \"My Dictionary\"\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/pronunciation-dictionaries/add-from-rules', [
  'body' => '{
  "rules": [
    {
      "type": "alias",
      "alias": "tie-land",
      "string_to_replace": "Thailand"
    }
  ],
  "name": "My Dictionary"
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/pronunciation-dictionaries/add-from-rules");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"rules\": [\n    {\n      \"type\": \"alias\",\n      \"alias\": \"tie-land\",\n      \"string_to_replace\": \"Thailand\"\n    }\n  ],\n  \"name\": \"My Dictionary\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [
  "rules": [
    [
      "type": "alias",
      "alias": "tie-land",
      "string_to_replace": "Thailand"
    ]
  ],
  "name": "My Dictionary"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/pronunciation-dictionaries/add-from-rules")! as URL,
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