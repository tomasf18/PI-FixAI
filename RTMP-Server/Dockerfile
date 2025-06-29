# Use Go base image
FROM golang:1.24

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum first (from project root)
COPY go.mod go.sum ./
RUN go mod download

# Copy Go code and HTML from the server/ directory
COPY src/ ./  

# Build the Go app
RUN go build -o server .

# Run the app
CMD ["./server"]
