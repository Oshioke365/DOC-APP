export interface Document {
  id: string;
  name: string;
  originalName: string;
  uploadedAt: string;
  size: number;
  type: string;
  summary?: string;
}

export interface Comment {
  id: string;
  documentId: string;
  text: string;
  author: string;
  createdAt: string;
}

let documents: Document[] = [];
let comments: Comment[] = [];

export const db = {
  documents: {
    getAll: () => documents,
    getById: (id: string) => documents.find(doc => doc.id === id),
    create: (doc: Document) => {
      documents.push(doc);
      return doc;
    },
    update: (id: string, updates: Partial<Document>) => {
      const index = documents.findIndex(doc => doc.id === id);
      if (index !== -1) {
        documents[index] = { ...documents[index], ...updates };
        return documents[index];
      }
      return null;
    },
    delete: (id: string) => {
      documents = documents.filter(doc => doc.id !== id);
    }
  },
  comments: {
    getAll: () => comments,
    getByDocumentId: (documentId: string) => 
      comments.filter(comment => comment.documentId === documentId),
    create: (comment: Comment) => {
      comments.push(comment);
      return comment;
    },
    delete: (id: string) => {
      comments = comments.filter(comment => comment.id !== id);
    }
  }
};
