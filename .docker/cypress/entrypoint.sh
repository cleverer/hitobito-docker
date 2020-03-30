#!/bin/sh

set -e

echo "💤 Waiting for hitobito to be ready!"
npx -q wait-on "${CYPRESS_BASE_URL}"
echo "✅ Hitobito is ready!"

echo "➡️ Handing control over to 'cypress $*'"

exec cypress "$@"