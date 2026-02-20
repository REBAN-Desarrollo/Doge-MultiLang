# List voices

GET https://api.elevenlabs.io/v2/voices

Gets a list of all available voices for a user with search, filtering and pagination.

Reference: https://elevenlabs.io/docs/api-reference/voices/search

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List voices
  version: endpoint_voices.search
paths:
  /v2/voices:
    get:
      operationId: search
      summary: List voices
      description: >-
        Gets a list of all available voices for a user with search, filtering
        and pagination.
      tags:
        - - subpackage_voices
      parameters:
        - name: next_page_token
          in: query
          description: >-
            The next page token to use for pagination. Returned from the
            previous request. Use this in combination with the has_more flag for
            reliable pagination.
          required: false
          schema:
            type: string
        - name: page_size
          in: query
          description: >-
            How many voices to return at maximum. Can not exceed 100, defaults
            to 10. Page 0 may include more voices due to default voices being
            included.
          required: false
          schema:
            type: integer
            default: 10
        - name: search
          in: query
          description: >-
            Search term to filter voices by. Searches in name, description,
            labels, category.
          required: false
          schema:
            type: string
        - name: sort
          in: query
          description: >-
            Which field to sort by, one of 'created_at_unix' or 'name'.
            'created_at_unix' may not be available for older voices.
          required: false
          schema:
            type: string
        - name: sort_direction
          in: query
          description: Which direction to sort the voices in. 'asc' or 'desc'.
          required: false
          schema:
            type: string
        - name: voice_type
          in: query
          description: >-
            Type of the voice to filter by. One of 'personal', 'community',
            'default', 'workspace', 'non-default', 'saved'. 'non-default' is
            equal to all but 'default'. 'saved' is equal to non-default, but
            includes default voices if they have been added to a collection.
          required: false
          schema:
            type: string
        - name: category
          in: query
          description: >-
            Category of the voice to filter by. One of 'premade', 'cloned',
            'generated', 'professional'
          required: false
          schema:
            type: string
        - name: fine_tuning_state
          in: query
          description: >-
            State of the voice's fine tuning to filter by. Applicable only to
            professional voices clones. One of 'draft', 'not_verified',
            'not_started', 'queued', 'fine_tuning', 'fine_tuned', 'failed',
            'delayed'
          required: false
          schema:
            type: string
        - name: collection_id
          in: query
          description: Collection ID to filter voices by.
          required: false
          schema:
            type: string
        - name: include_total_count
          in: query
          description: >-
            Whether to include the total count of voices found in the response.
            NOTE: The total_count value is a live snapshot and may change
            between requests as users create, modify, or delete voices. For
            pagination, rely on the has_more flag instead. Only enable this when
            you actually need the total count (e.g., for display purposes), as
            it incurs a performance cost.
          required: false
          schema:
            type: boolean
            default: true
        - name: voice_ids
          in: query
          description: Voice IDs to lookup by. Maximum 100 voice IDs.
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
                $ref: '#/components/schemas/type_:GetVoicesV2Response'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:SpeakerSeparationResponseModelStatus:
      type: string
      enum:
        - value: not_started
        - value: pending
        - value: completed
        - value: failed
    type_:UtteranceResponseModel:
      type: object
      properties:
        start:
          type: number
          format: double
          description: The start time of the utterance in seconds.
        end:
          type: number
          format: double
          description: The end time of the utterance in seconds.
      required:
        - start
        - end
    type_:SpeakerResponseModel:
      type: object
      properties:
        speaker_id:
          type: string
          description: The ID of the speaker.
        duration_secs:
          type: number
          format: double
          description: The duration of the speaker segment in seconds.
        utterances:
          type: array
          items:
            $ref: '#/components/schemas/type_:UtteranceResponseModel'
          description: The utterances of the speaker.
      required:
        - speaker_id
        - duration_secs
    type_:SpeakerSeparationResponseModel:
      type: object
      properties:
        voice_id:
          type: string
          description: The ID of the voice.
        sample_id:
          type: string
          description: The ID of the sample.
        status:
          $ref: '#/components/schemas/type_:SpeakerSeparationResponseModelStatus'
          description: The status of the speaker separation.
        speakers:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/type_:SpeakerResponseModel'
          description: The speakers of the sample.
        selected_speaker_ids:
          type: array
          items:
            type: string
          description: The IDs of the selected speakers.
      required:
        - voice_id
        - sample_id
        - status
    type_:VoiceSample:
      type: object
      properties:
        sample_id:
          type: string
          description: The ID of the sample.
        file_name:
          type: string
          description: The name of the sample file.
        mime_type:
          type: string
          description: The MIME type of the sample file.
        size_bytes:
          type: integer
          description: The size of the sample file in bytes.
        hash:
          type: string
          description: The hash of the sample file.
        duration_secs:
          type: number
          format: double
        remove_background_noise:
          type: boolean
        has_isolated_audio:
          type: boolean
        has_isolated_audio_preview:
          type: boolean
        speaker_separation:
          $ref: '#/components/schemas/type_:SpeakerSeparationResponseModel'
        trim_start:
          type: integer
        trim_end:
          type: integer
    type_:VoiceResponseModelCategory:
      type: string
      enum:
        - value: generated
        - value: cloned
        - value: premade
        - value: professional
        - value: famous
        - value: high_quality
    type_:FineTuningResponseModelStateValue:
      type: string
      enum:
        - value: not_started
        - value: queued
        - value: fine_tuning
        - value: fine_tuned
        - value: failed
        - value: delayed
    type_:RecordingResponse:
      type: object
      properties:
        recording_id:
          type: string
          description: The ID of the recording.
        mime_type:
          type: string
          description: The MIME type of the recording.
        size_bytes:
          type: integer
          description: The size of the recording in bytes.
        upload_date_unix:
          type: integer
          description: The date of the recording in Unix time.
        transcription:
          type: string
          description: The transcription of the recording.
      required:
        - recording_id
        - mime_type
        - size_bytes
        - upload_date_unix
        - transcription
    type_:VerificationAttemptResponse:
      type: object
      properties:
        text:
          type: string
          description: The text of the verification attempt.
        date_unix:
          type: integer
          description: The date of the verification attempt in Unix time.
        accepted:
          type: boolean
          description: Whether the verification attempt was accepted.
        similarity:
          type: number
          format: double
          description: The similarity of the verification attempt.
        levenshtein_distance:
          type: number
          format: double
          description: The Levenshtein distance of the verification attempt.
        recording:
          $ref: '#/components/schemas/type_:RecordingResponse'
          description: The recording of the verification attempt.
      required:
        - text
        - date_unix
        - accepted
        - similarity
        - levenshtein_distance
    type_:ManualVerificationFileResponse:
      type: object
      properties:
        file_id:
          type: string
          description: The ID of the file.
        file_name:
          type: string
          description: The name of the file.
        mime_type:
          type: string
          description: The MIME type of the file.
        size_bytes:
          type: integer
          description: The size of the file in bytes.
        upload_date_unix:
          type: integer
          description: The date of the file in Unix time.
      required:
        - file_id
        - file_name
        - mime_type
        - size_bytes
        - upload_date_unix
    type_:ManualVerificationResponse:
      type: object
      properties:
        extra_text:
          type: string
          description: The extra text of the manual verification.
        request_time_unix:
          type: integer
          description: The date of the manual verification in Unix time.
        files:
          type: array
          items:
            $ref: '#/components/schemas/type_:ManualVerificationFileResponse'
          description: The files of the manual verification.
      required:
        - extra_text
        - request_time_unix
        - files
    type_:FineTuningResponse:
      type: object
      properties:
        is_allowed_to_fine_tune:
          type: boolean
          description: Whether the user is allowed to fine-tune the voice.
        state:
          type: object
          additionalProperties:
            $ref: '#/components/schemas/type_:FineTuningResponseModelStateValue'
          description: The state of the fine-tuning process for each model.
        verification_failures:
          type: array
          items:
            type: string
          description: List of verification failures in the fine-tuning process.
        verification_attempts_count:
          type: integer
          description: The number of verification attempts in the fine-tuning process.
        manual_verification_requested:
          type: boolean
          description: >-
            Whether a manual verification was requested for the fine-tuning
            process.
        language:
          type: string
          description: The language of the fine-tuning process.
        progress:
          type: object
          additionalProperties:
            type: number
            format: double
          description: The progress of the fine-tuning process.
        message:
          type: object
          additionalProperties:
            type: string
          description: The message of the fine-tuning process.
        dataset_duration_seconds:
          type: number
          format: double
          description: The duration of the dataset in seconds.
        verification_attempts:
          type: array
          items:
            $ref: '#/components/schemas/type_:VerificationAttemptResponse'
          description: The number of verification attempts.
        slice_ids:
          type: array
          items:
            type: string
          description: List of slice IDs.
        manual_verification:
          $ref: '#/components/schemas/type_:ManualVerificationResponse'
          description: The manual verification of the fine-tuning process.
        max_verification_attempts:
          type: integer
          description: The maximum number of verification attempts.
        next_max_verification_attempts_reset_unix_ms:
          type: integer
          description: >-
            The next maximum verification attempts reset time in Unix
            milliseconds.
        finetuning_state:
          description: Any type
    type_:VoiceSettings:
      type: object
      properties:
        stability:
          type: number
          format: double
          description: >-
            Determines how stable the voice is and the randomness between each
            generation. Lower values introduce broader emotional range for the
            voice. Higher values can result in a monotonous voice with limited
            emotion.
        use_speaker_boost:
          type: boolean
          description: >-
            This setting boosts the similarity to the original speaker. Using
            this setting requires a slightly higher computational load, which in
            turn increases latency.
        similarity_boost:
          type: number
          format: double
          description: >-
            Determines how closely the AI should adhere to the original voice
            when attempting to replicate it.
        style:
          type: number
          format: double
          description: >-
            Determines the style exaggeration of the voice. This setting
            attempts to amplify the style of the original speaker. It does
            consume additional computational resources and might increase
            latency if set to anything other than 0.
        speed:
          type: number
          format: double
          description: >-
            Adjusts the speed of the voice. A value of 1.0 is the default speed,
            while values less than 1.0 slow down the speech, and values greater
            than 1.0 speed it up.
    type_:voice_sharing_state:
      type: string
      enum:
        - value: enabled
        - value: disabled
        - value: copied
        - value: copied_disabled
    type_:VoiceSharingResponseModelCategory:
      type: string
      enum:
        - value: generated
        - value: cloned
        - value: premade
        - value: professional
        - value: famous
        - value: high_quality
    type_:review_status:
      type: string
      enum:
        - value: not_requested
        - value: pending
        - value: declined
        - value: allowed
        - value: allowed_with_changes
    type_:VoiceSharingModerationCheckResponseModel:
      type: object
      properties:
        date_checked_unix:
          type: integer
          description: The date the moderation check was made in Unix time.
        name_value:
          type: string
          description: The name value of the voice.
        name_check:
          type: boolean
          description: Whether the name check was successful.
        description_value:
          type: string
          description: The description value of the voice.
        description_check:
          type: boolean
          description: Whether the description check was successful.
        sample_ids:
          type: array
          items:
            type: string
          description: A list of sample IDs.
        sample_checks:
          type: array
          items:
            type: number
            format: double
          description: A list of sample checks.
        captcha_ids:
          type: array
          items:
            type: string
          description: A list of captcha IDs.
        captcha_checks:
          type: array
          items:
            type: number
            format: double
          description: A list of CAPTCHA check values.
    type_:ReaderResourceResponseModelResourceType:
      type: string
      enum:
        - value: read
        - value: collection
    type_:ReaderResourceResponseModel:
      type: object
      properties:
        resource_type:
          $ref: '#/components/schemas/type_:ReaderResourceResponseModelResourceType'
          description: The type of resource.
        resource_id:
          type: string
          description: The ID of the resource.
      required:
        - resource_type
        - resource_id
    type_:VoiceSharingResponse:
      type: object
      properties:
        status:
          $ref: '#/components/schemas/type_:voice_sharing_state'
          description: The status of the voice sharing.
        history_item_sample_id:
          type: string
          description: The sample ID of the history item.
        date_unix:
          type: integer
          description: The date of the voice sharing in Unix time.
        whitelisted_emails:
          type: array
          items:
            type: string
          description: A list of whitelisted emails.
        public_owner_id:
          type: string
          description: The ID of the public owner.
        original_voice_id:
          type: string
          description: The ID of the original voice.
        financial_rewards_enabled:
          type: boolean
          description: Whether financial rewards are enabled.
        free_users_allowed:
          type: boolean
          description: Whether free users are allowed.
        live_moderation_enabled:
          type: boolean
          description: Whether live moderation is enabled.
        rate:
          type: number
          format: double
          description: The rate of the voice sharing.
        fiat_rate:
          type: number
          format: double
          description: The rate of the voice sharing in USD per 1000 credits.
        notice_period:
          type: integer
          description: The notice period of the voice sharing.
        disable_at_unix:
          type: integer
          description: The date of the voice sharing in Unix time.
        voice_mixing_allowed:
          type: boolean
          description: Whether voice mixing is allowed.
        featured:
          type: boolean
          description: Whether the voice is featured.
        category:
          $ref: '#/components/schemas/type_:VoiceSharingResponseModelCategory'
          description: The category of the voice.
        reader_app_enabled:
          type: boolean
          description: Whether the reader app is enabled.
        image_url:
          type: string
          description: The image URL of the voice.
        ban_reason:
          type: string
          description: The ban reason of the voice.
        liked_by_count:
          type: integer
          description: The number of likes on the voice.
        cloned_by_count:
          type: integer
          description: The number of clones on the voice.
        name:
          type: string
          description: The name of the voice.
        description:
          type: string
          description: The description of the voice.
        labels:
          type: object
          additionalProperties:
            type: string
          description: The labels of the voice.
        review_status:
          $ref: '#/components/schemas/type_:review_status'
          description: The review status of the voice.
        review_message:
          type: string
          description: The review message of the voice.
        enabled_in_library:
          type: boolean
          description: Whether the voice is enabled in the library.
        instagram_username:
          type: string
          description: The Instagram username of the voice.
        twitter_username:
          type: string
          description: The Twitter/X username of the voice.
        youtube_username:
          type: string
          description: The YouTube username of the voice.
        tiktok_username:
          type: string
          description: The TikTok username of the voice.
        moderation_check:
          $ref: '#/components/schemas/type_:VoiceSharingModerationCheckResponseModel'
          description: The moderation check of the voice.
        reader_restricted_on:
          type: array
          items:
            $ref: '#/components/schemas/type_:ReaderResourceResponseModel'
          description: The reader restricted on of the voice.
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
    type_:VoiceResponseModelSafetyControl:
      type: string
      enum:
        - value: NONE
        - value: BAN
        - value: CAPTCHA
        - value: ENTERPRISE_BAN
        - value: ENTERPRISE_CAPTCHA
    type_:VoiceVerificationResponse:
      type: object
      properties:
        requires_verification:
          type: boolean
          description: Whether the voice requires verification.
        is_verified:
          type: boolean
          description: Whether the voice has been verified.
        verification_failures:
          type: array
          items:
            type: string
          description: List of verification failures.
        verification_attempts_count:
          type: integer
          description: The number of verification attempts.
        language:
          type: string
          description: The language of the voice.
        verification_attempts:
          type: array
          items:
            $ref: '#/components/schemas/type_:VerificationAttemptResponse'
          description: Number of times a verification was attempted.
      required:
        - requires_verification
        - is_verified
        - verification_failures
        - verification_attempts_count
    type_:Voice:
      type: object
      properties:
        voice_id:
          type: string
          description: The ID of the voice.
        name:
          type: string
          description: The name of the voice.
        samples:
          type: array
          items:
            $ref: '#/components/schemas/type_:VoiceSample'
          description: List of samples associated with the voice.
        category:
          $ref: '#/components/schemas/type_:VoiceResponseModelCategory'
          description: The category of the voice.
        fine_tuning:
          $ref: '#/components/schemas/type_:FineTuningResponse'
          description: Fine-tuning information for the voice.
        labels:
          type: object
          additionalProperties:
            type: string
          description: Labels associated with the voice.
        description:
          type: string
          description: The description of the voice.
        preview_url:
          type: string
          description: The preview URL of the voice.
        available_for_tiers:
          type: array
          items:
            type: string
          description: The tiers the voice is available for.
        settings:
          $ref: '#/components/schemas/type_:VoiceSettings'
          description: The settings of the voice.
        sharing:
          $ref: '#/components/schemas/type_:VoiceSharingResponse'
          description: The sharing information of the voice.
        high_quality_base_model_ids:
          type: array
          items:
            type: string
          description: The base model IDs for high-quality voices.
        verified_languages:
          type: array
          items:
            $ref: '#/components/schemas/type_:VerifiedVoiceLanguageResponseModel'
          description: The verified languages of the voice.
        collection_ids:
          type: array
          items:
            type: string
          description: The IDs of collections this voice belongs to.
        safety_control:
          $ref: '#/components/schemas/type_:VoiceResponseModelSafetyControl'
          description: The safety controls of the voice.
        voice_verification:
          $ref: '#/components/schemas/type_:VoiceVerificationResponse'
          description: The voice verification of the voice.
        permission_on_resource:
          type: string
          description: The permission on the resource of the voice.
        is_owner:
          type: boolean
          description: Whether the voice is owned by the user.
        is_legacy:
          type: boolean
          default: false
          description: Whether the voice is legacy.
        is_mixed:
          type: boolean
          default: false
          description: Whether the voice is mixed.
        favorited_at_unix:
          type: integer
          description: Timestamp when the voice was marked as favorite in Unix time.
        created_at_unix:
          type: integer
          description: The creation time of the voice in Unix time.
      required:
        - voice_id
    type_:GetVoicesV2Response:
      type: object
      properties:
        voices:
          type: array
          items:
            $ref: '#/components/schemas/type_:Voice'
          description: The list of voices matching the query.
        has_more:
          type: boolean
          description: >-
            Indicates whether there are more voices available in subsequent
            pages. Use this flag (and next_page_token) for reliable pagination
            instead of relying on total_count.
        total_count:
          type: integer
          description: >-
            The total count of voices matching the query. This value is a live
            snapshot that reflects the current state of the database and may
            change between requests as users create, modify, or delete voices.
            For reliable pagination, use the has_more flag instead of relying on
            this value. Only request this field when you actually need the total
            count (e.g., for display purposes), as calculating it incurs a
            performance cost.
        next_page_token:
          type: string
          description: >-
            Token to retrieve the next page of results. Pass this value to the
            next request to continue pagination. Null if there are no more
            results.
      required:
        - voices
        - has_more
        - total_count

```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.voices.search({
        nextPageToken: "next_page_token",
        pageSize: 1,
        search: "search",
        sort: "sort",
        sortDirection: "sort_direction",
        voiceType: "voice_type",
        category: "category",
        fineTuningState: "fine_tuning_state",
        collectionId: "collection_id",
        includeTotalCount: true,
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

client.voices.search(
    next_page_token="next_page_token",
    page_size=1,
    search="search",
    sort="sort",
    sort_direction="sort_direction",
    voice_type="voice_type",
    category="category",
    fine_tuning_state="fine_tuning_state",
    collection_id="collection_id",
    include_total_count=True
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

	url := "https://api.elevenlabs.io/v2/voices?next_page_token=next_page_token&page_size=1&search=search&sort=sort&sort_direction=sort_direction&voice_type=voice_type&category=category&fine_tuning_state=fine_tuning_state&collection_id=collection_id&include_total_count=true"

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

url = URI("https://api.elevenlabs.io/v2/voices?next_page_token=next_page_token&page_size=1&search=search&sort=sort&sort_direction=sort_direction&voice_type=voice_type&category=category&fine_tuning_state=fine_tuning_state&collection_id=collection_id&include_total_count=true")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v2/voices?next_page_token=next_page_token&page_size=1&search=search&sort=sort&sort_direction=sort_direction&voice_type=voice_type&category=category&fine_tuning_state=fine_tuning_state&collection_id=collection_id&include_total_count=true")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v2/voices?next_page_token=next_page_token&page_size=1&search=search&sort=sort&sort_direction=sort_direction&voice_type=voice_type&category=category&fine_tuning_state=fine_tuning_state&collection_id=collection_id&include_total_count=true');

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v2/voices?next_page_token=next_page_token&page_size=1&search=search&sort=sort&sort_direction=sort_direction&voice_type=voice_type&category=category&fine_tuning_state=fine_tuning_state&collection_id=collection_id&include_total_count=true");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v2/voices?next_page_token=next_page_token&page_size=1&search=search&sort=sort&sort_direction=sort_direction&voice_type=voice_type&category=category&fine_tuning_state=fine_tuning_state&collection_id=collection_id&include_total_count=true")! as URL,
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