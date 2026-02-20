# List models

GET https://api.elevenlabs.io/v1/models

Gets a list of available models.

Reference: https://elevenlabs.io/docs/api-reference/models/list

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List models
  version: endpoint_models.list
paths:
  /v1/models:
    get:
      operationId: list
      summary: List models
      description: Gets a list of available models.
      tags:
        - - subpackage_models
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
                type: array
                items:
                  $ref: '#/components/schemas/type_:Model'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:LanguageResponse:
      type: object
      properties:
        language_id:
          type: string
          description: The unique identifier of the language.
        name:
          type: string
          description: The name of the language.
      required:
        - language_id
        - name
    type_:ModelRatesResponseModel:
      type: object
      properties:
        character_cost_multiplier:
          type: number
          format: double
          description: The cost multiplier for characters.
      required:
        - character_cost_multiplier
    type_:Model:
      type: object
      properties:
        model_id:
          type: string
          description: The unique identifier of the model.
        name:
          type: string
          description: The name of the model.
        can_be_finetuned:
          type: boolean
          description: Whether the model can be finetuned.
        can_do_text_to_speech:
          type: boolean
          description: Whether the model can do text-to-speech.
        can_do_voice_conversion:
          type: boolean
          description: Whether the model can do voice conversion.
        can_use_style:
          type: boolean
          description: Whether the model can use style.
        can_use_speaker_boost:
          type: boolean
          description: Whether the model can use speaker boost.
        serves_pro_voices:
          type: boolean
          description: Whether the model serves pro voices.
        token_cost_factor:
          type: number
          format: double
          description: The cost factor for the model.
        description:
          type: string
          description: The description of the model.
        requires_alpha_access:
          type: boolean
          description: Whether the model requires alpha access.
        max_characters_request_free_user:
          type: integer
          description: >-
            The maximum number of characters that can be requested by a free
            user.
        max_characters_request_subscribed_user:
          type: integer
          description: >-
            The maximum number of characters that can be requested by a
            subscribed user.
        maximum_text_length_per_request:
          type: integer
          description: The maximum length of text that can be requested for this model.
        languages:
          type: array
          items:
            $ref: '#/components/schemas/type_:LanguageResponse'
          description: The languages supported by the model.
        model_rates:
          $ref: '#/components/schemas/type_:ModelRatesResponseModel'
          description: The rates for the model.
        concurrency_group:
          type: string
          description: The concurrency group for the model.
      required:
        - model_id

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.models.list();
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.models.list()

```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/models"

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

url = URI("https://api.elevenlabs.io/v1/models")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/models")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/models');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/models");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/models")! as URL,
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