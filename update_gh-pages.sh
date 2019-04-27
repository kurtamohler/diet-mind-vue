#!/bin/bash

# exist if any command fails
set -e

git checkout gh-pages
git pull origin master

sed -i 's/^\/dist$/#\/dist/g' .gitignore

npm run build

git add dist && git commit -m "update dist subtree"
git subtree push --prefix dist origin gh-pages

git checkout -- .gitignore

git checkout master
