# Use the official Playwright image with all browsers
FROM mcr.microsoft.com/playwright:v1.55.0-noble

WORKDIR /app

# Copy only package files first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy the rest of your project
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps



