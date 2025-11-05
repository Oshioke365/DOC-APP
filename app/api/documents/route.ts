import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { summarizeDocument } from '@/lib/openai';
import pdf from 'pdf-parse';

export async function GET() {
  const documents = db.documents.getAll();
  return NextResponse.json(documents);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(7);
    const filename = `${uniqueId}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    let summary = undefined;
    
    if (file.type === 'application/pdf') {
      try {
        const pdfData = await pdf(buffer);
        const text = pdfData.text;
        
        if (process.env.OPENAI_API_KEY) {
          summary = await summarizeDocument(text);
        }
      } catch (error) {
        console.error('Error processing PDF:', error);
      }
    } else if (file.type === 'text/plain') {
      try {
        const text = buffer.toString('utf-8');
        
        if (process.env.OPENAI_API_KEY) {
          summary = await summarizeDocument(text);
        }
      } catch (error) {
        console.error('Error processing text file:', error);
      }
    }

    const document = db.documents.create({
      id: uniqueId,
      name: filename,
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type,
      summary,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
