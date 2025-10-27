#!/bin/bash
aws cloudformation deploy \
  --stack-name collectorcard-cicd-master \
  --template-file infra/templates/main-cicd-master.yaml \
  --parameter-overrides file://infra/parameters/cicd-params.json \
  --capabilities CAPABILITY_NAMED_IAM \
  --profile development
