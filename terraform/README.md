# Inclucivics Terraform
This Terraform module provision the Infrastructure required by IncluCivics.

## Overview

Right now this is:

* A public S3 bucket to store processed data
* A lambda that fetches and processes data from data.nashville.gov every day, and writes it out to the S3 bucket.

The website itself is still hosted on Github Pages, and deployed using `yarn deploy` in the project root.

The code to run the import is stored in the `ingest` subdirectory.

## Testing

To test the Terraform configuration, open up your [AWS Lambda Console](https://console.aws.amazon.com/lambda). You should see the lambda "inclucivics_ingest" if you have access.  Click it.  Create a test event in the dropdown (the values are ignored) and click "Test" to run.
