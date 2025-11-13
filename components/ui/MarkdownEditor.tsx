'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import MDEditor from '@uiw/react-md-editor';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const Editor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function MarkdownEditor() {
  const [value, setValue] = useState<string | undefined>('**Welcome to your Markdown Editor!**');

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mt-10">
      <h2 className="text-xl font-bold text-[rgb(32,23,73)] mb-4 text-center">
        ✍️ Markdown Editor
      </h2>

      <Editor value={value} onChange={setValue} height={500} />

      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-[rgb(97,0,165)] mb-2">Preview:</h3>
        <MarkdownPreview source={value || ''} />
      </div>
    </div>
  );
}
