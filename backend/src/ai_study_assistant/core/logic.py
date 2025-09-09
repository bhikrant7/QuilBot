
import ollama
import chromadb
import logging
import json
from pathlib import Path
from sentence_transformers import SentenceTransformer

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", handlers=[logging.StreamHandler()])
logger = logging.getLogger(__name__)

# --- Config Loader ---
CONFIG_PATH = Path(__file__).resolve().parents[1] / "config.json"

def load_config():
    try:
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.warning(f"Could not load config.json, using defaults. Error: {e}")
        return {
            "llm": {"model": "deepseek-coder:6.7b", "host": "http://localhost:11434"},
            "embedding": {"model": "all-MiniLM-L6-v2"},
            "rag": {"top_k": 3}
        }

config = load_config()

# --- create a dedicated Ollama client with the correct host ---
ollama_client = ollama.Client(host=config["llm"]["host"])

# --- Summarization Logic ---
def summarize_with_llm(text_to_summarize: str, detail: str = "a concise paragraph"):
    system_prompt = config["llm"].get("system_prompt", "")
    model_name = config["llm"]["model"]
    prompt = f"""{system_prompt}\n\nPlease provide a summary of the following text in the format of {detail}.\nText:\n---\n{text_to_summarize}\n---"""
    
    logger.info("Generating summary...")
    # Use the dedicated client
    response = ollama_client.chat(
        model=model_name,
        messages=[{"role": "user", "content": prompt}],
        options={
            "temperature": config["llm"].get("temperature", 0.7),
            "num_predict": config["llm"].get("max_tokens", 512)
        }
    )
    logger.info("Summary generated.")
    return response["message"]["content"]

# --- RAG Chat Logic with ChromaDB ---
class ChatManager:
    def __init__(self, persist_dir="/app/chroma_db_storage"):
        emb_model = config["embedding"]["model"]
        logger.info(f"Loading SentenceTransformer model: {emb_model}")
        self.model = SentenceTransformer(emb_model)
        logger.info("Embedding model loaded.")
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.collection = self.client.get_or_create_collection(name="study_documents")
        logger.info(f"ChromaDB client initialized. Collection '{self.collection.name}' has {self.collection.count()} documents.")

    def add_document(self, doc_name: str, text: str):
        logger.info(f"Processing and adding {doc_name} to the collection...")
        chunks = [p.strip() for p in text.split("\n\n") if p.strip()]
        if not chunks:
            logger.warning(f"No text chunks found in {doc_name}.")
            return 0
        embeddings = self.model.encode(chunks).tolist()
        ids = [f"{doc_name}_{i}" for i in range(len(chunks))]
        metadata = [{"source": doc_name} for _ in range(len(chunks))]
        self.collection.add(ids=ids, embeddings=embeddings, documents=chunks, metadatas=metadata)
        logger.info(f"Added {len(chunks)} chunks from {doc_name}. Collection now has {self.collection.count()} documents.")
        return len(chunks)

    def query(self, question: str) -> str:
        if self.collection.count() == 0:
            logger.warning("Query attempted on empty database.")
            return "The document database is empty. Please upload a document first."

        logger.info(f"Querying with question: {question}")
        question_embedding = self.model.encode([question]).tolist()
        top_k = config["rag"].get("top_k", 3)
        results = self.collection.query(
            query_embeddings=question_embedding,
            n_results=top_k
        )
        retrieved_docs = results["documents"][0]
        retrieved_metadatas = results["metadatas"][0]
        context = "\n\n".join(f"Source: {meta['source']}\nContent: {doc}" for doc, meta in zip(retrieved_docs, retrieved_metadatas))
        
        system_prompt = config["llm"].get("system_prompt", "")
        model_name = config["llm"]["model"]
        prompt = f"""{system_prompt}\n\nBased *only* on the following context..., please answer the user's question...\n\nContext:\n---\n{context}\n---\n\nUser's Question: {question}"""

        logger.info("Generating RAG response...")
        # Use the dedicated client
        response = ollama_client.chat(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            options={
                "temperature": config["llm"].get("temperature", 0.7),
                "num_predict": config["llm"].get("max_tokens", 512)
            }
        )
        logger.info("RAG response generated.")
        return response["message"]["content"]