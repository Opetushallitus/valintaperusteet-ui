#!/usr/bin/env sh

npx eslint \
  --debug \
  --ignore-path .eslintignore \
  './src/main' \
  './src/test' \
  --ext 'js,jsx,ts,tsx'
