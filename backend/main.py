import uvicorn

from ai_study_assistant.api.endpoints import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

