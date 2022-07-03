# Getting Started

## Local Development

[Install Redis](https://redis.io/docs/getting-started/installation/).

Start redis

```
redis-server
```

Copy `.env.example` to `.env.local`

```
cp .env.example .env.local
```

In `.env.local`,

- Enter private key of a public wallet instantiated by hardhat (check the console that ran `hardhat node`)
