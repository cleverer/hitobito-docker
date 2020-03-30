#!/bin/sh

set -e

echo "⚙️ Waiting for hitobito to be ready!"
npx -q wait-on http://cypressserver:3000
echo "✅ Hitobito is ready!"

echo "➡️ Handing control over to 'cypress $*'"

exec cypress "$@"