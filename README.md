AI Study Assistant - Backend
Key Features
Persistent Knowledge Base: Upload multiple study documents (up to 5 PDFs at once) or submit large blocks of text. The assistant remembers everything across sessions, building a cumulative knowledge base powered by ChromaDB.

Multi-Document Context: Ask questions, and the AI will retrieve the most relevant information from across all the documents you've uploaded to provide comprehensive, context-aware answers.

External Configuration: Key parameters for the AI models (like model name, temperature, and RAG settings) are managed in a simple config.json file, allowing for easy tuning without changing the code.

Structured Logging: The application features a robust logging system to monitor its operations and diagnose issues effectively.

100% Local, Private, and Free: All models and data are stored and processed locally on your machine.

GPU Accelerated: Leverages a local NVIDIA GPU for high-speed AI processing.

How It Works: The Evolved Logic Flow
The system is designed to continuously learn from new documents provided by the user through two primary methods.

Document Ingestion:

Batch PDF Upload: A user can upload up to 5 PDF files at once to the POST /upload_and_process endpoint.

Direct Text Submission: A user can submit a title and a large block of text to the POST /submit_text endpoint.

Text Extraction & Indexing:

For PDFs, the parser.py module extracts the raw text.

The extracted text (or submitted text), along with a unique document name, is passed to the ChatManager in logic.py.

The text is chunked, converted into vector embeddings using sentence-transformers, and added to a persistent ChromaDB collection. The database grows with each upload and survives server restarts.

User Query & Cross-Document Retrieval: When a user asks a question at the /chat endpoint, the ChatManager searches the entire ChromaDB collection to find the most relevant chunks, regardless of which document they came from.

Augmented Generation: The retrieved context from potentially multiple source documents is combined with the user's question into a detailed prompt. This prompt is then sent to the local Ollama LLM (deepseek-coder:6.7b), which generates a final, context-aware answer, often citing the source of the information.

Architectural Breakdown
main.py: The application's main entrypoint, responsible for starting the uvicorn server.

config.json: A configuration file that defines parameters for the LLM, embedding model, and RAG process.

Dockerfile: The recipe for building the GPU-accelerated Docker container.

src/ai_study_assistant/: The main Python package.

api/: Handles all web-related concerns.

endpoints.py: Defines all API routes (/upload_and_process, /submit_text, /chat, etc.).

models.py: Defines the Pydantic data models for API requests and responses.

core/: The "brain" of the application.

logic.py: Contains the ChatManager class (managing the ChromaDB RAG pipeline) and summarization logic. It also loads the config.json.

processing/: Handles data ingestion and pre-processing.

parser.py: Contains functions for extracting text from PDF files.

