#!/bin/sh
touch app/js/config.js 

npm --quiet install && \
bower -q install && \
grunt --no-color build

mkdir -p dist
[ -e dist/index.html ] || cp buildfail.html dist/index.html
