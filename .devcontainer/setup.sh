#!/bin/bash
set -e

# Get the current workspace directory
echo "Setting up development environment..."
echo "Current directory: $(pwd)"
echo "Current user: $(whoami)"

# Ensure node_modules and .pnpm-store directories exist
echo "Setting up directories..."
mkdir -p node_modules
mkdir -p .pnpm-store

echo "Setting up permissions..."
if command -v sudo >/dev/null 2>&1; then
	sudo chown -R node:node node_modules .pnpm-store || true
else
	chown -R node:node node_modules .pnpm-store || true
fi

echo "Updating npm..."
if command -v npm >/dev/null 2>&1; then
	npm install -g npm@latest
fi

if command -v pnpm >/dev/null 2>&1; then
  echo "Updating pnpm..."
	npm install -g pnpm@latest
else
  echo "Installing pnpm..."
  pnpm install -g pnpm@latest
fi

echo "Installing dependencies..."
pnpm install --frozen-lockfile || pnpm install

echo "Development environment setup complete!"