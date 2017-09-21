# Terraform Demo (with AWS)

## Architecture
![Architecture Diagram](docs/architecture.dot.png)

## Git Hooks & Terraform
Terraform tracks the state of your (remote) infrastructure. Meanwhile, git tracks your current files, including a couple build files (e.g. [docs/architecture.dot.png](docs/architecture.dot.png)).

For convenience, I've put in some git hooks to update the build every time you commit. However, you would need to trigger `terraform apply` after rebuilding those files (to deploy them to S3).

You may want to deploy changes to terraform (to a dev or feature environment) before committing to git. In that case, just run `source hooks/pre-commit` to build the files locally, first.

## Installing nodejs dependencies
```
pushd inclucivics
npm install
```
