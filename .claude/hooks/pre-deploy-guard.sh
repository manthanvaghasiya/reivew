#!/usr/bin/env bash
echo "Running Pre-Deploy Checks..."

# Reminder checklist
echo "[ ] Are all environment variables present?"
echo "[ ] Are RLS policies enabled and correctly applied?"

# Check for console.logs in /app
if grep -rn "console.log" ./app; then
  echo "WARNING: console.log found in /app directory!"
  # exit 1 # uncomment to strictly enforce
fi

echo "Running build..."
if npm run build; then
  echo "Build passed! Ready for deploy."
  exit 0
else
  echo "Build failed! Aborting deploy."
  exit 1
fi
