# src/ai_study_assistant/api/models.py
from pydantic import BaseModel

# --- Summarize Models ---
class SummarizeRequest(BaseModel):
    text: str
    detail: str = "a concise paragraph"

class SummarizeResponse(BaseModel):
    summary: str

# --- RAG Chat Models) ---
class LoadRequest(BaseModel):
    text: str

class LoadResponse(BaseModel):
    message: str
    chunks_loaded: int

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

class TextInput(BaseModel):
    title: str
    content: str

class Config(BaseModel):
    llm: dict
    embedding: dict
    rag: dict