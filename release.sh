#!/usr/bin/env bash

set -x

cd score-card-web-ui

# Copy in local dependencies
rm -rf src/deployment-only
mkdir src/deployment-only
rsync -r ../score-card-domain ./src/deployment-only/
cp src/score-card-domain.js src/score-card-domain.js.tmp
echo "export * from './deployment-only/score-card-domain/src/index.mjs'" > src/score-card-domain.js

# Build web-ui code for server
npm run build
mkdir ../score-card-server/web-ui
mv build/* ../score-card-server/web-ui

# Restore web-ui directory state
mv src/score-card-domain.js.tmp src/score-card-domain.js
rm -rf src/deployment-only
