#!/bin/bash
aws cloudformation deploy \
  --stack-name shared-artifacts-stack \
  --template-file infra/templates/shared-artifacts-stack.yaml \
  --parameter-overrides file://infra/parameters/cicd-params.json \
  --capabilities CAPABILITY_NAMED_IAM \
  --profile shared-services
