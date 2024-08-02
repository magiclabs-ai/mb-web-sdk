#!/bin/bash

version=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' package.json)
publishCommand="pnpm publish --no-git-checks --access public --tag"
packages=("web-sdk")
baseDir=$PWD

if [[ "$1" == "--canary" ]]; then
    version=$version-canary
    publishCommand="$publishCommand canary"
else
    publishCommand="$publishCommand latest"
fi

for item in "${packages[@]}"; do
    echo "📦 - $item@$version"
    cd $baseDir/packages/$item/dist
    sed -i "s/\"version\": \".*\"/\"version\": \"$version\"/" package.json
    eval $publishCommand
done
