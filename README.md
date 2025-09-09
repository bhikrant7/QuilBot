# 🤖 AI Study Assistant

A private, powerful, and fully local AI-powered application to chat with your study documents. This project leverages a local GPU, Docker, and open-source models to create a personal RAG (Retrieval-Augmented Generation) pipeline, with no reliance on paid APIs.

## ✨ Key Features

* **Persistent Knowledge Base**: Upload multiple study documents (PDFs) or submit raw text notes. The assistant remembers everything across sessions, building a cumulative knowledge base powered by **ChromaDB**.
* **Multi-Document Chat**: Ask questions and the AI will retrieve the most relevant information from across *all* the documents you've uploaded to provide comprehensive, context-aware answers.
* **Dynamic Configuration**: A web-based UI allows you to tweak the AI's parameters (like the LLM model used, its creativity, and RAG settings) in real-time.
* **100% Local & Private**: All models (LLM and embedding) and data are stored and processed locally on your machine. Your documents are never sent to the cloud, and there are no API fees.
* **GPU Accelerated**: The entire AI pipeline is engineered to run on a local NVIDIA GPU via Docker, ensuring interactions are fast and responsive.
* **Professionally Architected**: Built with a modern, decoupled full-stack architecture (Next.js + FastAPI) and fully containerized with Docker and Docker Compose for portability and easy setup.

## 🛠️ Tech Stack

| Category         | Technologies                                                                                             |
| :--------------- | :----------------------------------------------------------------------------------------------------- |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS                                                               |
| **Backend** | Python, FastAPI, Uvicorn                                                                               |
| **AI / ML** | Ollama (for running local LLMs), ChromaDB (Vector Database), Sentence-Transformers (Embeddings)          |
| **DevOps & Infra** | Docker, Docker Compose, NVIDIA Container Toolkit                                                       |

## 🏛️ Architecture

The application uses a decoupled, multi-container architecture orchestrated by Docker Compose.

* **`frontend` Service:** A Next.js container that serves the user interface. For development, it uses the Next.js dev server with hot-reloading enabled by a Docker volume.
* **`backend` Service:** A FastAPI container running on a GPU-enabled NVIDIA CUDA base image. It exposes a REST API to handle all business logic.
* **Networking:** The two containers communicate over a private Docker network. The browser on the host machine interacts with the services via ports mapped by Docker Compose (`3000` for frontend, `8000` for backend).
* **Data Persistence:** The ChromaDB vector store is made persistent by mounting a local directory from the host machine into the backend container using a Docker volume.



## 🚀 Getting Started

Follow these steps to get the entire application running on your local machine.

### Prerequisites

* **Git:** To clone the repository.
* **NVIDIA GPU:** With the latest drivers installed.
* **WSL 2:** The Windows Subsystem for Linux must be installed and enabled.
* **Docker Desktop:** Installed and configured to use the WSL 2 backend.
* **NVIDIA Container Toolkit:** Must be installed for WSL 2 to allow Docker to access the GPU.
* **Node.js:** LTS version (e.g., 20.x) is recommended.
* **Ollama:** Must be installed and running on your host machine. You also need to have pulled your desired model (e.g., `ollama pull deepseek-coder:6.7b`).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Configure the Backend:**
    * Navigate into the `backend/src/ai_study_assistant/` directory.
    * You will find a file named `config.example.json`. Make a copy of it and rename the copy to `config.json`.
    * Open `config.json` and verify the settings, especially the `model` and `host` for your Ollama LLM. The default `host` (`http://host.docker.internal:11434`) should work correctly with Docker Desktop on Windows.

3.  **Launch the Application:**
    * Make sure Docker Desktop and your Ollama server are running.
    * From the **root directory** of the project (where `docker-compose.yml` is), run the following single command:
        ```bash
        docker compose up --build
        ```
    * This will build both the backend and frontend images and start the containers. The first build will take a long time. Subsequent launches will be much faster.

### Accessing the Application

* **Frontend UI:** Open your browser and navigate to **`http://localhost:3000`**
* **Backend API Docs:** The FastAPI documentation is available at **`http://localhost:8000/docs`**

## 📋 API Endpoints

| Method | Path                  | Description                                            |
| :----- | :-------------------- | :----------------------------------------------------- |
| `GET`  | `/config`             | Fetches the current AI configuration from `config.json`. |
| `POST` | `/config`             | Updates and saves the AI configuration.                |
| `POST` | `/upload_and_process` | Uploads up to 5 PDF files, extracts text, and indexes them. |
| `POST` | `/submit_text`        | Submits a title and raw text to be indexed.            |
| `POST` | `/chat`               | Asks a question to the RAG pipeline about the indexed documents. |
| `POST` | `/summarize`          | Generates a summary for a given block of text.         |

## 🔮 Future Enhancements

This project has a solid foundation that can be extended with many exciting features:

* **OCR for Scanned PDFs:** Integrate a library like `pytesseract` to handle image-based documents.
* **More Input Formats:** Add support for audio/video files by integrating Whisper transcription logic into an endpoint.
* **Advanced RAG:** Implement metadata filtering in ChromaDB queries (e.g., "only answer based on `document_A.pdf`").
* **CI/CD Pipeline:** Create a GitHub Actions workflow to automatically build and test the Docker images on every push.
* **Cloud Deployment:** Write a production-ready `docker-compose.yml` and deploy the application to a cloud server with GPU capabilities.

