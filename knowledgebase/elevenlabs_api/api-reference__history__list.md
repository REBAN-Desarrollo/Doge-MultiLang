# Get Generated Items (History List)

`GET https://api.elevenlabs.io/v1/history`

Returns a list of your generated audio.

## Parameters

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page_size` | integer | No | 100 | How many history items to return at maximum. Can not exceed 1000. |
| `start_after_history_item_id` | string | No | - | After which ID to start fetching, use this parameter to paginate across a large collection of history items. If not provided, history items will be fetched starting from the most recently created one ordered descending by their creation date. |
| `voice_id` | string | No | - | ID of the voice to be filtered for. You can use the Get voices endpoint to list all available voices. |
| `model_id` | string | No | - | Search term used for filtering history items. If provided, source becomes required. |
| `date_before_unix` | integer | No | - | Unix timestamp to filter history items before this date (exclusive). |
| `date_after_unix` | integer | No | - | Unix timestamp to filter history items after this date (inclusive). |
| `sort_direction` | string | No | - | Sort direction for the results. Values: `asc`, `desc`. |
| `search` | string | No | - | Search term used for filtering. |
| `source` | string | No | - | Source of the generated history item. Values: `TTS`, `STS`. |

### Header Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `xi-api-key` | string | No | API key for authentication. |

## Response

### 200 - Successful Response

```json
{
  "history": [
    {
      "history_item_id": "string",
      "request_id": "string",
      "voice_id": "string",
      "model_id": "string",
      "voice_name": "string",
      "voice_category": "premade | cloned | generated | professional",
      "text": "string",
      "date_unix": 1234567890,
      "character_count_change_from": 0,
      "character_count_change_to": 100,
      "content_type": "string",
      "state": "any",
      "settings": {},
      "feedback": {
        "thumbs_up": true,
        "feedback": "string",
        "emotions": false,
        "inaccurate_clone": false,
        "glitches": false,
        "audio_quality": true,
        "other": false,
        "review_status": "not_reviewed"
      },
      "share_link_id": "string",
      "source": "TTS | STS | Projects | PD | AN | Dubbing | PlayAPI | ConvAI | VoiceGeneration",
      "alignments": {
        "alignment": {
          "characters": ["H", "e", "l", "l", "o"],
          "character_start_times_seconds": [0.0, 0.1, 0.2, 0.3, 0.4],
          "character_end_times_seconds": [0.1, 0.2, 0.3, 0.4, 0.5]
        },
        "normalized_alignment": {
          "characters": ["H", "e", "l", "l", "o"],
          "character_start_times_seconds": [0.0, 0.1, 0.2, 0.3, 0.4],
          "character_end_times_seconds": [0.1, 0.2, 0.3, 0.4, 0.5]
        }
      },
      "dialogue": [
        {
          "text": "string",
          "voice_id": "string",
          "voice_name": "string"
        }
      ]
    }
  ],
  "last_history_item_id": "string",
  "has_more": true,
  "scanned_until": 1234567890
}
```

### Response Fields

- **history** (array): A list of speech history items.
- **last_history_item_id** (string): The ID of the last history item.
- **has_more** (boolean): Whether there are more history items to fetch.
- **scanned_until** (integer): The timestamp of the last history item.

### History Item Fields

- **history_item_id** (string): The ID of the history item.
- **request_id** (string): The ID of the request.
- **voice_id** (string): The ID of the voice used.
- **model_id** (string): The ID of the model.
- **voice_name** (string): The name of the voice.
- **voice_category** (string): Either 'premade', 'cloned', 'generated' or 'professional'.
- **text** (string): The text used to generate the audio item.
- **date_unix** (integer): Unix timestamp of when the item was created.
- **character_count_change_from** (integer): The character count change from.
- **character_count_change_to** (integer): The character count change to.
- **content_type** (string): The content type of the generated item.
- **state**: Any type.
- **settings** (object): The settings of the history item.
- **feedback** (object): Feedback associated with the generated item. Returns null if no feedback has been provided.
- **share_link_id** (string): The ID of the share link.
- **source** (string): The source of the history item (TTS, STS, AN, Projects, Dubbing, PlayAPI, PD, ConvAI, VoiceGeneration).
- **alignments** (object): The alignments of the history item.
- **dialogue** (array): The dialogue (voice and text pairs) used to generate the audio item.

### 422 - Validation Error

Returned when query parameters fail validation.

## SDK Code Examples

### TypeScript

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.history.list({
        pageSize: 1,
        startAfterHistoryItemId: "start_after_history_item_id",
        voiceId: "voice_id",
        modelId: "model_id",
        dateBeforeUnix: 1,
        dateAfterUnix: 1,
        sortDirection: "asc",
        search: "search",
        source: "TTS",
    });
}
main();
```

### Python

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.history.list(
    page_size=1,
    start_after_history_item_id="start_after_history_item_id",
    voice_id="voice_id",
    model_id="model_id",
    date_before_unix=1,
    date_after_unix=1,
    sort_direction="asc",
    search="search",
    source="TTS"
)
```

### Go

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {
	url := "https://api.elevenlabs.io/v1/history?page_size=1&start_after_history_item_id=start_after_history_item_id&voice_id=voice_id&model_id=model_id&date_before_unix=1&date_after_unix=1&sort_direction=asc&search=search&source=TTS"
	req, _ := http.NewRequest("GET", url, nil)
	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	fmt.Println(res)
	fmt.Println(string(body))
}
```

### Ruby

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/history?page_size=1&start_after_history_item_id=start_after_history_item_id&voice_id=voice_id&model_id=model_id&date_before_unix=1&date_after_unix=1&sort_direction=asc&search=search&source=TTS")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
response = http.request(request)
puts response.read_body
```

### Java

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/history?page_size=1&start_after_history_item_id=start_after_history_item_id&voice_id=voice_id&model_id=model_id&date_before_unix=1&date_after_unix=1&sort_direction=asc&search=search&source=TTS")
  .asString();
```

### PHP

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();
$response = $client->request('GET', 'https://api.elevenlabs.io/v1/history?page_size=1&start_after_history_item_id=start_after_history_item_id&voice_id=voice_id&model_id=model_id&date_before_unix=1&date_after_unix=1&sort_direction=asc&search=search&source=TTS');
echo $response->getBody();
```

### C#

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/history?page_size=1&start_after_history_item_id=start_after_history_item_id&voice_id=voice_id&model_id=model_id&date_before_unix=1&date_after_unix=1&sort_direction=asc&search=search&source=TTS");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

### Swift

```swift
import Foundation

let request = NSMutableURLRequest(
    url: NSURL(string: "https://api.elevenlabs.io/v1/history?page_size=1&start_after_history_item_id=start_after_history_item_id&voice_id=voice_id&model_id=model_id&date_before_unix=1&date_after_unix=1&sort_direction=asc&search=search&source=TTS")! as URL,
    cachePolicy: .useProtocolCachePolicy,
    timeoutInterval: 10.0
)
request.httpMethod = "GET"

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest) { (data, response, error) in
    if let error = error {
        print(error)
    } else {
        let httpResponse = response as? HTTPURLResponse
        print(httpResponse as Any)
    }
}
dataTask.resume()
```
