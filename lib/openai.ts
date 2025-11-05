import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function summarizeDocument(text: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes documents. Provide a concise summary highlighting the key points.'
        },
        {
          role: 'user',
          content: `Please summarize the following document:\n\n${text.slice(0, 10000)}`
        }
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    return response.choices[0]?.message?.content || 'Unable to generate summary.';
  } catch (error) {
    console.error('Error summarizing document:', error);
    throw new Error('Failed to generate summary');
  }
}

export async function answerQuestion(documentText: string, question: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that answers questions about documents. Base your answers strictly on the provided document content.'
        },
        {
          role: 'user',
          content: `Document:\n${documentText.slice(0, 10000)}\n\nQuestion: ${question}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Unable to answer question.';
  } catch (error) {
    console.error('Error answering question:', error);
    throw new Error('Failed to answer question');
  }
}
