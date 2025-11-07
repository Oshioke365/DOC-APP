'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Upload, X } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import dynamic from 'next/dynamic';

const AIAssistant = dynamic(() => import('@/components/ui/AIAssistant'), {
  ssr: false,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SupabaseFile {
  name: string;
  created_at: string;
}

export default function Home() {
  const [files, setFiles] = useState<SupabaseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('uploads')
      .list('', { sortBy: { column: 'created_at', order: 'desc' } });

    if (error) console.error('Error fetching files:', error);
    else setFiles(data || []);
    setLoading(false);
  };

  const handleAskAI = (fileName: string) => {
    console.log('Ask AI clicked for file:', fileName);
    setSelectedFile((prev) => (prev === fileName ? null : fileName));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-3xl px-5 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[rgb(32,23,73)] mb-2">
            Document Hub 📂
          </h1>
          <p className="text-[rgb(32,23,73)]/70 text-sm leading-relaxed">
            Upload, view, download, and chat with your documents.
          </p>
        </header>

        <div className="mb-10 text-center">
          <button
            onClick={() => document.getElementById('hidden-upload')?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[rgb(97,0,165)] text-white rounded-full shadow hover:bg-[rgb(120,20,190)] transition-all"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </button>
          <FileUpload onUploadComplete={fetchFiles} />
        </div>

        <section>
          <h2 className="text-lg font-semibold text-[rgb(32,23,73)] mb-4">
            Your Uploaded Documents
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : files.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {files.map((file) => {
                const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${file.name}`;
                const documentId = file.name;

                return (
                  <div
                    key={file.name}
                    className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white flex flex-col"
                  >
                    <div>
                      <h3 className="font-semibold text-[rgb(32,23,73)] text-sm truncate">
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date(file.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-full hover:bg-blue-700"
                      >
                        View Document
                      </a>

                      <a
                        href={fileUrl}
                        download
                        className="w-full px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-full hover:bg-gray-800"
                      >
                        Download
                      </a>

                      <button
                        onClick={() => handleAskAI(documentId)}
                        className={`w-full px-3 py-2 text-sm font-medium text-center text-white rounded-full transition-all ${
                          selectedFile === documentId
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-[rgb(97,0,165)] hover:bg-[rgb(120,20,190)]'
                        }`}
                      >
                        {selectedFile === documentId ? 'Close AI' : 'Ask AI'}
                      </button>
                    </div>

                    {/* Inline AI Assistant */}
                    {selectedFile === documentId && (
                      <div className="mt-5 border-t border-gray-200 pt-5 animate-fadeIn">
                        <AIAssistant documentId={documentId} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
