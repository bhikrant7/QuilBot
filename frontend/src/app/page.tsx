
"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ChatMessage, UploadResponse, ChatResponse, AppConfig } from '../types/api';

// Import the new components
import { FileUpload } from './components/FileUpload';
import { TextSubmit } from './components/TextSubmit';
import { ChatWindow } from './components/ChatWindow';
import { ConfigPanel } from './components/ConfigPanel';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function Home() {
  // State for file upload - NOW File[] instead of FileList | null
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Changed to array
  const [uploadStatus, setUploadStatus] = useState<string>('Please select up to 5 PDFs to begin.');

  // State for text submission
  const [textTitle, setTextTitle] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [textStatus, setTextStatus] = useState<string>('');

  // State for chat
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State for configuration
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [configStatus, setConfigStatus] = useState<string>('');

  // --- Fetch Config on Load ---
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/config`);
        if (!response.ok) throw new Error('Failed to fetch config');
        const data = await response.json() as AppConfig;
        setConfig(data);
        setConfigStatus('Config loaded successfully.');
      } catch (error) {
        console.error('Failed to fetch config:', error);
        setConfigStatus('Failed to load config.');
      }
    };
    fetchConfig();
  }, []);

  // --- Handlers ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const totalFiles = selectedFiles.length + newFiles.length;

      if (totalFiles > 5) {
        setUploadStatus(`You can only upload a maximum of 5 PDFs. You tried to add ${totalFiles - selectedFiles.length} more.`);
        event.target.value = ''; // Clear the file input
        return;
      }
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      setUploadStatus(`Selected ${totalFiles} file(s).`);
      event.target.value = ''; // Clear the input field after selection
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prevFiles => {
      const updatedFiles = prevFiles.filter((_, index) => index !== indexToRemove);
      setUploadStatus(`Selected ${updatedFiles.length} file(s).`);
      return updatedFiles;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('No files selected!');
      return;
    }
    setUploadStatus('Uploading and processing...');
    setIsLoading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file)); // Use the File[] state

    try {
      const response = await fetch(`${BACKEND_URL}/upload_and_process`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }
      const result = await response.json() as UploadResponse;
      setUploadStatus(result.message);
      setSelectedFiles([]); // Clear selected files after successful upload
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textTitle.trim() || !textContent.trim()) {
      setTextStatus('Both title and content are required.');
      return;
    }
    setTextStatus('Submitting text...');
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/submit_text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: textTitle, content: textContent }),
      });
       if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Text submission failed');
      }
      const result = await response.json() as UploadResponse;
      setTextStatus(result.message);
      setTextTitle('');
      setTextContent('');
    } catch (error) {
      console.error('Error submitting text:', error);
      setTextStatus(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim() || isLoading) return;

    const newChatMessage: ChatMessage = { sender: 'user', text: question };
    const updatedChatHistory = [...chatHistory, newChatMessage];
    setChatHistory(updatedChatHistory);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Chat request failed');
      }
      const result = await response.json() as ChatResponse;
      setChatHistory([...updatedChatHistory, { sender: 'ai', text: result.answer }]);
    } catch (error) {
      console.error('Error during chat:', error);
      setChatHistory([...updatedChatHistory, { sender: 'ai', text: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveConfig = async () => {
    if (!config) return;
    setConfigStatus('Saving...');
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to save config');
      const savedConfig = await response.json() as AppConfig;
      setConfig(savedConfig);
      setConfigStatus('Config saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      setConfigStatus('Failed to save config.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 font-sans">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-100">QuilBot</h1>
          <p className="text-gray-300 mt-2">A Private GPU-accelerated study partner.</p>
        </header>

        <FileUpload
          selectedFiles={selectedFiles} // Pass the File[] array
          uploadStatus={uploadStatus}
          isLoading={isLoading}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          onRemoveFile={handleRemoveFile} 
        />

        <TextSubmit
          title={textTitle}
          content={textContent}
          status={textStatus}
          isLoading={isLoading}
          onTitleChange={setTextTitle}
          onContentChange={setTextContent}
          onSubmit={handleTextSubmit}
        />

        <ChatWindow
          history={chatHistory}
          question={question}
          isLoading={isLoading}
          onQuestionChange={setQuestion}
          onSubmit={handleChatSubmit}
        />

        <ConfigPanel
          config={config}
          status={configStatus}
          onConfigChange={setConfig}
          onSave={handleSaveConfig}
        />
      </div>
    </main>
  );
}