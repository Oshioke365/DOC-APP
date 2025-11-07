import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import pdf from 'pdf-parse';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log("🟣 API called");

    const { documentId, question } = await request.json();
    console.log("📄 Document ID:", documentId);
    console.log("❓ Question:", question);

    if (!documentId || !question) {
      return NextResponse.json({ error: 'Missing documentId or question' }, { status: 400 });
    }

    // Step 1: Fetch file from Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .download(documentId);

    if (error || !data) {
      console.error("❌ Supabase download error:", error);
      return NextResponse.json({ error: 'Could not retrieve document' }, { status: 404 });
    }

    // Step 2: Convert to text
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = '';

    if (documentId.endsWith('.pdf')) {
      console.log("📘 Parsing PDF");
      const pdfData = await pdf(buffer);
      text = pdfData.text;
    } else {
      console.log("📄 Reading text file");
      text = buffer.toString('utf-8');
    }

    if (!text.trim()) {
      console.error("⚠️ Document empty or unreadable");
      return NextResponse.json({ error: 'Document has no readable content' }, { status: 400 });
    }

    // Step 3: Call OpenAI
    console.log("🤖 Sending request to OpenAI...");
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that answers questions based on the document content clearly and concisely.',
        },
        {
          role: 'user',
          content: `Document Content:\n${text.slice(0, 5000)}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content || 'No response from OpenAI';
    console.log("✅ AI Answer:", answer);

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("🔥 SERVER ERROR DETAILS:", error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
