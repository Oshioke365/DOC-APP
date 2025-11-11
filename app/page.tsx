'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import FileUpload from '@/components/ui/FileUpload';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';

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
  const [selectedFile, setSelectedFile] = useState<string | null>(null); // document currently opened in modal
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

  const openModal = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-6xl px-5 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl r font-extrabold text-[rgb(32,23,73)] mb-3">
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
            className="px-[20px] py-[20px] text-lg font-semibold text-white bg-[rgb(97,0,165)] rounded-full shadow-lg hover:bg-[rgb(120,20,190)] transition-all cursor-pointer"
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

                  return (
                    <div
                      key={file.name}
                      className="w-[260px] h-[260px] border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all bg-white flex flex-col justify-between"
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

                      {/* Action Buttons (all with white text) */}
                      <div className="mt-[10px] mb-[10px]  flex flex-col gap-[10px]">
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
                          onClick={() => openModal(documentId)}
                          className="w-full px-4 py-2 text-sm font-medium text-white bg-[rgb(97,0,165)] rounded-full hover:bg-[rgb(120,20,190)] transition-all pb-16 cursor-pointer"
                        >
                          Ask AI
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* AI Modal (centered) */}
        {selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeModal}
              aria-hidden
            />
            {/* modal card */}
            <div className="relative z-10 w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl animate-fadeIn">
              <button
                onClick={closeModal}
                aria-label="Close AI modal"
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
              >
                <X />
              </button>

              <AIAssistant documentId={selectedFile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
