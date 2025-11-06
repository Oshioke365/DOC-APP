'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import DocumentCard from '@/components/ui/DocumentCard';
import { Document } from '@/lib/db';

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((docs) => docs.filter((doc) => doc.id !== id));
  };

  // 🔹 Button click triggers the hidden file input
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center">
      <div className="w-full max-w-md px-5 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[rgb(32,23,73)] mb-2">
            Document Hub 📂
          </h1>
          <p className="text-[rgb(32,23,73)]/70 text-sm leading-relaxed">
            Upload, view, and collaborate on important documents — powered by AI
            insights.
          </p>
        </header>

        {/* Upload Section */}
        <div className="mb-10 p-4 rounded-xl border border-gray-100 shadow-sm bg-white text-center">
          <h2 className="text-lg font-semibold text-[rgb(32,23,73)] mb-3">
            Upload a Document
          </h2>
          <p className="text-sm text-[rgb(32,23,73)]/70 mb-4 px-3">
            Tap the button below to select a file from your phone or computer.
            Once uploaded, others can view, comment, and explore it using AI.
          </p>

          {/* 🔹 Upload Button that opens file picker */}
          <div className="flex justify-center">
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-[rgb(97,0,165)] text-white rounded-full shadow hover:bg-[rgb(120,20,190)] transition-all cursor-pointer text-sm font-medium"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload File
            </button>

            {/* Hidden input handled via FileUpload */}
            <FileUpload onUploadComplete={fetchDocuments}  />
          </div>
        </div>

        {/* Documents Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[rgb(32,23,73)]">
              Your Documents
            </h2>
            <button
              onClick={fetchDocuments}
              className="text-xs px-3 py-1 rounded-full bg-[rgb(97,0,165)] text-white font-medium shadow hover:bg-[rgb(120,20,190)] transition-all"
            >
              Refresh
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[rgb(97,0,165)]"></div>
              <p className="text-sm mt-2 text-[rgb(32,23,73)]/60">
                Fetching your documents...
              </p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="mt-3 text-base font-semibold text-[rgb(32,23,73)]">
                No documents yet
              </h3>
              <p className="mt-1 text-sm text-[rgb(32,23,73)]/60 px-4">
                Upload your first file to get started. You can manage and
                collaborate on it instantly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <DocumentCard document={doc} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer Help Text */}
        <footer className="mt-10 text-center text-[rgb(32,23,73)]/60 text-sm">
          💡 <span className="font-medium">Tip:</span> Tap a document to open,
          leave comments, or get an AI summary.
        </footer>
      </div>
    </div>
  );
}
