# client/Dockerfile

# ---------------------------------------------------------------------------------
# STAGE 1: Install dependencies and build the application
# ---------------------------------------------------------------------------------

# Use bun runtime inside /app
FROM oven/bun:latest AS builder

ARG OPENAI_KEY
ARG OPENAI_ACTIVE

ENV OPENAI_KEY=$OPENAI_KEY
ENV OPENAI_ACTIVE=$OPENAI_ACTIVE

WORKDIR /app

# Copy bun files and install dependencies
COPY bun.lock package.json ./
RUN bun install

# Copy application code and build
COPY . .
RUN bun run build

# ---------------------------------------------------------------------------------
# STAGE 2: Run the application
# ---------------------------------------------------------------------------------

# Start bun runtime
FROM oven/bun:1.2.13
WORKDIR /app

# Copy build from builder
COPY --from=builder /app /app

# Define the port the app will run on
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["bun", "run", "preview"]