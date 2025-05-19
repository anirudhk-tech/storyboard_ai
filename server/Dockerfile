# server/Dockerfile

# ---------------------------------------------------------------------------------
# STAGE 1: Install dependencies and build the application
# ---------------------------------------------------------------------------------

# Use the Bun image to build the application inside /app
FROM oven/bun:latest AS builder
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
FROM oven/bun:latest
WORKDIR /app

# Copy build from builder
COPY --from=builder /app /app

# Define the port the app will run on
ENV PORT=4000
EXPOSE 4000

# Start the application
CMD ["bun", "run", "start"]

