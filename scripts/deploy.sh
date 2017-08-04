#!/bin/bash
npm version $@
git push
git push --tags
npm publish
