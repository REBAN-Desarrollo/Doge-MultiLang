# Zero Retention Mode (Enterprise)

## Overview
ElevenLabs provides "Zero Retention Mode" for enterprise customers handling sensitive data. When enabled, the system immediately deletes most request and response data upon completion rather than retaining it for service enhancement and troubleshooting.

## Data Protection Scope
The feature restricts logging of:
- Text and audio inputs/outputs for Text-to-Speech and Voice Changer services
- Speech-to-Text audio and text conversions
- All inputs and outputs for ElevenLabs Agents
- Account email addresses in logs

"This data is related to the processing of the request, and can only be seen by the user" and exists only in volatile memory.

## Eligibility & Access
Enterprise customers in healthcare, banking, and other sensitive sectors qualify for this feature. Access may be restricted for high-risk use cases or flagged accounts at ElevenLabs' discretion.

## Technical Implementation
Zero Retention Mode applies exclusively to API requests for:
- Text-to-Speech (endpoints under `/v1/text-to-speech/`)
- Voice Changer (endpoints under `/v1/speech-to-speech/`)
- ElevenLabs Agents (with Gemini and Claude)

Users activate it by setting `enable_logging=false` in API calls.

## Tradeoff
"Troubleshooting and support for Zero Retention Mode is limited" since data cannot be accessed for diagnostic purposes.
