# Resilience Library

## Overview
This library contains backend resilience features including retry logic, exponential backoff, timeout handling, and rate limiting.

## Features
- Retry logic with exponential backoff
- Timeout handling
- Rate limiting

## Installation Process

### Step 1 — Generate GitHub Personal Access Token

1. Go to **GitHub - Settings - Developer Settings**
2. Click **Personal Access Tokens**
3. Generate a new token with the below permission:
   - `read:packages`
   - `repo`
4. Copy and save the token.

### Step 2 — Create .npmrc File
Create a .npmrc file in the project root with -
```bash 
@dropletink:registry=https://npm.pkg.github.com 

//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```
### Step 3 — Install the Library
```
npm install @dropletink/resilience-library
```
## Usage Examples

### Create and Connect redis client 
Redis is required only for rate limiting.

### Example
```ts
import { createRedisClient } from "@dropletink/resilience-library"; 

const client = createRedisClient({
url: "redis://localhost:6379"
});

await client.connect();
```
### Use of Retry Handler

#### Example
```ts
import { retryHandler } from "@dropletink/resilience-library";

await retryHandler({
fn: async () => fetchData(),
maxRetry: 3, 
iniDelay: 1000,
exBackoffMultiplier: 2
});
```
maxRetry, iniDelay and exBackoffMultiplier all are configurable.

### Use Timeout Handler

#### Example
```ts
import { timeoutHandler } from "@dropletink/resilience-library";

await timeoutHandler({
fn: async () => fetchData(),
time: 3000 //timeout time in ms
});
```

### Use Rate Limiting Handler

#### Example

```ts
import { rateLimitHandler } from "@dropletink/resilience-library";

app.use(
rateLimitHandler({
client,
maxRequests: 5,
durationInSec: 60
})
);
```
Before use of ratelimiting make sure that RedisClient is created and connected.

