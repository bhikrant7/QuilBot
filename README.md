🤖 AI Study Assistant
A private, powerful, and fully local AI-powered application to chat with your study documents. This project leverages a local GPU, Docker, and open-source models to create a personal RAG (Retrieval-Augmented Generation) pipeline, with no reliance on paid APIs.

✨ Key Features
Persistent Knowledge Base: Upload multiple study documents (PDFs) or paste in raw text notes. The assistant remembers everything across sessions using a persistent ChromaDB vector database.

Multi-Document Chat: Ask questions and the AI will retrieve the most relevant information from across all the documents you've uploaded to provide comprehensive, context-aware answers.

Dynamic Configuration: A web-based UI allows you to tweak the AI's parameters (like the LLM model used, its creativity, and RAG settings) in real-time.

100% Local & Private: All models (LLM and embedding) and data are stored and processed locally on your machine. Your documents are never sent to the cloud, and there are no API fees.

GPU Accelerated: The entire AI pipeline is engineered to run on a local NVIDIA GPU via Docker, ensuring interactions are fast and responsive.

Professionally Architected: Built with a modern, decoupled full-stack architecture (Next.js + FastAPI) and fully containerized with Docker and Docker Compose for portability and easy setup.

🛠️ Tech Stack
Category	Technologies
Frontend	Next.js, React, TypeScript, Tailwind CSS
Backend	Python, FastAPI, Uvicorn
AI / ML	Ollama (for running local LLMs like DeepSeek), ChromaDB (Vector Database), Sentence-Transformers (Embeddings)
DevOps & Infra	Docker, Docker Compose, NVIDIA Container Toolkit


🏛️ Architecture
The application uses a decoupled, multi-container architecture orchestrated by Docker Compose.

frontend Service: A Next.js container running a development server (for hot-reloading) or a production Node.js server. It is responsible for the entire user interface.

backend Service: A FastAPI container running on a GPU-enabled NVIDIA CUDA base image. It exposes a REST API to handle file processing, embedding, and chat logic.

Networking: The two containers communicate over a private Docker network. The browser on the host machine interacts with the services via ports mapped by Docker Compose (3000 for frontend, 8000 for backend).

Data Persistence: The ChromaDB vector store is made persistent by mounting a local directory from the host machine into the backend container using a Docker volume.
