#!/bin/bash

set -eu

cd $(dirname $0)/..

# monkey patch to remove node-fetch from code-base.
# The package causes node-built-in import, or reference 'global', ...
# and I couldn't find way to fix them without monkey patch.
# (I tried some rollup-plugins for node)

file="node_modules/@octokit/request/dist-web/index.js"
before=$(cat $file)
sed -i 's|^import nodeFetch|//import nodeFetch|' $file
sed -i 's|^\s*const fetch|//const fetch|' $file

# display changed lines
echo "$before" | diff - $file
