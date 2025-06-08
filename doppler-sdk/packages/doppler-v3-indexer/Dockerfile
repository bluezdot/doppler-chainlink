FROM oven/bun:1.2

WORKDIR /app
COPY . /app

RUN bun install
RUN bun codegen

EXPOSE 42069

ENTRYPOINT ["bun", "start"]
