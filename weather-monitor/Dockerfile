FROM python:3.11-slim

WORKDIR /app

# Copy public folder
COPY public/ /app/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:3000/')" || exit 1

# Start simple HTTP server on port 3000
CMD ["python", "-m", "http.server", "3000"]
