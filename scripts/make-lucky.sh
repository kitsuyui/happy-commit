#!/usr/bin/env bash
# Generate a commit with a lucky number
# Usage: Just execute this script
# ./misc/make-lucky.sh
set -eu

pattern=777

git commit --allow-empty -m 'lucky commit'
# retry commit until it contains the pattern
commit_hash=$(git rev-parse HEAD)
while [[ "$commit_hash" != *"$pattern"* ]];
do
  message="lucky commit (seed: $RANDOM)"
  git commit --allow-empty --amend -m "$message" &>/dev/null
  commit_hash=$(git rev-parse HEAD)
done
