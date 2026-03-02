# Resilience Library
 
## Overview
This library contains backend resilience features including retry logic, exponential backoff, timeout handling, and rate limiting.
 
## Features
- Retry logic with exponential backoff
- Timeout handling
- Rate limiting
 
## Installation Process
 

### Install the Library
 
```bash
npm install github:DropletInk/resilience-features
```
or,
```bash
npm install git+https://github.com/DropletInk/resilience-features.git
```
## Usage Examples
 
### Create and Connect redis client
Redis is required only for rate limiting.
 
#### Example
```ts
import { createRedisClient } from "resilience-library";
 
const client = createRedisClient({
url: "redis://localhost:6379"
});
 
await client.connect();
```
### Use of Retry Handler
 
#### Example
```ts
import { retryHandler } from "resilience-library";
 
await retryHandler({
fn: async () => fetchData(),
maxRetry: 3,
iniDelay: 1000, // initial delay in ms
exBackoffMultiplier: 2
});
```
 
In the above example,
 
**`fn`:** This is a asynchronous function that you actually want to execute with the retry logic.
 
**`maxRetry`:**
 
This defines the maximum number of retry attempts allowed after the initial failure. If retry limit exceeded it throws an error.
 
`Default` value is `3`. The value of maxRetry is also configurable.
 
**`iniDelay`:**
 
This specifies the initial delay after the initial failure.
 
`Default` value is `1000` ms. The value of the `iniDelay` is configurable. The value of the `iniDelay` needs to be provided in milliseconds.
 
 
**`exBackoffMultiplier`:**
 
This controls exponential backoff behavior. After each retry failed attempt it increases the delay time.
 
`Default` value is 2. The value of `exBackoffMultiplier` is also configurable.
 
 
 
 
### Use of Timeout Handler
 
#### Example
```ts
import { timeoutHandler } from "resilience-library";
 
await timeoutHandler({
fn: async () => fetchData(),
time: 10000 //timeout time in ms
});
```
In the above example,
 
**`fn`:** This is a asynchronous function that you actually want to execute with the timeout handler.
 
**`time`:**
 
This specifies the maximum time the function is allowed to run before timing out.
If the function execution exceeds the specified time, the timeout handler rejects the operation with a timeout error.
 
`Default` value is `10000`ms. The value of `time` is also configurable. The value of time needs to be provided in milliseconds.
 
 
### Use of Rate Limiting Handler
 
#### Example
 
```ts
import { rateLimitHandler } from "resilience-library";
 
app.use(
rateLimitHandler({
client,
maxRequests: 5,
durationInSec: 60,
keyPrefix: "api-limit"
})
);
```
In the above Example,

#### **Required**
 
- **`client`:**
 
It refers to the Redis Client instance passed to the middleware. It allows the rate limiter to store request counts.
 
- **`maxRequests`:**
 
It specifies the maximum number of requests allowed from a client within the defined time duration.
 
`Default` value is `5`.
 
The value of maxRequests is configurable.
 
- **`durationInSec`:**
 
It controls the time window for rate limiting. It defines how long the request limit remains active before resetting.
 
`Default` value is `60` secs.
 
The value of durationInSec is configurable.

- **`keyPrefix`**

Prefix added to all Redis rate limit keys.

#### **Optional**

- **`blockDurationInSec`**

Duration in seconds to block requests after limit exceeded.

`Default`: `0`

- **`keyGenerator`**

It is the function to generate custom key for rate limiting.

`Default`: Uses IP, username, HTTP method and endpoint path if available.

***Example***
```ts
keyGenerator = (req) => {
    const ip = req.ip ?? "unknown-ip";
    const username = (req as any).user?.username ?? "unknown-user";
    const method = req.method ?? "unknown-metod";
    const endpoint = req.path ?? "unknown-endpoints";
    return `${ip}:${username}:${method}:${endpoint}`;
  }
  ```
  - **`execEvenly`**

Spreads requests evenly across duration window.

`Default`: false

- **`InMemoryBlockOnCosumed`**

Enables temporary in-memory blocking when limit reached.

`Default`: equals to `maxRequests`.

- **`enableHeaders`**

Adds rate limit headers in response:

1. RateLimit-Limit

2. RateLimit-Remaining

3. RateLimit-Reset

4. Retry-After

`Default`: false

- **`enableInsuranceLimiter`**

Enables in-memory fallback limiter if Redis fails.


`Default`: false


> **NOTE:**
 
Before use of ratelimiting make sure that RedisClient is created and connected.