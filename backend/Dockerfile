# # Stage 1: Base Image
# FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

# # Stage 2: System Dependencies
# RUN apt-get update && apt-get install -y \
#     python3.11 \
#     python3-pip \
#     ffmpeg \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # --- Dependency Caching Optimization ---

# # Stage 3: Install Python Dependencies
# # First, copy ONLY the requirements file.
# COPY requirements.txt .
# # Then, upgrade pip and install the packages.
# # This entire block will now only be re-run if requirements.txt changes.
# RUN pip3 install --upgrade pip setuptools wheel
# RUN pip3 install -r requirements.txt

# # --- Application Code ---

# # Stage 4: Copy Application Code
# # Now, copy the rest of the application code.
# # If only these files change, the slow dependency installation above will be skipped!
# COPY ./src /app/src
# COPY main.py .

# # Stage 5: Environment and Execution
# ENV PYTHONPATH=/app/src
# EXPOSE 8000
# CMD ["python3", "main.py"]

# --- Stage 1: Builder ---
FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04 AS builder

# Install Python 3.11 and pip
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Make sure pip installs to Python 3.11’s site-packages
RUN python3.11 -m pip install --upgrade pip setuptools wheel

# Copy and install dependencies
COPY core-requirements.txt .
RUN python3.11 -m pip install -r core-requirements.txt
COPY app-requirements.txt .
RUN python3.11 -m pip install -r app-requirements.txt

# Debug: list installed packages and Python search path
RUN python3.11 -m pip list
RUN python3.11 -c "import sys; print('PYTHONPATH:', sys.path)"


# --- Stage 2: Final Image ---
FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

# Runtime dependencies only
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything Python-related from builder (packages + binaries)
COPY --from=builder /usr/local /usr/local

# Debug again inside final stage
RUN python3.11 -m pip list
RUN python3.11 -c "import sys; print('PYTHONPATH:', sys.path)"

# Copy your application code
COPY ./src /app/src
COPY main.py .

# Set env var so /app/src is importable
ENV PYTHONPATH=/app/src

EXPOSE 8000

# Run app with the correct interpreter
CMD ["python3.11", "main.py"]
