# Stage 1: Install dependencies
# Use the official Node.js Alpine image for a small footprint.
FROM node:20-alpine AS deps
# # Set the working directory
# WORKDIR /app
# # Copy package.json and lock file to leverage Docker cache
# COPY package.json package-lock.json* ./
# # Install dependencies
# RUN npm install

# # Stage 2: Build the application
# # Use the same base image
# FROM node:20-alpine AS builder
# WORKDIR /app
# # Copy the installed dependencies from the 'deps' stage
# COPY --from=deps /app/node_modules ./node_modules
# # Copy the rest of your application source code
# COPY . .
# # Run the build command, which will compile TypeScript and create a production build
# RUN npm run build

# # Stage 3: Production runner
# # Start from a fresh, clean Node.js Alpine image
# FROM node:20-alpine AS runner
# WORKDIR /app

# # Set the environment to production for performance and security
# ENV NODE_ENV production

# # Copy the necessary output files from the 'builder' stage
# # This includes the standalone server, public assets, and static assets
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# # Next.js runs on port 3000 by default
# EXPOSE 3000
# # Set the PORT environment variable for compatibility
# ENV PORT 3000

# # The command to start the optimized Next.js server
# CMD ["npm", "run","dev"]

# Use the official Node.js Alpine image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and the lock file
COPY package.json package-lock.json* ./

# Expose the port Next.js runs on
EXPOSE 3000

# The command will be provided by Docker Compose
CMD ["npm", "run", "dev"]
