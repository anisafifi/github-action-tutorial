# GitHub Actions Quick Reference — 2026

> **Docs:** [docs.github.com/en/actions](https://docs.github.com/en/actions) · [github.com/features/actions](https://github.com/features/actions)

---

## Table of Contents

1. [Workflow File Structure](#1-workflow-file-structure)
2. [Triggers](#2-triggers)
3. [Runners](#3-runners)
4. [Jobs & Job Control](#4-jobs--job-control)
5. [Steps](#5-steps)
6. [Contexts & Expressions](#6-contexts--expressions)
7. [Conditions](#7-conditions)
8. [Matrix Strategy](#8-matrix-strategy)
9. [Secrets & Environment Variables](#9-secrets--environment-variables)
10. [Caching](#10-caching)
11. [Artifacts](#11-artifacts)
12. [Reusable Workflows](#12-reusable-workflows)
13. [Workflow Commands](#13-workflow-commands)
14. [Permissions & OIDC Cloud Auth](#14-permissions--oidc-cloud-auth)
15. [Concurrency & Timeouts](#15-concurrency--timeouts)
16. [Container Jobs & Services](#16-container-jobs--services)
17. [Path & Branch Filters](#17-path--branch-filters)
18. [Popular Actions](#18-popular-actions)
19. [Expression Functions](#19-expression-functions)
20. [Pro Tips](#20-pro-tips)

---

## 1. Workflow File Structure

Workflows live at `.github/workflows/<name>.yml`.

```yaml
name: CI Pipeline

on:               # triggers (see §2)
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 8 * * 1'   # Every Monday at 8 AM UTC

env:              # global environment variables
  NODE_VERSION: '20'

jobs:
  build:          # job ID
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test
```

---

## 2. Triggers

```yaml
on:
  push:                   # push to branch or tag
  pull_request:           # PR opened or updated
  workflow_dispatch:      # manual trigger via UI or API
  workflow_call:          # called by another workflow
  schedule:               # cron schedule
  release:                # release published/created
  repository_dispatch:    # external HTTP event
  create:                 # branch or tag created
  delete:                 # branch or tag deleted
```

| Event                  | Description                        |
|------------------------|------------------------------------|
| `push`                 | On push to branch/tag              |
| `pull_request`         | PR opened or updated               |
| `workflow_dispatch`    | Manual trigger (UI/API)            |
| `workflow_call`        | Called by another workflow         |
| `schedule`             | Cron schedule                      |
| `release`              | Release published/created          |
| `repository_dispatch`  | External HTTP event                |
| `create` / `delete`    | Branch or tag created/deleted      |

---

## 3. Runners

| Label                      | OS                        |
|----------------------------|---------------------------|
| `ubuntu-latest`            | Ubuntu 22.04              |
| `ubuntu-22.04` / `20.04`   | Specific Ubuntu version   |
| `windows-latest`           | Windows Server 2022       |
| `macos-latest`             | macOS 14 (ARM)            |
| `macos-13`                 | macOS 13 (Intel)          |
| `self-hosted`              | Your own runner           |

---

## 4. Jobs & Job Control

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    outputs:                          # expose outputs to dependent jobs
      result: ${{ steps.s1.outputs.val }}

  deploy:
    needs: [test, lint]               # declare dependencies
    if: needs.test.result == 'success'
    environment: production           # requires manual approval
    concurrency:                      # prevent duplicate runs
      group: prod-deploy
      cancel-in-progress: false
```

**Key concepts:**
- `needs` — declares job dependencies; a job waits for its dependencies to complete.
- `outputs` — passes data between jobs via step outputs.
- `environment` — links a job to a named environment (supports protection rules/approvals).
- `concurrency` — prevents overlapping runs of the same job group.

---

## 5. Steps

Steps are the individual units of work within a job.

```yaml
steps:
  # Run a shell command
  - name: Install dependencies
    run: npm ci
    working-directory: ./app
    env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  # Use a pre-built action
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'

  # Capture output for later steps
  - id: meta
    run: echo "tag=${GITHUB_REF#refs/tags/}" >> $GITHUB_OUTPUT

  # Multi-line script
  - name: Build and test
    run: |
      echo "Building..."
      npm run build
      npm run test:ci
```

---

## 6. Contexts & Expressions

Use `${{ <expression> }}` syntax to access context values anywhere in a workflow.

```yaml
# GitHub context
${{ github.sha }}           # current commit SHA
${{ github.ref }}           # refs/heads/main
${{ github.actor }}         # user who triggered the run
${{ github.event_name }}    # push | pull_request | ...
${{ github.repository }}    # owner/repo

# Runner context
${{ runner.os }}            # Linux | Windows | macOS

# Variables & secrets
${{ env.MY_VAR }}           # environment variable
${{ secrets.API_KEY }}      # repository/org secret
${{ vars.MY_CONFIG }}       # configuration variable (non-secret)
${{ inputs.my_input }}      # workflow_dispatch input

# Job & step context
${{ job.status }}                        # success | failure | cancelled
${{ steps.STEP_ID.outputs.KEY }}         # output from a named step
```

---

## 7. Conditions

Use `if:` on jobs or steps to control execution. Expressions are implicitly wrapped in `${{ }}`.

```yaml
if: github.ref == 'refs/heads/main'
if: github.event_name == 'push'

# Status functions
if: success()      # default — previous steps/jobs succeeded
if: failure()      # run only if a previous step/job failed
if: always()       # always run, regardless of status
if: cancelled()    # run only if workflow was cancelled
if: '!cancelled()' # negation — run unless cancelled

# String functions in conditions
if: contains(github.ref, 'release')
if: startsWith(github.ref, 'refs/tags/')
```

---

## 8. Matrix Strategy

Run a job across multiple configurations in parallel.

```yaml
strategy:
  fail-fast: false    # keep other matrix jobs running if one fails
  max-parallel: 4
  matrix:
    os: [ubuntu-latest, macos-latest]
    node: ['18', '20', '22']
    exclude:
      - os: macos-latest
        node: '18'
    include:
      - os: windows-latest
        node: '20'
        extra: flag      # add extra variables to specific combinations

# Reference matrix values in steps
runs-on: ${{ matrix.os }}
node-version: ${{ matrix.node }}
```

---

## 9. Secrets & Environment Variables

```yaml
# Workflow-level env
env:
  DATABASE_URL: ${{ secrets.DB_URL }}
  APP_ENV: production

# Step-level env (overrides workflow-level)
- run: deploy.sh
  env:
    DEPLOY_KEY: ${{ secrets.PROD_KEY }}
```

### Special Built-in Variables

| Variable             | Description                              |
|----------------------|------------------------------------------|
| `GITHUB_TOKEN`       | Auto-provided token for the run          |
| `GITHUB_WORKSPACE`   | `/home/runner/work/…`                    |
| `GITHUB_SHA`         | Current commit SHA                       |
| `GITHUB_RUN_ID`      | Unique run number                        |

```bash
# Mask a value so it's redacted from logs
echo '::add-mask::mysecretvalue'
```

---

## 10. Caching

```yaml
# Cache npm dependencies
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# Docker layer caching via BuildKit
- uses: docker/setup-buildx-action@v3
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

**Cache key tips:**
- Use `hashFiles()` to bust the cache when lock files change.
- `restore-keys` provides fallback prefixes for partial cache hits.

---

## 11. Artifacts

Artifacts share files between jobs or persist build outputs.

```yaml
# Upload an artifact
- uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/
    retention-days: 7      # default is 90 days

# Download an artifact (same or different job)
- uses: actions/download-artifact@v4
  with:
    name: build-output
    path: ./downloaded/

# Merge multiple artifacts (v4+)
- uses: actions/upload-artifact/merge@v4
  with:
    name: all-artifacts
    pattern: test-results-*
```

---

## 12. Reusable Workflows

### Caller Workflow

```yaml
jobs:
  call-deploy:
    uses: org/repo/.github/workflows/deploy.yml@main
    with:
      environment: production
      version: ${{ needs.build.outputs.version }}
    secrets: inherit    # pass all secrets to the called workflow
```

### Reusable Workflow (`deploy.yml`)

```yaml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      DEPLOY_KEY:
        required: true
```

---

## 13. Workflow Commands

Workflow commands write to stdout using a special `::` syntax.

```bash
# Annotations (appear in PR checks / logs)
echo '::debug::Debug message'
echo '::notice::Informational note'
echo '::warning::Something looks off'
echo '::error file=app.js,line=10::Bad code here'

# Collapsible log group
echo '::group::Install dependencies'
npm ci
echo '::endgroup::'

# Pass data to subsequent steps
echo "MY_VAR=hello"  >> $GITHUB_ENV      # set env variable
echo "result=42"     >> $GITHUB_OUTPUT   # set step output

# Temporarily disable command processing (safe block)
echo '::stop-commands::MYTOKEN'
# ... untrusted content here ...
echo '::MYTOKEN::'   # re-enable
```

---

## 14. Permissions & OIDC Cloud Auth

### Permissions

Restrict the `GITHUB_TOKEN` to only the scopes your workflow needs.

```yaml
permissions:             # apply to all jobs (or set per-job)
  contents: read
  packages: write
  pull-requests: write
  id-token: write        # required for OIDC cloud auth
```

Available scopes: `actions`, `checks`, `contents`, `deployments`, `discussions`, `id-token`, `issues`, `packages`, `pages`, `pull-requests`, `repository-projects`, `security-events`, `statuses`

### OIDC Cloud Auth (No Long-Lived Secrets!)

```yaml
permissions:
  id-token: write
  contents: read

# AWS
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/deploy
    aws-region: us-east-1

# GCP
- uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/PROJECT/locations/global/workloadIdentityPools/...
    service_account: deploy@myproject.iam.gserviceaccount.com

# Azure
- uses: azure/login@v1
  with:
    client-id: ${{ vars.AZURE_CLIENT_ID }}
    tenant-id: ${{ vars.AZURE_TENANT_ID }}
    subscription-id: ${{ vars.AZURE_SUB_ID }}
```

---

## 15. Concurrency & Timeouts

```yaml
# Cancel older in-progress runs for the same branch
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Set timeouts (in minutes)
jobs:
  build:
    timeout-minutes: 15
    steps:
      - name: Long running step
        timeout-minutes: 5
        run: ./long-task.sh
```

---

## 16. Container Jobs & Services

Run a job inside a Docker container, with optional sidecar services.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: node:20-alpine
      credentials:
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    services:             # sidecar containers (e.g. databases)
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
```

---

## 17. Path & Branch Filters

Fine-tune when a workflow runs based on branches, tags, and file paths.

```yaml
on:
  push:
    branches:
      - main
      - 'release/**'        # glob pattern
      - '!release/legacy'   # exclude pattern
    branches-ignore:
      - 'dependabot/**'
    paths:
      - 'src/**'
      - '**.ts'
    paths-ignore:
      - '**.md'
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'   # semver tags only
```

---

## 18. Popular Actions

| Action                              | Purpose                        |
|-------------------------------------|--------------------------------|
| `actions/checkout@v4`               | Clone the repository           |
| `actions/setup-node@v4`             | Set up Node.js                 |
| `actions/setup-python@v5`           | Set up Python                  |
| `actions/setup-java@v4`             | Set up Java/JDK                |
| `actions/cache@v4`                  | Cache dependencies             |
| `actions/upload-artifact@v4`        | Upload build artifacts         |
| `actions/download-artifact@v4`      | Download artifacts             |
| `docker/build-push-action@v5`       | Build & push Docker image      |
| `github/codeql-action/analyze@v3`   | Code security scanning         |
| `softprops/action-gh-release@v1`    | Create a GitHub release        |
| `peaceiris/actions-gh-pages@v4`     | Deploy to GitHub Pages         |

---

## 19. Expression Functions

| Function                  | Description                              |
|---------------------------|------------------------------------------|
| `contains(str, substr)`   | Returns true if `str` contains `substr` |
| `startsWith(str, prefix)` | Returns true if `str` starts with prefix |
| `endsWith(str, suffix)`   | Returns true if `str` ends with suffix  |
| `format(str, ...)`        | String interpolation                     |
| `join(arr, sep)`          | Joins an array into a string             |
| `toJSON(value)`           | Converts a value to a JSON string        |
| `fromJSON(str)`           | Parses a JSON string                     |
| `hashFiles(pattern)`      | Hashes files matching the glob           |
| `success()`               | True if all previous steps succeeded     |
| `failure()`               | True if any previous step failed         |
| `always()`                | Always evaluates to true                 |
| `cancelled()`             | True if the workflow was cancelled       |

---

## 20. Pro Tips

**Pin actions to a full SHA** for supply-chain security instead of using mutable tags:
```yaml
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
```

**Composite actions** — bundle reusable step logic into `.github/actions/my-action/action.yml` using `using: composite`. Avoids duplicating multi-step patterns across workflows.

**Skip CI** — add `[skip ci]` or `[no ci]` to a commit message to prevent any workflow from running on that push.

**Debug logging** — set the repository secret `ACTIONS_STEP_DEBUG=true` to enable verbose step-level debug logs in a run.

**GitHub CLI is pre-installed** — `gh` is available on all GitHub-hosted runners. Authenticate with:
```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

*Last updated: 2026 · [GitHub Actions Documentation](https://docs.github.com/en/actions)*