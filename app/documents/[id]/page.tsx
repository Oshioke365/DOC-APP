'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Upload } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';

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

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from('uploads').list('', {
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) console.error('Error fetching files:', error);
    else setFiles(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-md px-5 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[rgb(32,23,73)] mb-2">
            Document Hub 📂
          </h1>
          <p className="text-[rgb(32,23,73)]/70 text-sm leading-relaxed">
            Upload, view, and collaborate on documents — stored in Supabase.
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
          <h2 className="text-lg font-semibold text-[rgb(32,23,73)] mb-3">
            Your Uploaded Files
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : files.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {files.map((file) => {
                const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${file.name}`;
                return (
                  <li
                    key={file.name}
                    className="p-3 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgb(97,0,165)] font-medium hover:underline"
                    >
                      {file.name}
                    </a>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(file.created_at).toLocaleString()}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
