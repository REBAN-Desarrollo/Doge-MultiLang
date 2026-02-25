# List pronunciation dictionaries

GET https://api.elevenlabs.io/v1/pronunciation-dictionaries

Get a list of the pronunciation dictionaries you have access to and their metadata

Reference: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/list

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List pronunciation dictionaries
  version: endpoint_pronunciationDictionaries.list
paths:
  /v1/pronunciation-dictionaries:
    get:
      operationId: list
      summary: List pronunciation dictionaries
      description: >-
        Get a list of the pronunciation dictionaries you have access to and
        their metadata
      tags:
        - - subpackage_pronunciationDictionaries
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
            How many pronunciation dictionaries to return at maximum. Can not
            exceed 100, defaults to 30.
          required: false
          schema:
            type: integer
            default: 30
        - name: sort
          in: query
          description: Which field to sort by, one of 'created_at_unix' or 'name'.
          required: false
          schema:
            $ref: >-
              #/components/schemas/type_pronunciationDictionaries:PronunciationDictionariesListRequestSort
        - name: sort_direction
          in: query
          description: Which direction to sort the voices in. 'ascending' or 'descending'.
          required: false
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
                  #/components/schemas/type_:GetPronunciationDictionariesMetadataResponseModel
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_pronunciationDictionaries:PronunciationDictionariesListRequestSort:
      type: string
      enum:
        - value: creation_time_unix
        - value: name
    type_:GetPronunciationDictionaryMetadataResponseModelPermissionOnResource:
      type: string
      enum:
        - value: admin
        - value: editor
        - value: commenter
        - value: viewer
    type_:GetPronunciationDictionaryMetadataResponse:
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
            #/components/schemas/type_:GetPronunciationDictionaryMetadataResponseModelPermissionOnResource
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
      required:
        - id
        - latest_version_id
        - latest_version_rules_num
        - name
        - created_by
        - creation_time_unix
    type_:GetPronunciationDictionariesMetadataResponseModel:
      type: object
      properties:
        pronunciation_dictionaries:
          type: array
          items:
            $ref: >-
              #/components/schemas/type_:GetPronunciationDictionaryMetadataResponse
          description: A list of pronunciation dictionaries and their metadata.
        next_cursor:
          type: string
          description: The next cursor to use for pagination.
        has_more:
          type: boolean
          description: Whether there are more pronunciation dictionaries to fetch.
      required:
        - pronunciation_dictionaries
        - has_more

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.pronunciationDictionaries.list({
        cursor: "cursor",
        pageSize: 1,
        sort: "creation_time_unix",
        sortDirection: "sort_direction",
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

client.pronunciation_dictionaries.list(
    cursor="cursor",
    page_size=1,
    sort="creation_time_unix",
    sort_direction="sort_direction"
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

	url := "https://api.elevenlabs.io/v1/pronunciation-dictionaries?cursor=cursor&page_size=1&sort=creation_time_unix&sort_direction=sort_direction"

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

url = URI("https://api.elevenlabs.io/v1/pronunciation-dictionaries?cursor=cursor&page_size=1&sort=creation_time_unix&sort_direction=sort_direction")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/pronunciation-dictionaries?cursor=cursor&page_size=1&sort=creation_time_unix&sort_direction=sort_direction")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/pronunciation-dictionaries?cursor=cursor&page_size=1&sort=creation_time_unix&sort_direction=sort_direction');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/pronunciation-dictionaries?cursor=cursor&page_size=1&sort=creation_time_unix&sort_direction=sort_direction");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/pronunciation-dictionaries?cursor=cursor&page_size=1&sort=creation_time_unix&sort_direction=sort_direction")! as URL,
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