#!/usr/bin/env bash
# One REST call that returns a finished song (waits up to 180 s server-side).
# Get a key at https://www.musicsforyou.com/developers — new keys include 3 free credits.
curl -s https://api.musicsforyou.com/v1/songs \
  -H "Authorization: Bearer $TAOYUAN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"A warm birthday song for my mum turning 60, she loves singing in the kitchen","waitSeconds":180}'
