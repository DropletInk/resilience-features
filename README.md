# Resilience Features
Backend resilience features including retry logic, exponential backoff, timeout handling, and rate limiting.

## Features
- Retry logic with exponential backoff
- Timeout handling
- Rate limiting

## Tech Stack
- Node.js
- TypeScript
- Exprees.js
- Redis

## Setup Instructions

### clone Repository
```bash
git clone https://github.com/DropletInk/resilience-features.git
cd resilience-features
```
## Install Dependencies
```bash
npm install
```
## Environment Variables
Create a `.env` file in the project root directory and includes details like:
```bash
PORT=5000
REDIS_PASS=YOUR_REDIS_PASSWORD
```

## Run Server
```bash
npm run dev
```
## Testing 
For testing run the below commands:
```bash
npm test
```

