#!/bin/sh
touch app/js/config.js

echo "var TRADITY_BUILD_STAMP = 'TDYC$(date +%s)-$(git rev-parse HEAD)';" > app/js/buildstamp.js && \
npm --quiet install && \
npm --quiet update && \
bower -q install && \
grunt --no-color build doc

mkdir -p dist
[ -e dist/index.html ] || cp buildfail.html dist/index.html
