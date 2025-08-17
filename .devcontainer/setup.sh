#!/bin/bash
set -e

# Get the current workspace directory
echo "Setting up development environment..."
echo "Current directory: $(pwd)"
echo "Current user: $(whoami)"

# Install latest npm and pnpm
echo "Installing latest npm and pnpm..."
npm install -g npm@latest pnpm@latest

# Ensure node_modules and .pnpm-store directories exist
echo "Setting up directories..."
mkdir -p node_modules
mkdir -p .pnpm-store

# Give ownership of the entire workspace to the node user
echo "Setting up permissions..."
sudo chown -R node:node node_modules .pnpm-store

# Install dependencies as node user
echo "Installing dependencies..."
pnpm install

echo "Development environment setup complete!"
