# Get pronunciation dictionary

GET https://api.elevenlabs.io/v1/pronunciation-dictionaries/{pronunciation_dictionary_id}

Get metadata for a pronunciation dictionary

Reference: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/get

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get pronunciation dictionary
  version: endpoint_pronunciationDictionaries.get
paths:
  /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}:
    get:
      operationId: get
      summary: Get pronunciation dictionary
      description: Get metadata for a pronunciation dictionary
      tags:
        - - subpackage_pronunciationDictionaries
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
                  #/components/schemas/type_:GetPronunciationDictionaryWithRulesResponseModel
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:GetPronunciationDictionaryWithRulesResponseModelPermissionOnResource:
      type: string
      enum:
        - value: admin
        - value: editor
        - value: commenter
        - value: viewer
    type_:GetPronunciationDictionaryWithRulesResponseModelRulesItem:
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
            alias:
              type: string
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
            phoneme:
              type: string
            alphabet:
              type: string
          required:
            - type
            - string_to_replace
            - phoneme
            - alphabet
      discriminator:
        propertyName: type
    type_:GetPronunciationDictionaryWithRulesResponseModel:
      type: object
      properties:
        id:
          type: string
          description: The ID of the pronunciation dictionary.
        latest_version_id:
          type: string
          description: The ID of the latest version of the pronunciation dictionary.
        latest_version_rules_num:
          type: integer
          description: >-
            The number of rules in the latest version of the pronunciation
            dictionary.
        name:
          type: string
          description: The name of the pronunciation dictionary.
        permission_on_resource:
          $ref: >-
            #/components/schemas/type_:GetPronunciationDictionaryWithRulesResponseModelPermissionOnResource
          description: The permission on the resource of the pronunciation dictionary.
        created_by:
          type: string
          description: The user ID of the creator of the pronunciation dictionary.
        creation_time_unix:
          type: integer
          description: The creation time of the pronunciation dictionary in Unix timestamp.
        archived_time_unix:
          type: integer
          description: The archive time of the pronunciation dictionary in Unix timestamp.
        description:
          type: string
          description: The description of the pronunciation dictionary.
        rules:
          type: array
          items:
            $ref: >-
              #/components/schemas/type_:GetPronunciationDictionaryWithRulesResponseModelRulesItem
          description: The rules in the latest version of the pronunciation dictionary.
      required:
        - id
        - latest_version_id
        - latest_version_rules_num
        - name
        - created_by
        - creation_time_unix
        - rules

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.pronunciationDictionaries.get("21m00Tcm4TlvDq8ikWAM");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.pronunciation_dictionaries.get(
    pronunciation_dictionary_id="21m00Tcm4TlvDq8ikWAM"
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

	url := "https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM"

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

url = URI("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/pronunciation-dictionaries/21m00Tcm4TlvDq8ikWAM")! as URL,
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