# Get Chapter Snapshot

GET https://api.elevenlabs.io/v1/studio/projects/{project_id}/chapters/{chapter_id}/snapshots/{chapter_snapshot_id}

Returns the chapter snapshot.

Reference: https://elevenlabs.io/docs/api-reference/studio/get-chapter-snapshot

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get Chapter Snapshot
  version: endpoint_studio/projects/chapters/snapshots.get
paths:
  /v1/studio/projects/{project_id}/chapters/{chapter_id}/snapshots/{chapter_snapshot_id}:
    get:
      operationId: get
      summary: Get Chapter Snapshot
      description: Returns the chapter snapshot.
      tags:
        - - subpackage_studio
          - subpackage_studio/projects
          - subpackage_studio/projects/chapters
          - subpackage_studio/projects/chapters/snapshots
      parameters:
        - name: project_id
          in: path
          description: The ID of the Studio project.
          required: true
          schema:
            type: string
        - name: chapter_id
          in: path
          description: The ID of the chapter.
          required: true
          schema:
            type: string
        - name: chapter_snapshot_id
          in: path
          description: The ID of the chapter snapshot.
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
                  #/components/schemas/type_:ChapterSnapshotExtendedResponseModel
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:CharacterAlignmentModel:
      type: object
      properties:
        characters:
          type: array
          items:
            type: string
        character_start_times_seconds:
          type: array
          items:
            type: number
            format: double
        character_end_times_seconds:
          type: array
          items:
            type: number
            format: double
      required:
        - characters
        - character_start_times_seconds
        - character_end_times_seconds
    type_:ChapterSnapshotExtendedResponseModel:
      type: object
      properties:
        chapter_snapshot_id:
          type: string
          description: The ID of the chapter snapshot.
        project_id:
          type: string
          description: The ID of the project.
        chapter_id:
          type: string
          description: The ID of the chapter.
        created_at_unix:
          type: integer
          description: The creation date of the chapter snapshot.
        name:
          type: string
          description: The name of the chapter snapshot.
        character_alignments:
          type: array
          items:
            $ref: '#/components/schemas/type_:CharacterAlignmentModel'
      required:
        - chapter_snapshot_id
        - project_id
        - chapter_id
        - created_at_unix
        - name
        - character_alignments

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.studio.projects.chapters.snapshots.get("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
}
main();

```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.studio.projects.chapters.snapshots.get(
    project_id="21m00Tcm4TlvDq8ikWAM",
    chapter_id="21m00Tcm4TlvDq8ikWAM",
    chapter_snapshot_id="21m00Tcm4TlvDq8ikWAM"
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

	url := "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM"

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

url = URI("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/chapters/21m00Tcm4TlvDq8ikWAM/snapshots/21m00Tcm4TlvDq8ikWAM")! as URL,
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