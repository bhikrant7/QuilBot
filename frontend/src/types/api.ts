export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface UploadResponse {
  message: string;
  chunks_loaded: number;
}

export interface ChatResponse {
  answer: string;
}

// Config type
export interface AppConfig {
  llm: {
    model: string;
    temperature: number;
    max_tokens: number;
    system_prompt: string;
  };
  embedding: {
    model: string;
  };
  rag: {
    top_k: number;
  };
}
