# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Install GCC for compiling C code
RUN apt-get update && apt-get install -y gcc make curl unzip

# Download Unity test framework from GitHub
RUN curl -L https://github.com/ThrowTheSwitch/Unity/archive/refs/heads/master.zip -o unity.zip && \
    apt-get install -y unzip && \
    unzip unity.zip && \
    mkdir -p /app/unity && \
    mv Unity-master/src/* /app/unity && \
    rm -rf Unity-master unity.zip

# Install Flask for the API
RUN pip install Flask

# Create a directory for our app
WORKDIR /app

COPY . /app

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=code_tester_server.py

# Run the Flask server
CMD ["flask", "run", "--host=0.0.0.0"]
