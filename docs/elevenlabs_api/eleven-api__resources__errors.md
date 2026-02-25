# ElevenLabs API Errors

## Error Structure

ElevenLabs API errors return JSON with a `detail` object containing:

- **type**: Category of error (validation_error, authentication_error, etc.)
- **code**: Specific error identifier
- **message**: Detailed explanation
- **request_id**: Unique identifier for troubleshooting
- **param**: Which parameter caused the error (for validation errors)

## HTTP Status Codes

- **200**: Success
- **4xx**: Client error (invalid parameters, missing fields)
- **500**: Server error (rare)

## Error Types & Status Codes

The documentation lists 10 primary error types:

| Type | HTTP Status |
|------|------------|
| validation_error | 400 |
| authentication_error | 401 |
| authorization_error | 403 |
| not_found | 404 |
| rate_limit_error | 429 |
| internal_error | 500 |
| service_unavailable | 503 |

## SDK Error Handling

Both Python and TypeScript SDKs provide typed error classes. For example: "The request contains invalid parameter values" for validation errors, or implementing exponential backoff for rate limiting (429 status).

## Specific Error Codes

The page catalogs 80+ specific error codes across categories including:

- Resource not found (voice_not_found, project_not_found, etc.)
- Validation failures (text_too_long, invalid_parameters, etc.)
- Authentication issues (invalid_api_key, missing_api_key)
- Payment requirements (insufficient_credits)

For unresolved errors, users should contact support with the request_id and error details.
