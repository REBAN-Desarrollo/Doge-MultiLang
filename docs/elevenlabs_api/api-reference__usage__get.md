# Get Character Usage Metrics

`GET https://api.elevenlabs.io/v1/usage/character-stats`

Returns the usage metrics for the current user or the entire workspace they are part of. The response provides a time axis based on the specified aggregation interval (default: day), with usage values for each interval along that axis. Usage is broken down by the selected breakdown type. For example, breakdown type "voice" will return the usage of each voice for each interval along the time axis.

## Parameters

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_unix` | integer | Yes | UTC Unix timestamp for the start of the usage window, in milliseconds. To include the first day of the window, the timestamp should be at 00:00:00 of that day. |
| `end_unix` | integer | Yes | UTC Unix timestamp for the end of the usage window, in milliseconds. To include the last day of the window, the timestamp should be at 23:59:59 of that day. |
| `include_workspace_metrics` | boolean | No | Whether or not to include the statistics of the entire workspace. Default: false. |
| `breakdown_type` | string | No | How to break down the information. Cannot be "user" if include_workspace_metrics is False. |
| `aggregation_interval` | string | No | How to aggregate usage data over time. Can be "hour", "day", "week", "month", or "cumulative". |
| `aggregation_bucket_size` | integer | No | Aggregation bucket size in seconds. Overrides the aggregation interval. |
| `metric` | string | No | Which metric to aggregate. |

### Header Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `xi-api-key` | string | No | API key for authentication. |

## Breakdown Types

- `none`
- `voice`
- `voice_multiplier`
- `user`
- `groups`
- `api_keys`
- `all_api_keys`
- `product_type`
- `model`
- `resource`
- `request_queue`
- `region`
- `subresource_id`
- `reporting_workspace_id`
- `has_api_key`
- `request_source`

## Aggregation Intervals

- `hour`
- `day`
- `week`
- `month`
- `cumulative`

## Metric Types

- `credits`
- `tts_characters`
- `minutes_used`
- `request_count`
- `ttfb_avg`
- `ttfb_p95`
- `fiat_units_spent`
- `concurrency`
- `concurrency_average`

## Response

### 200 - Successful Response

```json
{
  "time": [1234567890, 1234654290],
  "usage": {
    "key": [1.0, 2.0]
  }
}
```

- **time** (array of integers): The time axis with unix timestamps for each day.
- **usage** (object): The usage of each breakdown type along the time axis. Keys are breakdown identifiers, values are arrays of doubles.

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
    await client.usage.get({
        startUnix: 1,
        endUnix: 1,
        includeWorkspaceMetrics: true,
        breakdownType: "none",
        aggregationInterval: "hour",
        aggregationBucketSize: 1,
        metric: "credits",
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

client.usage.get(
    start_unix=1,
    end_unix=1,
    include_workspace_metrics=True,
    breakdown_type="none",
    aggregation_interval="hour",
    aggregation_bucket_size=1,
    metric="credits"
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
	url := "https://api.elevenlabs.io/v1/usage/character-stats?start_unix=1&end_unix=1&include_workspace_metrics=true&breakdown_type=none&aggregation_interval=hour&aggregation_bucket_size=1&metric=credits"
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

url = URI("https://api.elevenlabs.io/v1/usage/character-stats?start_unix=1&end_unix=1&include_workspace_metrics=true&breakdown_type=none&aggregation_interval=hour&aggregation_bucket_size=1&metric=credits")

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

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/usage/character-stats?start_unix=1&end_unix=1&include_workspace_metrics=true&breakdown_type=none&aggregation_interval=hour&aggregation_bucket_size=1&metric=credits")
  .asString();
```

### PHP

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();
$response = $client->request('GET', 'https://api.elevenlabs.io/v1/usage/character-stats?start_unix=1&end_unix=1&include_workspace_metrics=true&breakdown_type=none&aggregation_interval=hour&aggregation_bucket_size=1&metric=credits');
echo $response->getBody();
```

### C#

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/usage/character-stats?start_unix=1&end_unix=1&include_workspace_metrics=true&breakdown_type=none&aggregation_interval=hour&aggregation_bucket_size=1&metric=credits");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

### Swift

```swift
import Foundation

let request = NSMutableURLRequest(
    url: NSURL(string: "https://api.elevenlabs.io/v1/usage/character-stats?start_unix=1&end_unix=1&include_workspace_metrics=true&breakdown_type=none&aggregation_interval=hour&aggregation_bucket_size=1&metric=credits")! as URL,
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
