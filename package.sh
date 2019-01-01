#!/bin/sh -x

PACKAGE=dl-to-folder.zip

rm -f "$PACKAGE" 

zip -r "$PACKAGE" \
    manifest.json \
    dl-to-folder.js \
    options.html \
    options.js \
    _locales/* \
    icons/*.svg
