import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { answerQuestion } from '@/lib/openai';
import { readFile } from 'fs/promises';
import { join } from 'path';
import pdf from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const { documentId, question } = await request.json();
    
    if (!documentId || !question) {
      return NextResponse.json(
        { error: 'Missing documentId or question' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const document = db.documents.getById(documentId);
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const filepath = join(process.cwd(), 'public', 'uploads', document.name);
    const buffer = await readFile(filepath);
    
    let text = '';
    
    if (document.type === 'application/pdf') {
      const pdfData = await pdf(buffer);
      text = pdfData.text;
    } else if (document.type === 'text/plain') {
      text = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type for Q&A' },
        { status: 400 }
      );
    }

    const answer = await answerQuestion(text, question);
    
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json(
      { error: 'Failed to answer question' },
      { status: 500 }
    );
  }
}
