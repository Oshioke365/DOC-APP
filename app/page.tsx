'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import FileUpload from '@/components/ui/FileUpload';
import dynamic from 'next/dynamic';
import MarkdownEditor from '@/components/ui/MarkdownEditor';


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
  const [activeFile, setActiveFile] = useState<string | null>(null); // inline AI toggle
  const [showDocuments, setShowDocuments] = useState(false);

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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-6xl px-5 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[rgb(32,23,73)] mb-3">
            Document Hub 📂
          </h1>
          <p className="text-[rgb(32,23,73)]/70 text-base leading-relaxed">
            Upload, view, download, and chat with your documents.
          </p>
        </header>

        {/* Upload File Box */}
        <div className="flex justify-center mb-[30px]">
          <div className="w-60 h-60 border-2 border-dashed border-[rgb(97,0,165)] rounded-2xl flex items-center justify-center shadow-sm hover:shadow-lg transition-all bg-[rgb(97,0,165)]/5 p-[20px]">
            <FileUpload onUploadComplete={fetchFiles} />
          </div>
        </div>

        {/* View Documents Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className="px-[20px] py-[20px] text-lg font-semibold text-white bg-[rgb(97,0,165)] rounded-full shadow-lg hover:bg-[rgb(120,20,190)] hover:scale-105 transition-all cursor-pointer"
          >
            {showDocuments ? 'Hide Documents' : 'View Documents'}
          </button>
        </div>

        {/* Documents Section */}
        {showDocuments && (
          <section>
            <h2 className="text-xl font-semibold text-[rgb(32,23,73)] mb-6 text-center">
              Your Uploaded Documents
            </h2>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : files.length === 0 ? (
              <p className="text-center text-gray-500">No files uploaded yet.</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-[40px]">
                {files.map((file) => {
                  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${file.name}`;
                  const documentId = file.name;
                  const isActive = activeFile === documentId;

                  return (
                    <div
                      key={file.name}
                      className="w-[280px] border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all bg-white flex flex-col justify-between"
                    >
                      {/* File Info */}
                      <div>
                        <h3
                          className="font-semibold text-[rgb(32,23,73)] text-sm truncate mb-2"
                          title={file.name}
                        >
                          {file.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(file.created_at).toLocaleString()}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-[10px] flex flex-col gap-[10px]">
                        <button
                          onClick={() => window.open(fileUrl, '_blank')}
                          className="w-full px-4 py-2 text-sm font-medium text-white bg-[rgb(97,0,165)] rounded-full hover:bg-[rgb(120,20,190)] transition-all cursor-pointer"
                        >
                          View
                        </button>

                        <a
                          href={fileUrl}
                          download
                          className="w-full inline-block px-4 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-full hover:bg-gray-800 transition-all cursor-pointer"
                        >
                          Download
                        </a>

                        <button
                          onClick={() =>
                            setActiveFile(isActive ? null : documentId)
                          }
                          className={`w-full px-4 py-2 text-sm font-medium text-white rounded-full transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[rgb(120,20,190)]'
                              : 'bg-[rgb(97,0,165)] hover:bg-[rgb(120,20,190)]'
                          }`}
                        >
                          {isActive ? 'Close AI' : 'Ask AI'}
                        </button>
                      </div>

                      {/* Inline AI Assistant */}
                      {isActive && (
                        <div className="mt-5 border-t border-gray-200 pt-4 animate-fadeIn">
                          <div className="text-sm text-gray-800 overflow-y-auto max-h-[300px] bg-gray-50 rounded-xl p-3">
                            <AIAssistant documentId={documentId} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {/* Markdown Editor Section */}
<MarkdownEditor />

          </section>
        )}
      </div>
    </div>
  );
}
