#!/bin/bash

[ ! -L  './dist' ] && rm -rf dist

pnpm run build 

echo "generating artifact to copy"

pnpm --filter=$1 deploy app/$1/artifact

echo "...copying artifact"

cp -R artifact/node_modules/ dist/node_modules/

echo "... cleaning up artifact"

rm -rf artifact