# Create Pronunciation Dictionaries

POST https://api.elevenlabs.io/v1/studio/projects/{project_id}/pronunciation-dictionaries
Content-Type: application/json

Create a set of pronunciation dictionaries acting on a project. This will automatically mark text within this project as requiring reconverting where the new dictionary would apply or the old one no longer does.

Reference: https://elevenlabs.io/docs/api-reference/studio/create-pronunciation-dictionaries

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create Pronunciation Dictionaries
  version: endpoint_studio/projects/pronunciationDictionaries.create
paths:
  /v1/studio/projects/{project_id}/pronunciation-dictionaries:
    post:
      operationId: create
      summary: Create Pronunciation Dictionaries
      description: >-
        Create a set of pronunciation dictionaries acting on a project. This
        will automatically mark text within this project as requiring
        reconverting where the new dictionary would apply or the old one no
        longer does.
      tags:
        - - subpackage_studio
          - subpackage_studio/projects
          - subpackage_studio/projects/pronunciationDictionaries
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
                  #/components/schemas/type_:CreatePronunciationDictionaryResponseModel
        '422':
          description: Validation Error
          content: {}
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                pronunciation_dictionary_locators:
                  type: array
                  items:
                    $ref: >-
                      #/components/schemas/type_:PronunciationDictionaryVersionLocator
                  description: >-
                    A list of pronunciation dictionary locators
                    (pronunciation_dictionary_id, version_id) encoded as a list
                    of JSON strings for pronunciation dictionaries to be applied
                    to the text. A list of json encoded strings is required as
                    adding projects may occur through formData as opposed to
                    jsonBody. To specify multiple dictionaries use multiple
                    --form lines in your curl, such as --form
                    'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"Vmd4Zor6fplcA7WrINey\",\"version_id\":\"hRPaxjlTdR7wFMhV4w0b\"}"'
                    --form
                    'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"JzWtcGQMJ6bnlWwyMo7e\",\"version_id\":\"lbmwxiLu4q6txYxgdZqn\"}"'.
                invalidate_affected_text:
                  type: boolean
                  default: true
                  description: >-
                    This will automatically mark text in this project for
                    reconversion when the new dictionary applies or the old one
                    no longer does.
              required:
                - pronunciation_dictionary_locators
components:
  schemas:
    type_:PronunciationDictionaryVersionLocator:
      type: object
      properties:
        pronunciation_dictionary_id:
          type: string
          description: The ID of the pronunciation dictionary.
        version_id:
          type: string
          description: >-
            The ID of the version of the pronunciation dictionary. If not
            provided, the latest version will be used.
      required:
        - pronunciation_dictionary_id
    type_:CreatePronunciationDictionaryResponseModel:
      type: object
      properties:
        status:
          type: string
          description: >-
            The status of the create pronunciation dictionary request. If the
            request was successful, the status will be 'ok'. Otherwise an error
            message with status 500 will be returned.
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
    await client.studio.projects.pronunciationDictionaries.create("21m00Tcm4TlvDq8ikWAM", {
        pronunciationDictionaryLocators: [
            {
                pronunciationDictionaryId: "pronunciation_dictionary_id",
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

client.studio.projects.pronunciation_dictionaries.create(
    project_id="21m00Tcm4TlvDq8ikWAM",
    pronunciation_dictionary_locators=[
        {
            "pronunciation_dictionary_id": "pronunciation_dictionary_id"
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

	url := "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/pronunciation-dictionaries"

	payload := strings.NewReader("{\n  \"pronunciation_dictionary_locators\": [\n    {\n      \"pronunciation_dictionary_id\": \"pronunciation_dictionary_id\"\n    }\n  ]\n}")

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

url = URI("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/pronunciation-dictionaries")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"pronunciation_dictionary_locators\": [\n    {\n      \"pronunciation_dictionary_id\": \"pronunciation_dictionary_id\"\n    }\n  ]\n}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/pronunciation-dictionaries")
  .header("Content-Type", "application/json")
  .body("{\n  \"pronunciation_dictionary_locators\": [\n    {\n      \"pronunciation_dictionary_id\": \"pronunciation_dictionary_id\"\n    }\n  ]\n}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/pronunciation-dictionaries', [
  'body' => '{
  "pronunciation_dictionary_locators": [
    {
      "pronunciation_dictionary_id": "pronunciation_dictionary_id"
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

var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/pronunciation-dictionaries");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"pronunciation_dictionary_locators\": [\n    {\n      \"pronunciation_dictionary_id\": \"pronunciation_dictionary_id\"\n    }\n  ]\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["pronunciation_dictionary_locators": [["pronunciation_dictionary_id": "pronunciation_dictionary_id"]]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/pronunciation-dictionaries")! as URL,
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