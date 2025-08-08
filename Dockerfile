# Use an official Python base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files (Python, JS, HTML, etc.)
COPY . .

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install

# Expose port for the server (update if your server.js uses a different port)
EXPOSE 3000

# Command to run Node.js server
CMD ["node", "server.js"]
