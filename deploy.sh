#!/usr/bin/env sh

# Abort if any errors
set -e

npm run build
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:Kamaleen0/coursecalc.git master:gh-pages

cd -