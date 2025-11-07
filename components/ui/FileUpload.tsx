'use client';

import { useState } from 'react';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert('✅ File uploaded successfully');
        onUploadComplete(data.url);
      } else {
        alert('❌ Upload failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.txt"
        disabled={uploading}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer px-5 py-2.5 text-sm font-medium text-white bg-[rgb(97,0,165)] rounded-full shadow hover:bg-[rgb(120,20,190)] transition ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </label>
      <p className="text-xs text-gray-500 mt-2">Only PDF or TXT files</p>
    </div>
  );
}
