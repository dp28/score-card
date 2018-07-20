#!/usr/bin/env bash

set -x

# Copy source modules to temporary deployment directory
mkdir deploy
rsync -a --exclude='.git' score-card-web-ui deploy/
rsync -a --exclude='.git' score-card-server deploy/

cd deploy/score-card-web-ui

# Copy in local dependencies to web-ui
rm -rf src/deployment-only
mkdir src/deployment-only
rsync -a --exclude='.git' ../../score-card-domain ./src/deployment-only/
echo "export * from './deployment-only/score-card-domain/src/index.mjs'" > src/score-card-domain.js

# Update web-ui config
echo '{ "websocketURL": "wss://card-scores.herokuapp.com" }' > src/config.json

# Build web-ui code for server
npm run build
mkdir -p ../score-card-server/src/deployment-only/web-ui
mv build/* ../score-card-server/src/deployment-only/web-ui

cd ../score-card-server

# Copy in local dependencies to server
rsync -a --exclude='.git' ../../score-card-domain ./src/deployment-only/
echo "export * from './deployment-only/score-card-domain/src/index.mjs'" > src/score-card-domain.mjs

# Release to heroku
heroku builds:create -a card-scores

# Remove temporary deployment directory
cd ../../
rm -rf deploy
