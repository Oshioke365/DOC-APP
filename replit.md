# Document Collaboration App

## Overview
A Next.js-based document collaboration platform with AI integration. Users can upload documents (PDF, TXT), leave comments, and interact with AI for document summarization and Q&A.

## Features
- Document upload with drag-and-drop interface
- Document library with file management
- Comment system for each document
- AI-powered document summarization (OpenAI)
- AI Q&A feature for document insights
- Responsive design with Tailwind CSS

## Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API routes
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Storage**: File system (in-memory database for metadata)
- **File Processing**: pdf-parse for PDF text extraction

## Project Structure
```
app/
  ├── api/
  │   ├── documents/      # Document upload, retrieval, deletion
  │   ├── comments/       # Comment management
  │   └── ai/            # AI integration endpoints
  ├── documents/[id]/    # Individual document view page
  ├── page.tsx           # Home page with document library
  ├── layout.tsx         # Root layout
  └── globals.css        # Global styles

components/
  └── ui/
      ├── FileUpload.tsx      # Drag-and-drop file upload
      ├── DocumentCard.tsx    # Document preview card
      ├── CommentSection.tsx  # Comments display and form
      └── AIAssistant.tsx     # AI Q&A interface

lib/
  ├── db.ts              # In-memory database
  └── openai.ts          # OpenAI integration utilities

public/
  └── uploads/           # Uploaded documents storage
```

## Setup
1. Install dependencies: `npm install`
2. Add OpenAI API key to environment (optional but recommended for AI features)
3. Run development server: `npm run dev` (binds to 0.0.0.0:5000)

## Recent Changes (November 5, 2025)
- Initial project setup with Next.js 16 and React 19
- Implemented document upload with PDF and TXT support
- Created in-memory database for documents and comments
- Integrated OpenAI for document summarization and Q&A
- Built responsive UI with Tailwind CSS
- Set up API routes for all features

## User Preferences
None specified yet.

## Notes
- Uses in-memory storage (data resets on server restart)
- OpenAI API key required for AI features (summarization and Q&A)
- Supports PDF and TXT file formats
- Dev server configured to bind to 0.0.0.0:5000 for Replit compatibility
