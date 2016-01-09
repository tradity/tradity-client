#!/bin/sh
touch app/js/config.js

export PATH="node_modules/.bin:$PATH"

set -e
echo "var TRADITY_BUILD_STAMP = 'TDYC$(date +%s)-$(git rev-parse HEAD)';" > app/js/buildstamp.js
npm --quiet install
npm --quiet update
bower -q install
bower -q update

if [ x"$GRUNT_TRANSLATE_ONLY" = x"" ]; then
  grunt --no-color build doc || EXIT_CODE=$?

  EXIT_CODE=$?

  mkdir -p dist
  [ -e dist/index.html ] || cp buildfail.html dist/index.html
else
  echo "Translations-only grunt build"
  
  grunt --no-color translate-extract

  command -v msgmerge 2>/dev/null && [ -e po/templates.pot ] && (
    for langfile in po/*.po; do
      msgmerge --previous -U "$langfile" po/templates.pot
    done
  ) || EXIT_CODE=$?
fi

exit $EXIT_CODE
