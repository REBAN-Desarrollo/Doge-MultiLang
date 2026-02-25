# Get user subscription

GET https://api.elevenlabs.io/v1/user/subscription

Gets extended information about the users subscription

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Get user subscription
  version: endpoint_user/subscription.get
paths:
  /v1/user/subscription:
    get:
      operationId: get
      summary: Get user subscription
      description: Gets extended information about the users subscription
      tags:
        - - subpackage_user
          - subpackage_user/subscription
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
                $ref: '#/components/schemas/type_:Subscription'
        '422':
          description: Validation Error
          content: {}
components:
  schemas:
    type_:ExtendedSubscriptionResponseModelCurrency:
      type: string
      enum:
        - value: usd
        - value: eur
        - value: inr
    type_:SubscriptionStatusType:
      type: string
      enum:
        - value: trialing
        - value: active
        - value: incomplete
        - value: past_due
        - value: free
        - value: free_disabled
    type_:BillingPeriod:
      type: string
      enum:
        - value: monthly_period
        - value: 3_month_period
        - value: 6_month_period
        - value: annual_period
    type_:CharacterRefreshPeriod:
      type: string
      enum:
        - value: monthly_period
        - value: 3_month_period
        - value: 6_month_period
        - value: annual_period
    type_:DiscountResponseModel:
      type: object
      properties:
        discount_percent_off:
          type: number
          format: double
          description: The discount applied to the invoice. E.g. [20.0f] for 20% off.
        discount_amount_off:
          type: number
          format: double
          description: The discount applied to the invoice. E.g. [20.0f] for 20 cents off.
    type_:InvoiceResponseModelPaymentIntentStatus:
      type: string
      enum:
        - value: canceled
        - value: processing
        - value: requires_action
        - value: requires_capture
        - value: requires_confirmation
        - value: requires_payment_method
        - value: succeeded
    type_:InvoiceResponseModelPaymentIntentStatussesItem:
      type: string
      enum:
        - value: canceled
        - value: processing
        - value: requires_action
        - value: requires_capture
        - value: requires_confirmation
        - value: requires_payment_method
        - value: succeeded
    type_:InvoiceResponse:
      type: object
      properties:
        amount_due_cents:
          type: integer
          description: The amount due in cents.
        subtotal_cents:
          type: integer
          description: >-
            The subtotal amount in cents before tax (exclusive of tax and
            discounts).
        tax_cents:
          type: integer
          description: The tax amount in cents.
        discount_percent_off:
          type: number
          format: double
          description: >-
            Deprecated. Use [discounts] instead. The discount applied to the
            invoice. E.g. [20.0f] for 20% off.
        discount_amount_off:
          type: number
          format: double
          description: >-
            Deprecated. Use [discounts] instead. The discount applied to the
            invoice. E.g. [20.0f] for 20 cents off.
        discounts:
          type: array
          items:
            $ref: '#/components/schemas/type_:DiscountResponseModel'
          description: The discounts applied to the invoice.
        next_payment_attempt_unix:
          type: integer
          description: >-
            The Unix timestamp of the next payment attempt. -1 when there is no
            next payment attempt.
        payment_intent_status:
          $ref: '#/components/schemas/type_:InvoiceResponseModelPaymentIntentStatus'
          description: >-
            Deprecated. Use [payment_intent_statusses] instead. The status of
            this invoice's first payment intent. None when there is no payment
            intent.
        payment_intent_statusses:
          type: array
          items:
            $ref: >-
              #/components/schemas/type_:InvoiceResponseModelPaymentIntentStatussesItem
          description: >-
            The statuses of this invoice's payment intents. Empty list when
            there are no payment intents.
      required:
        - amount_due_cents
        - discounts
        - next_payment_attempt_unix
        - payment_intent_statusses
    type_:PendingSubscriptionSwitchResponseModelNextTier:
      type: string
      enum:
        - value: free
        - value: starter
        - value: creator
        - value: pro
        - value: growing_business
        - value: scale_2024_08_10
        - value: grant_tier_1_2025_07_23
        - value: grant_tier_2_2025_07_23
        - value: trial
        - value: enterprise
    type_:PendingSubscriptionSwitchResponseModel:
      type: object
      properties:
        kind:
          type: string
          enum:
            - type: stringLiteral
              value: change
        next_tier:
          $ref: >-
            #/components/schemas/type_:PendingSubscriptionSwitchResponseModelNextTier
          description: The tier to change to.
        next_billing_period:
          $ref: '#/components/schemas/type_:BillingPeriod'
          description: The billing period to change to.
        timestamp_seconds:
          type: integer
          description: The timestamp of the change.
      required:
        - next_tier
        - next_billing_period
        - timestamp_seconds
    type_:PendingCancellationResponseModel:
      type: object
      properties:
        kind:
          type: string
          enum:
            - type: stringLiteral
              value: cancellation
        timestamp_seconds:
          type: integer
          description: The timestamp of the cancellation.
      required:
        - timestamp_seconds
    type_:ExtendedSubscriptionResponseModelPendingChange:
      oneOf:
        - $ref: '#/components/schemas/type_:PendingSubscriptionSwitchResponseModel'
        - $ref: '#/components/schemas/type_:PendingCancellationResponseModel'
    type_:Subscription:
      type: object
      properties:
        tier:
          type: string
          description: The tier of the user's subscription.
        character_count:
          type: integer
          description: The number of characters used by the user.
        character_limit:
          type: integer
          description: >-
            The maximum number of characters allowed in the current billing
            period.
        max_character_limit_extension:
          type: integer
          description: >-
            Maximum number of characters that the character limit can be
            exceeded by. Managed by the workspace admin.
        can_extend_character_limit:
          type: boolean
          description: Whether the user can extend their character limit.
        allowed_to_extend_character_limit:
          type: boolean
          description: Whether the user is allowed to extend their character limit.
        next_character_count_reset_unix:
          type: integer
          description: The Unix timestamp of the next character count reset.
        voice_slots_used:
          type: integer
          description: The number of voice slots used by the user.
        professional_voice_slots_used:
          type: integer
          description: >-
            The number of professional voice slots used by the workspace/user if
            single seat.
        voice_limit:
          type: integer
          description: The maximum number of voice slots allowed for the user.
        max_voice_add_edits:
          type: integer
          description: The maximum number of voice add/edits allowed for the user.
        voice_add_edit_counter:
          type: integer
          description: The number of voice add/edits used by the user.
        professional_voice_limit:
          type: integer
          description: The maximum number of professional voices allowed for the user.
        can_extend_voice_limit:
          type: boolean
          description: Whether the user can extend their voice limit.
        can_use_instant_voice_cloning:
          type: boolean
          description: Whether the user can use instant voice cloning.
        can_use_professional_voice_cloning:
          type: boolean
          description: Whether the user can use professional voice cloning.
        currency:
          $ref: '#/components/schemas/type_:ExtendedSubscriptionResponseModelCurrency'
          description: The currency of the user's subscription.
        status:
          $ref: '#/components/schemas/type_:SubscriptionStatusType'
          description: The status of the user's subscription.
        billing_period:
          $ref: '#/components/schemas/type_:BillingPeriod'
          description: The billing period of the user's subscription.
        character_refresh_period:
          $ref: '#/components/schemas/type_:CharacterRefreshPeriod'
          description: The character refresh period of the user's subscription.
        next_invoice:
          $ref: '#/components/schemas/type_:InvoiceResponse'
          description: The next invoice for the user.
        open_invoices:
          type: array
          items:
            $ref: '#/components/schemas/type_:InvoiceResponse'
          description: The open invoices for the user.
        has_open_invoices:
          type: boolean
          description: Whether the user has open invoices.
        pending_change:
          $ref: >-
            #/components/schemas/type_:ExtendedSubscriptionResponseModelPendingChange
          description: The pending change for the user.
      required:
        - tier
        - character_count
        - character_limit
        - can_extend_character_limit
        - allowed_to_extend_character_limit
        - voice_slots_used
        - professional_voice_slots_used
        - voice_limit
        - voice_add_edit_counter
        - professional_voice_limit
        - can_extend_voice_limit
        - can_use_instant_voice_cloning
        - can_use_professional_voice_cloning
        - status
        - open_invoices
        - has_open_invoices
```

## SDK Code Examples

```typescript
import { ElevenLabsClient, ElevenLabsEnvironment } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: ElevenLabsEnvironment.Production,
    });
    await client.user.subscription.get();
}
main();
```

```python
from elevenlabs import ElevenLabs
from elevenlabs.environment import ElevenLabsEnvironment

client = ElevenLabs(
    environment=ElevenLabsEnvironment.PRODUCTION
)

client.user.subscription.get()
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

	url := "https://api.elevenlabs.io/v1/user/subscription"

	payload := strings.NewReader("{}")

	req, _ := http.NewRequest("GET", url, payload)

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

url = URI("https://api.elevenlabs.io/v1/user/subscription")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Content-Type"] = 'application/json'
request.body = "{}"

response = http.request(request)
puts response.read_body
```

```java
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;

HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/user/subscription")
  .header("Content-Type", "application/json")
  .body("{}")
  .asString();
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/user/subscription', [
  'body' => '{}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
using RestSharp;

var client = new RestClient("https://api.elevenlabs.io/v1/user/subscription");
var request = new RestRequest(Method.GET);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/user/subscription")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
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
