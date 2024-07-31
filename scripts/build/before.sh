#!/bin/bash

rm -rf ./dist

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
cd $SCRIPT_DIR

if [[ "$1" == "--watch" ]]; then
  node ../create-tsconfig.js --dev
else
  node ../create-tsconfig.js
fi
