#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/create_pr.sh [branch] [title] [body]
# Example: ./scripts/create_pr.sh responsive/about-image "chore: make About image responsive" "Adds responsive About image + CI workflows"

BRANCH=${1:-responsive/about-image}
TITLE=${2:-"chore: make About image responsive; add resize script & CI workflows"}
BODY=${3:-"This PR adds responsive About image styles, a script to generate responsive image variants, and CI workflows to auto-generate images and deploy to GitHub Pages."}

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) not found. Install it to create PRs automatically: https://cli.github.com/"
  exit 1
fi

# Create a branch, push, and open a PR against main
if git show-ref --verify --quiet refs/heads/"$BRANCH"; then
  echo "Branch $BRANCH already exists locally; switching to it"
  git checkout "$BRANCH"
else
  echo "Creating and switching to branch $BRANCH"
  git checkout -b "$BRANCH"
fi

git push --set-upstream origin "$BRANCH"

echo "Opening PR via gh..."
gh pr create --title "$TITLE" --body "$BODY" --base main

echo "PR created (if not, follow instructions shown by gh)."