#!/bin/bash
set -e

# Install and build frontend
cd frontend
npm install
npm run build

# Install backend dependencies
cd ../backend
npm install

# Copy frontend build to backend for serving (or your deployment setup)
cp -r ../frontend/dist ./public
