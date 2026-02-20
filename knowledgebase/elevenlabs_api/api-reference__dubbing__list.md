# List Dubs

GET https://api.elevenlabs.io/v1/dubbing

List the dubs you have access to.

Reference: https://elevenlabs.io/docs/api-reference/dubbing/list

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List Dubs
  version: endpoint_dubbing.list
paths:
  /v1/dubbing:
    get:
      operationId: list
      summary: List Dubs
      description: List the dubs you have access to.
      tags:
        - - subpackage_dubbing
      parameters:
        - name: cursor
          in: query
          description: Used for fetching next page. Cursor is returned in the response.
          required: false
          schema:
            type: string
        - name: page_size
          in: query
          description: >-
            How many dubs to return at maximum. Can not exceed 200, defaults to
            100.
          required: false
          schema:
            type: integer
            default: 100
        - name: dubbing_status
          in: query
          description: What state the dub is currently in.
          required: false
          schema:
            $ref: '#/components/schemas/type_dubbing:DubbingListRequestDubbingStatus'
        - name: filter_by_creator
          in: query
          description: >-
            Filters who created the resources being listed, whether it was the
            user running the request or someone else that shared the resource
            with them.
          required: false
          schema:
            $ref: >-
              #/components/schemas/type_dubbing:DubbingListRequestFilterByCreator
        - name: order_by
          in: query
          description: The field to use for ordering results from this query.
          required: false
          schema:
            type: string
            enum:
              - type: stringLiteral
                value: created_at
        - name: order_direction
          in: query
          description: The order direction to use for results from this query.
          required: false
          schema:
            $ref: '#/components/schemas/type_dubbing:DubbingListRequestOrderDirection'
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
                $ref: '#/components/schemas/type_:DubbingMetadataPageResponseModel'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_dubbing:DubbingListRequestDubbingStatus:
      type: string
      enum:
        - value: dubbing
        - value: dubbed
        - value: failed
    type_dubbing:DubbingListRequestFilterByCreator:
      type: string
      enum:
        - value: personal
        - value: others
        - value: all
      default: all
    type_dubbing:DubbingListRequestOrderDirection:
      type: string
      enum:
        - value: DESCENDING
        - value: ASCENDING
      default: DESCENDING
    type_:DubbingMediaMetadata:
      type: object
      properties:
        content_type:
          type: string
          description: The content type of the media.
        duration:
          type: number
          format: double
          description: The duration of the media in seconds.
      required:
        - content_type
        - duration
    type_:DubbingMetadataResponse:
      type: object
      properties:
        dubbing_id:
          type: string
          description: The ID of the dubbing project.
        name:
          type: string
          description: The name of the dubbing project.
        status:
          type: string
          description: The state this dub is in.
        source_language:
          type: string
          description: >-
            Once dubbing has completed, the ISO-639-1 code of the original
            media's source language.
        target_languages:
          type: array
          items:
            type: string
          description: The ISO-639-1 code of the languages this media has been dubbed into.
        editable:
          type: boolean
          default: false
          description: Whether this dubbing project is editable in Dubbing Studio.
        created_at:
          type: string
          format: date-time
          description: Timestamp this dub was created.
        media_metadata:
          $ref: '#/components/schemas/type_:DubbingMediaMetadata'
          description: >-
            Metadata, such as the length in seconds and content type, of the
            dubbed content.
        error:
          type: string
          description: Error message indicate, if this dub has failed, what happened.
      required:
        - dubbing_id
        - name
        - status
        - target_languages
        - created_at
    type_:DubbingMetadataPageResponseModel:
      type: object
      properties:
        dubs:
          type: array
          items:
            $ref: '#/components/schemas/type_:DubbingMetadataResponse'
        next_cursor:
          type: string
        has_more:
          type: boolean
      required:
        - dubs
        - has_more

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.dubbing.list({
        cursor: "cursor",
        pageSize: 1,
        dubbingStatus: "dubbing",
        filterByCreator: "personal",
        orderBy: "created_at",
        orderDirection: "DESCENDING",
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

client.dubbing.list(
    cursor="cursor",
    page_size=1,
    dubbing_status="dubbing",
    filter_by_creator="personal",
    order_by="created_at",
    order_direction="DESCENDING"
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

	url := "https://api.elevenlabs.io/v1/dubbing?cursor=cursor&page_size=1&dubbing_status=dubbing&filter_by_creator=personal&order_by=created_at&order_direction=DESCENDING"

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

url = URI("https://api.elevenlabs.io/v1/dubbing?cursor=cursor&page_size=1&dubbing_status=dubbing&filter_by_creator=personal&order_by=created_at&order_direction=DESCENDING")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/dubbing?cursor=cursor&page_size=1&dubbing_status=dubbing&filter_by_creator=personal&order_by=created_at&order_direction=DESCENDING")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/dubbing?cursor=cursor&page_size=1&dubbing_status=dubbing&filter_by_creator=personal&order_by=created_at&order_direction=DESCENDING');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/dubbing?cursor=cursor&page_size=1&dubbing_status=dubbing&filter_by_creator=personal&order_by=created_at&order_direction=DESCENDING");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing?cursor=cursor&page_size=1&dubbing_status=dubbing&filter_by_creator=personal&order_by=created_at&order_direction=DESCENDING")! as URL,
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