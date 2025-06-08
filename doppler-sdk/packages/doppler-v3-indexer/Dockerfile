FROM imbios/bun-node:20-alpine

WORKDIR /app
COPY . .

RUN bun install
RUN bun codegen

EXPOSE 42069

ENTRYPOINT ["bun", "start"]
