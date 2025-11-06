'use client';

import { useState } from 'react';
import { Brain } from 'lucide-react';

interface AIAssistantProps {
  documentId: string;
}

export default function AIAssistant({ documentId }: AIAssistantProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          question,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('Error: Failed to get answer from AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-sm w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center h-10 w-10 bg-[rgb(97,0,165)]/10 rounded-full mr-3">
          <Brain className="h-5 w-5 text-[rgb(97,0,165)]" />
        </div>
        <h2 className="text-lg font-semibold text-[rgb(32,23,73)]">
          Ask AI About This Document
        </h2>
      </div>

      {/* Description */}
      <p className="text-sm text-[rgb(32,23,73)]/70 mb-5 leading-relaxed">
        Have a question or need insights from this document? Ask our AI to summarize, explain,
        or highlight key details for you.
      </p>

      {/* Form */}
      <form onSubmit={handleAsk} className="space-y-4">
        <div>
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-[rgb(97,0,165)] focus:border-[rgb(97,0,165)] outline-none text-[rgb(32,23,73)] placeholder:text-[rgb(32,23,73)]/40"
            placeholder="Ask something like “Summarize this section” or “What is the main idea?”"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 text-sm font-medium rounded-full text-white bg-[rgb(97,0,165)] hover:bg-[rgb(120,20,190)] transition-all shadow-sm disabled:opacity-60"
        >
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>

      {/* Answer */}
      {answer && (
        <div className="mt-5 p-4 bg-[rgb(97,0,165)]/5 border border-[rgb(97,0,165)]/20 rounded-xl">
          <h3 className="font-semibold text-[rgb(32,23,73)] mb-2 text-sm">
            AI’s Response:
          </h3>
          <p className="text-[rgb(32,23,73)]/80 text-sm leading-relaxed whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
