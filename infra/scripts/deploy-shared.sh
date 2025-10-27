aws cloudformation deploy \
  --stack-name collectorcard-cicd-master \
  --template-file ../templates/shared-artifacts-stack.yaml \
  --parameter-overrides \
    SharedAccountId=782496497250 \
    DevAccountId=068898927889 \
    Region=us-east-1 \
    RepoOwner=lija12-3 \
    RepoName=collectorcard \
    GitHubConnectionArn=arn:aws:codeconnections:us-east-1:068898927889:connection/faa51d75-0b97-44e4-8e5d-b226a9e446a4 \
    MainBranch=main \
    DevelopBranch=develop \
    FeatureBranch=feat/CDEV-134_codepipeline \
    SharedArtifactBucket=shared-artifacts-collectorcard-us-east-1 \
  --capabilities CAPABILITY_NAMED_IAM \
  --profile shared-services \
  --region us-east-1
