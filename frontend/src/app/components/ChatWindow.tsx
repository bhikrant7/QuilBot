import React, { FormEvent } from "react";
import { ChatMessage } from "../../types/api";

interface ChatWindowProps {
  history: ChatMessage[];
  question: string;
  onQuestionChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  history,
  question,
  onQuestionChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">3. Chat</h2>
      <div className="chat-window h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 mb-4 flex flex-col space-y-4">
        {history.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md p-3 rounded-2xl ${
                chat.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              <p style={{ whiteSpace: "pre-wrap" }}>{chat.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="justify-start flex">
            <div className="max-w-md p-3 rounded-2xl bg-gray-200 text-gray-800">
              <i>Thinking...</i>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className="flex space-x-4">
        <input
          type="text"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="Ask a question about your documents or notes..."
          disabled={isLoading}
          className="flex-grow p-3 border rounded-full  disabled:bg-gray-100 text-gray-600 border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </section>
  );
};
