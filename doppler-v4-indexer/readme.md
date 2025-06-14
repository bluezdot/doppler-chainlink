# Doppler V4 Indexer

## Sample `.env.local` file

```sh
RPC_BASE_SEPOLIA=https://base-sepolia.g.alchemy.com/v2/pzJndNB7vlHhdvQ2a41q7
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/default
```

## Running the project

Start the docker compose file in another terminal

```sh
docker-compose -f tools/docker-compose.yml up
```

Then start the project

`bun run dev`
