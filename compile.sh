#!/usr/bin/env bash

# find src -type f -name *.ne -exec nearleyc {} -o {}.js \;

nearleyc ./src/parser/grammar.ne -o ./src/parser/grammar.js