#!/bin/sh
# Copies the app's screenshots from a pinned leysdr release into src/assets/shots.
# The release assets and shots.json are the source of truth; commit the result.
# To update the site, change TAG and run `make shots`.
set -eu

TAG=shots-2026-10-05-2
REPO=reflexive-labs/leysdr
DIR=src/assets/shots

rm -rf "$DIR"
mkdir -p "$DIR"
gh release download "$TAG" --repo "$REPO" --dir "$DIR" --pattern '*.png' --pattern 'shots.json'
echo "$TAG" > "$DIR/TAG"
