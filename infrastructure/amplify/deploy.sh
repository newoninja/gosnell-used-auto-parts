#!/usr/bin/env bash
set -euo pipefail

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN to a GitHub PAT with repo access}"
: "${AMPLIFY_REPOSITORY_URL:?Set AMPLIFY_REPOSITORY_URL to your GitHub repo URL}"

STACK_NAME="${STACK_NAME:-gosnell-amplify}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AMPLIFY_APP_NAME="${AMPLIFY_APP_NAME:-gosnell-used-auto-parts}"
AMPLIFY_BRANCH="${AMPLIFY_BRANCH:-main}"

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name "$STACK_NAME" \
  --template-file infrastructure/amplify/amplify-stack.yaml \
  --parameter-overrides \
    AppName="$AMPLIFY_APP_NAME" \
    RepositoryUrl="$AMPLIFY_REPOSITORY_URL" \
    BranchName="$AMPLIFY_BRANCH" \
    GitHubAccessToken="$GITHUB_TOKEN"

echo
aws cloudformation describe-stacks \
  --region "$AWS_REGION" \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[].[OutputKey,OutputValue]' \
  --output table
