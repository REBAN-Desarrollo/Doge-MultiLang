# List shared voices

GET https://api.elevenlabs.io/v1/shared-voices

Retrieves a list of shared voices.

Reference: https://elevenlabs.io/docs/api-reference/voices/voice-library/get-shared

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get shared voices
  version: endpoint_voices.get_shared
paths:
  /v1/shared-voices:
    get:
      operationId: get-shared
      summary: Get shared voices
      description: Retrieves a list of shared voices.
      tags:
        - - subpackage_voices
      parameters:
        - name: page_size
          in: query
          description: >-
            How many shared voices to return at maximum. Can not exceed 100,
            defaults to 30.
          required: false
          schema:
            type: integer
            default: 30
        - name: category
          in: query
          description: Voice category used for filtering
          required: false
          schema:
            $ref: '#/components/schemas/type_voices:VoicesGetSharedRequestCategory'
        - name: gender
          in: query
          description: Gender used for filtering
          required: false
          schema:
            type: string
        - name: age
          in: query
          description: Age used for filtering
          required: false
          schema:
            type: string
        - name: accent
          in: query
          description: Accent used for filtering
          required: false
          schema:
            type: string
        - name: language
          in: query
          description: Language used for filtering
          required: false
          schema:
            type: string
        - name: locale
          in: query
          description: Locale used for filtering
          required: false
          schema:
            type: string
        - name: search
          in: query
          description: Search term used for filtering
          required: false
          schema:
            type: string
        - name: use_cases
          in: query
          description: Use-case used for filtering
          required: false
          schema:
            type: string
        - name: descriptives
          in: query
          description: Search term used for filtering
          required: false
          schema:
            type: string
        - name: featured
          in: query
          description: Filter featured voices
          required: false
          schema:
            type: boolean
            default: false
        - name: min_notice_period_days
          in: query
          description: >-
            Filter voices with a minimum notice period of the given number of
            days.
          required: false
          schema:
            type: integer
        - name: include_custom_rates
          in: query
          description: Include/exclude voices with custom rates
          required: false
          schema:
            type: boolean
        - name: include_live_moderated
          in: query
          description: Include/exclude voices that are live moderated
          required: false
          schema:
            type: boolean
        - name: reader_app_enabled
          in: query
          description: Filter voices that are enabled for the reader app
          required: false
          schema:
            type: boolean
            default: false
        - name: owner_id
          in: query
          description: Filter voices by public owner ID
          required: false
          schema:
            type: string
        - name: sort
          in: query
          description: Sort criteria
          required: false
          schema:
            type: string
        - name: page
          in: query
          required: false
          schema:
            type: integer
            default: 0
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
                $ref: '#/components/schemas/type_:GetLibraryVoicesResponse'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_voices:VoicesGetSharedRequestCategory:
      type: string
      enum:
        - value: professional
        - value: famous
        - value: high_quality
    type_:LibraryVoiceResponseModelCategory:
      type: string
      enum:
        - value: generated
        - value: cloned
        - value: premade
        - value: professional
        - value: famous
        - value: high_quality
    type_:VerifiedVoiceLanguageResponseModel:
      type: object
      properties:
        language:
          type: string
          description: The language of the voice.
        model_id:
          type: string
          description: The voice's model ID.
        accent:
          type: string
          description: The voice's accent, if applicable.
        locale:
          type: string
          description: The voice's locale, if applicable.
        preview_url:
          type: string
          description: The voice's preview URL, if applicable.
      required:
        - language
        - model_id
    type_:LibraryVoiceResponse:
      type: object
      properties:
        public_owner_id:
          type: string
          description: The public owner id of the voice.
        voice_id:
          type: string
          description: The id of the voice.
        date_unix:
          type: integer
          description: The date the voice was added to the library in Unix time.
        name:
          type: string
          description: The name of the voice.
        accent:
          type: string
          description: The accent of the voice.
        gender:
          type: string
          description: The gender of the voice.
        age:
          type: string
          description: The age of the voice.
        descriptive:
          type: string
          description: The descriptive of the voice.
        use_case:
          type: string
          description: The use case of the voice.
        category:
          $ref: '#/components/schemas/type_:LibraryVoiceResponseModelCategory'
          description: The category of the voice.
        language:
          type: string
          description: The language of the voice.
        locale:
          type: string
          description: The locale of the voice.
        description:
          type: string
          description: The description of the voice.
        preview_url:
          type: string
          description: The preview URL of the voice.
        usage_character_count_1y:
          type: integer
          description: The usage character count of the voice in the last year.
        usage_character_count_7d:
          type: integer
          description: The usage character count of the voice in the last 7 days.
        play_api_usage_character_count_1y:
          type: integer
          description: The play API usage character count of the voice in the last year.
        cloned_by_count:
          type: integer
          description: The number of times the voice has been cloned.
        rate:
          type: number
          format: double
          description: The rate multiplier of the voice.
        fiat_rate:
          type: number
          format: double
          description: The rate of the voice in USD per 1000 credits. null if default
        free_users_allowed:
          type: boolean
          description: Whether free users are allowed to use the voice.
        live_moderation_enabled:
          type: boolean
          description: Whether live moderation is enabled for the voice.
        featured:
          type: boolean
          description: Whether the voice is featured.
        verified_languages:
          type: array
          items:
            $ref: '#/components/schemas/type_:VerifiedVoiceLanguageResponseModel'
          description: The verified languages of the voice.
        notice_period:
          type: integer
          description: The notice period of the voice.
        instagram_username:
          type: string
          description: The Instagram username of the voice.
        twitter_username:
          type: string
          description: The Twitter username of the voice.
        youtube_username:
          type: string
          description: The YouTube username of the voice.
        tiktok_username:
          type: string
          description: The TikTok username of the voice.
        image_url:
          type: string
          description: The image URL of the voice.
        is_added_by_user:
          type: boolean
          description: Whether the voice was added by the user.
      required:
        - public_owner_id
        - voice_id
        - date_unix
        - name
        - accent
        - gender
        - age
        - descriptive
        - use_case
        - category
        - usage_character_count_1y
        - usage_character_count_7d
        - play_api_usage_character_count_1y
        - cloned_by_count
        - free_users_allowed
        - live_moderation_enabled
        - featured
    type_:GetLibraryVoicesResponse:
      type: object
      properties:
        voices:
          type: array
          items:
            $ref: '#/components/schemas/type_:LibraryVoiceResponse'
          description: The list of shared voices
        has_more:
          type: boolean
          description: Whether there are more shared voices in subsequent pages.
        last_sort_id:
          type: string
      required:
        - voices
        - has_more

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.voices.getShared({
        pageSize: 1,
        category: "professional",
        gender: "gender",
        age: "age",
        accent: "accent",
        language: "language",
        locale: "locale",
        search: "search",
        featured: true,
        minNoticePeriodDays: 1,
        includeCustomRates: true,
        includeLiveModerated: true,
        readerAppEnabled: true,
        ownerId: "owner_id",
        sort: "sort",
        page: 1,
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

client.voices.get_shared(
    page_size=1,
    category="professional",
    gender="gender",
    age="age",
    accent="accent",
    language="language",
    locale="locale",
    search="search",
    featured=True,
    min_notice_period_days=1,
    include_custom_rates=True,
    include_live_moderated=True,
    reader_app_enabled=True,
    owner_id="owner_id",
    sort="sort",
    page=1
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

	url := "https://api.elevenlabs.io/v1/shared-voices?page_size=1&category=professional&gender=gender&age=age&accent=accent&language=language&locale=locale&search=search&featured=true&min_notice_period_days=1&include_custom_rates=true&include_live_moderated=true&reader_app_enabled=true&owner_id=owner_id&sort=sort&page=1"

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

url = URI("https://api.elevenlabs.io/v1/shared-voices?page_size=1&category=professional&gender=gender&age=age&accent=accent&language=language&locale=locale&search=search&featured=true&min_notice_period_days=1&include_custom_rates=true&include_live_moderated=true&reader_app_enabled=true&owner_id=owner_id&sort=sort&page=1")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/shared-voices?page_size=1&category=professional&gender=gender&age=age&accent=accent&language=language&locale=locale&search=search&featured=true&min_notice_period_days=1&include_custom_rates=true&include_live_moderated=true&reader_app_enabled=true&owner_id=owner_id&sort=sort&page=1")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/shared-voices?page_size=1&category=professional&gender=gender&age=age&accent=accent&language=language&locale=locale&search=search&featured=true&min_notice_period_days=1&include_custom_rates=true&include_live_moderated=true&reader_app_enabled=true&owner_id=owner_id&sort=sort&page=1');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/shared-voices?page_size=1&category=professional&gender=gender&age=age&accent=accent&language=language&locale=locale&search=search&featured=true&min_notice_period_days=1&include_custom_rates=true&include_live_moderated=true&reader_app_enabled=true&owner_id=owner_id&sort=sort&page=1");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/shared-voices?page_size=1&category=professional&gender=gender&age=age&accent=accent&language=language&locale=locale&search=search&featured=true&min_notice_period_days=1&include_custom_rates=true&include_live_moderated=true&reader_app_enabled=true&owner_id=owner_id&sort=sort&page=1")! as URL,
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