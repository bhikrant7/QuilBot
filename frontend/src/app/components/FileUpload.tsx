import React, { ChangeEvent } from "react";

// The props interface is updated to handle an array of Files and a remove function
interface FileUploadProps {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  uploadStatus: string;
  selectedFiles: File[]; // Changed from FileList | null to File[]
  isLoading: boolean;
  onRemoveFile: (indexToRemove: number) => void; // New prop for removing a file
}

// Inline SVG component for the 'X' icon to avoid new packages
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-x-circle-fill"
    viewBox="0 0 16 16"
  >
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
  </svg>
);

// Inline SVG component for the PDF icon
const PdfIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-file-earmark-pdf-fill"
    viewBox="0 0 16 16"
  >
    <path d="M5.523 12.424q.21-.164.455-.32a.74.74 0 0 1 .424-.145c.222 0 .42.08.58.242.16.16.24.383.24.643 0 .26-.08.48-.24.638a.74.74 0 0 1-.58.24c-.225 0-.43-.08-.605-.244a1.07 1.07 0 0 1-.44-.638c0-.29.07-.52.21-.688zm2.418-2.71c.14-.14.28-.21.455-.21.16 0 .305.07.435.21.13.14.195.315.195.525 0 .21-.065.385-.195.515a.7.7 0 0 1-.435.19c-.17 0-.315-.06-.455-.19a.7.7 0 0 1-.19-.515c0-.21.06-.385.19-.525zM8.293 4.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5z" />
    <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.465.208.123.457.185.748.185.32 0 .58-.068.75-.205.17-.137.255-.336.255-.59v-.16c0-.285-.054-.51-.16-.675-.106-.165-.25-.295-.425-.385a1.5 1.5 0 0 0-.665-.14c-.35 0-.645.09-.88.27-.235.18-.35.45-.35.815a1.3 1.3 0 0 0 .19.705zm2.845-3.137c.075.05.16.088.255.123a.7.7 0 0 1 .25.038c.115 0 .22-.023.315-.07a.49.49 0 0 1 .18-.18c.07-.08.125-.19.165-.335a.6.6 0 0 1 .06-.375c0-.2-.05-.355-.15-.46a.55.55 0 0 0-.415-.165c-.135 0-.255.03-.355.09a.5.5 0 0 0-.215.225.64.64 0 0 0-.08.31c0 .155.03.285.09.385z" />
  </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  onUpload,
  uploadStatus,
  selectedFiles,
  isLoading,
  onRemoveFile,
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        1. Upload Documents (PDFs)
      </h2>

      <div className="flex items-center space-x-4 mb-4">
        <label className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 disabled:bg-gray-400 transition-colors cursor-pointer">
          Choose Files
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={onFileChange}
            className="hidden"
          />
        </label>
        <button
          onClick={onUpload}
          disabled={selectedFiles.length === 0 || isLoading}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          Upload & Process
        </button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Selected for Upload:
          </h3>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200 animate-fade-in"
              >
                <div className="flex items-center truncate">
                  <PdfIcon />
                  <span
                    className="ml-2 text-gray-800 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                  aria-label={`Remove ${file.name}`}
                  disabled={isLoading}
                >
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-gray-600 mt-3">
        <i>Status: {uploadStatus}</i>
      </p>
    </section>
  );
};
