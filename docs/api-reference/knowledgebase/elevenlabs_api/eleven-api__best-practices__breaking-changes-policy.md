# Breaking Changes Policy

ElevenLabs maintains specific guidelines to balance innovation with API stability. Here's what constitutes breaking versus non-breaking changes.

## Response and Schema Changes

Adding new fields to responses is permitted. The policy states: "Adding new fields to response models is not considered breaking." However, removing fields or altering their structure is breaking because applications may rely on their presence and format.

## Parameter Modifications

Required parameters added to existing endpoints trigger breaking changes, as they'll fail validation in current implementations. The guidelines note that "adding optional parameters...is not breaking since existing client calls can continue without modification." Conversely, altering parameter types, formats, or making optional parameters mandatory constitutes breaking changes.

## Endpoint and Path Changes

Completely removing endpoints triggers breaking changes since applications calling them will encounter errors. While endpoints may receive deprecation notices, full removal requires adequate notification to affected users beforehand.

## Changelog

All API modifications are documented weekly in ElevenLabs' changelog.
