# AWS Amplify Infrastructure

This folder provides infrastructure to publish the site to AWS Amplify Hosting.

## What is included

- `amplify-stack.yaml`: CloudFormation stack to create:
  - `AWS::Amplify::App`
  - `AWS::Amplify::Branch` (production branch)
- `deploy.sh`: Script that deploys the CloudFormation stack

## Prerequisites

1. AWS CLI v2 configured (`aws configure`)
2. GitHub repository containing this project
3. GitHub personal access token with repository access

## Deploy

From project root:

```bash
export AWS_REGION=us-east-1
export AMPLIFY_REPOSITORY_URL=https://github.com/<ORG>/<REPO>
export GITHUB_TOKEN=<your-github-pat>
export AMPLIFY_APP_NAME=gosnell-used-auto-parts
export AMPLIFY_BRANCH=main

./infrastructure/amplify/deploy.sh
```

## Notes

- The stack uses Amplify platform `WEB_COMPUTE` for modern Next.js hosting.
- Build settings are defined both in `amplify.yml` and stack `BuildSpec`.
- After deployment, review app settings in the Amplify console and add any required environment variables.
