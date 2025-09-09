
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
import json
from typing import List

# Corrected imports
from ai_study_assistant.api.models import (
    SummarizeRequest, SummarizeResponse,
    LoadResponse,
    ChatRequest, ChatResponse,
    TextInput,
    Config  
)
# Import the config object and its path from the logic module
from ai_study_assistant.core.logic import (
    summarize_with_llm,
    ChatManager,
    config as current_config, # Import the loaded config
    CONFIG_PATH # Import the path to the config file
)
from ai_study_assistant.processing.parser import extract_text_from_pdf


app = FastAPI(
    title="AI Study Assistant API",
    version="0.1.0"
)

# --- CORS Middleware ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Instances ---
chat_manager = ChatManager()

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Study Assistant API."}

# --- Config Endpoints ---
@app.get("/config", response_model=Config)
async def get_config():
    """Returns the current backend configuration."""
    return current_config

@app.post("/config", response_model=Config)
async def update_config(new_config: Config):
    """Updates and saves the backend configuration."""
    try:
        
        with open(CONFIG_PATH, "w") as f:
            json.dump(new_config.dict(), f, indent=2)
        
        
        current_config.update(new_config.dict())
        
        return current_config
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write config file: {e}")


@app.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    summary_text = summarize_with_llm(request.text, request.detail)
    return SummarizeResponse(summary=summary_text)

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    answer = chat_manager.query(request.question)
    return ChatResponse(answer=answer)

@app.post("/upload_and_process", response_model=LoadResponse)
async def upload_and_process(files: List[UploadFile] = File(...)):
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="You can upload a maximum of 5 PDFs at once.")
    
    total_chunks = 0
    processed_files = []
    for file in files:
        contents = await file.read()
        pdf_stream = io.BytesIO(contents)
        extracted_text = extract_text_from_pdf(pdf_stream)
        if not extracted_text:
            continue
        chunks_added = chat_manager.add_document(doc_name=file.filename, text=extracted_text)
        total_chunks += chunks_added
        processed_files.append(file.filename)
    
    return LoadResponse(
        message=f"Successfully processed and added {len(processed_files)} PDFs ({', '.join(processed_files)}) to the database.",
        chunks_loaded=total_chunks
    )

@app.post("/submit_text", response_model=LoadResponse)
async def submit_text(input: TextInput):
    if not input.content.strip():
        raise HTTPException(status_code=400, detail="Text input is empty.")
    
    chunks_added = chat_manager.add_document(doc_name=input.title, text=input.content)
    
    return LoadResponse(
        message=f"Successfully processed and added text '{input.title}' to the database.",
        chunks_loaded=chunks_added
    )