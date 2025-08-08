# Base image with Node.js and Python
FROM node:20-slim

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Node dependencies and install
COPY package*.json ./
RUN npm install

# Copy Python dependencies and install
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose your Node.js port
EXPOSE 3000

# Start the Node.js server (which spawns Python as needed)
CMD ["node", "server.js"]

