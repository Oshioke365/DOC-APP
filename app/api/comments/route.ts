import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const documentId = searchParams.get('documentId');
  
  if (documentId) {
    const comments = db.comments.getByDocumentId(documentId);
    return NextResponse.json(comments);
  }
  
  const allComments = db.comments.getAll();
  return NextResponse.json(allComments);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, text, author } = body;
    
    if (!documentId || !text || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const comment = db.comments.create({
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      documentId,
      text,
      author,
      createdAt: new Date().toISOString(),
    });
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
