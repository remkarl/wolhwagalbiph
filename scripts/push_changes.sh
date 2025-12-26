#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/push_changes.sh ["commit message"] [branch]
# Example: ./scripts/push_changes.sh "chore: add responsive image" main

MSG=${1:-"chore: make About image responsive; add resize script & CI workflows"}
BRANCH=${2:-main}

if [ -n "$(git status --porcelain)" ]; then
  echo "Staging changes..."
  git add -A
  echo "Committing with message: $MSG"
  git commit -m "$MSG"
  echo "Pushing to origin/$BRANCH..."
  git push origin "$BRANCH"
  echo "Pushed to origin/$BRANCH"
else
  echo "No changes to commit."
fi
