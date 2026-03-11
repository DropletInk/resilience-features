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


### Use of Retry Handler
The library provides retry functionality built using the `p-retry` library.
It supports both basic retry configuration and advanced configuration.

**Import**
```ts
import { BasicRetryHandler, advancedRetryHandler } from "resilience-library";
```
**Basic Retry Handler**

The basic retry handler provides controlled configuration of retry features.

#### Example

```ts
import { basicRetryHandler } from "resilience-library";

await retryHandler({
  fn: async () => fetchData(),
  retries: 3,
  minTimeout: 1000, // initial delay in ms
  factor: 2,
});
```

In the above example,

- **`fn`:** This is a asynchronous function that you actually want to execute with the retry logic.

- **`retries`:**

This defines the maximum number of retry attempts allowed after the initial failure. If retry limit exceeded it throws an error.

`Default` value is `3`. The value of `retries` is also configurable.

- **`minTimeout`:**

This specifies the initial delay after the initial failure.

`Default` value is `1000` ms. The value of the `minTimeout` is configurable. The value of the `minTimeout` needs to be provided in milliseconds.

- **`factor`:**

This controls exponential backoff behavior. After each retry failed attempt it increases the delay time.

`Default` value is 2. The value of `factor` is also configurable.

**Advanced Retry Handler**

The advanced retry handler provide access to all the options provided by the `p-retry` library. User can configure based on their requirements.

#### Example
```ts
import { advancedRetryHandler } from "resilience-library";

await advancedRetryHandler({
  fn: async () => fetchData(),
  retries: 5,
  factor: 2,
  minTimeout: 500,
  maxTimeout: 5000,
  .
  .
  .
});

```


### Use of Timeout Handler

The library provides timeout handling functionality built using the `p-timeout` library.
It supports both basic timeout configuration and advanced configuration.

**Import**
```ts
import { basicTimeoutHandler, advancedTimeoutHandler } from "resilience-library";
```
**Basic Timeout Handler**

The basic timeout handler provides controlled configuration of retry features.

#### Example

```ts
import { basicTimeoutHandler } from "resilience-library";

await basicTimeoutHandler({
  fn: async () => fetchData(),
  time: 10000, //timeout time in ms
});
```

In the above example,

**`fn`:** This is a asynchronous function that you actually want to execute with the timeout handler.

**`time`:**

This specifies the maximum time the function is allowed to run before timing out.
If the function execution exceeds the specified time, the timeout handler rejects the operation with a timeout error.

`Default` value is `10000`ms. The value of `time` is also configurable. The value of time needs to be provided in milliseconds.

**Advanced Timeout Handler**
The advanced timeout handler provide access to all the options provided by the `p-timeout` library. User can configure based on their requirements.

#### Example

```ts
import { advancedTimeoutHandler } from "resilience-library";

await advancedTimeoutHandler({
  fn: async () => fetchData(),
  milliseconds:1000,
  message: "Operation Timed out"
  .
  .
  .
});
```


### Use of Rate Limiting Handler

The library provides a flexible rate limiting system built using **`rate-limiter-flexible`** library.

**Import**

```ts
import { RateLimiterFactory, rateLimitHandler } from "resilience-library";
```

#### Use of Basic Redis Rate Limiter

```ts
import { createRedisClient } from "resilience-library";
import { RateLimiterFactory, rateLimitHandler } from "resilience-library";

const client = createRedisClient({
  url: "redis://localhost:6379",
});

await client.connect();

const limiter = RateLimiterFactory.basicRedis({
  client,
  points: 5,
  duration: 60,
  keyPrefix: "Rate-limit",
  blockDuration: 0,
  execEvenly: false,
});

app.use(
  rateLimitHandler({
    rateLimiter: limiter,
    keyGenerator = (req) => {
      const ip = req.ip ?? "unknown-ip";
      const username =
        req.body?.email ||
        req.body?.username ||
        "unknown-user";
      const method = req.method ?? "unknown-method";
      const endpoint = req.path ?? "unknown-endpoints";
      return `${ip}:${username}:${method}:${endpoint}`;
    },
    enableHeaders: false,
  }),
);
```

In the above Example,

- **`client`:**

It refers to the Redis Client instance passed to the middleware. It allows the rate limiter to store request counts.

- **`points`:**

It specifies the maximum number of requests allowed from a client within the defined time duration.

`Default` value is `5`.

The value of points is configurable.

- **`duration`:**

It controls the time window for rate limiting. It defines how long the request limit remains active before resetting.

`Default` value is `60` secs.

The value of duration is configurable.

- **`keyPrefix`**

Prefix added to all Redis rate limit keys.

- **`blockDuration`**

Duration in seconds to block requests after limit exceeded.

`Default`: `0`

- **`keyGenerator`**

It is the function to generate custom key for rate limiting. User can configure based on their requirements.

`Default`: Uses IP, username, HTTP method and endpoint path if available.

- **`execEvenly`**

Spreads requests evenly across duration window.

`Default`: false

- **`enableHeaders`**

Adds rate limit headers in response:

1. RateLimit-Limit

2. RateLimit-Remaining

3. RateLimit-Reset

4. Retry-After

`Default`: false

#### Use of Advanced Redis Rate Limiting Handler

It Provides full access to all options supported by `RateLimiterRedis` in `rate-limiter-flexible` library.

```ts
const limiter = RateLimiterFactory.advancedRedis({
  storeClient: client,
  points: 10,
  duration: 60,
  blockDuration: 120,
  keyPrefix: "login-limit",
  .
  .
  .

});
```

#### Use of In-Memory Rate Limiting Handler

It is useful when redis is unavailable.

```ts
const limiter = RateLimiterFactory.inMemoryLimiter({
  points: 5,
  duration: 60,
});
```

#### Use of MongoDB Rate Limiting Handler

It Provides full access to all options supported by `mongoLimiter` in `rate-limiter-flexible` library.

we can use it like -

```ts
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient("mongodb://localhost:27017");

await mongoClient.connect();

const limiter = RateLimiterFactory.mongoLimiter({
  storeClient: mongoClient,
  dbName: "ratelimit",
  points: 5,
  duration: 60,
});
```

#### Using in the middleware

Once a limiter is created , we can use it using `rateLimitHandler`

**Example**

```ts
app.use(
  rateLimitHandler({
    rateLimiter: limiter,
  }),
);
```

> **NOTE:**

Before use of ratelimiting make sure that RedisClient is created and connected.
