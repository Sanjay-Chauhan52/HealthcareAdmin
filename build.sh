#!/bin/bash
set -e

# Build frontend
cd /app/frontend
npm ci || npm install
npm run build

# Install backend dependencies
cd /app/backend
npm ci || npm install
