import React from "react";

interface TextSubmitProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  status: string;
  isLoading: boolean;
}

export const TextSubmit: React.FC<TextSubmitProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
  status,
  isLoading,
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">2. Submit Notes</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full p-2 border rounded mb-3 text-gray-600 border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <textarea
        placeholder="Paste or type your notes here..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="w-full p-3 border rounded mb-3 h-32 text-gray-600 border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !title || !content}
        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors"
      >
        Submit Notes
      </button>
      <p className="text-sm text-gray-600 mt-3">
        <i>Status: {status}</i>
      </p>
    </section>
  );
};
