"use effect"

import React, { useEffect } from 'react';
import { AppConfig } from '../../types/api';

interface ConfigPanelProps {
  config: AppConfig | null;
  onConfigChange: (config: AppConfig) => void;
  onSave: () => void;
  status: string;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange, onSave, status }) => {
  useEffect(() => {
    
  }, [status]);

  if (!config) {
    return <div className="bg-white p-6 rounded-xl shadow-lg">Loading config...</div>;
  }

  const handleInputChange = (section: keyof AppConfig, key: string, value: string | number) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [key]: value,
      },
    });
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">4. AI Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium text-gray-600">LLM Model</label>
          <input
            type="text"
            value={config.llm.model}
            onChange={(e) => handleInputChange('llm', 'model', e.target.value)}
            className="w-full p-2 text-gray-600 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-600">Temperature (Creativity)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={config.llm.temperature}
            onChange={(e) => handleInputChange('llm', 'temperature', parseFloat(e.target.value))}
            className="w-full p-2 text-gray-600 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-600">Top K (RAG Chunks)</label>
          <input
            type="number"
            step="1"
            min="1"
            value={config.rag.top_k}
            onChange={(e) => handleInputChange('rag', 'top_k', parseInt(e.target.value, 10))}
            className="w-full p-2 text-gray-600 border rounded"
          />
        </div>
      </div>
      <button
        onClick={onSave}
        className="mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
      >
        Save Config
      </button>
      <p className="text-sm text-gray-600 mt-3"><i>Status: {status}</i></p>
    </section>
  );
};
