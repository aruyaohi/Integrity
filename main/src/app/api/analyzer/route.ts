import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

// Process API key from environment variable
const apikey = process.env.NEXT_PUBLIC_API_KEY;
if (!apikey) {
  throw new Error('Groq API key is missing. Please set NEXT_PUBLIC_API_KEY in your .env.local file.');
}

console.log(apikey)

interface ProjectData {
  answer: string;
  analysis?: string;
}

// Helper function to extract text from PDF buffer
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

async function analyzeDocumentWithGroq(text: string | null, filename: string | null, context: string): Promise<ProjectData> {
  let prompt: string;

  if (text && filename) {
    // Case 1: File + Prompt (whitepaper analysis)
    prompt = `
You are an expert Blockchain Expert, an Agent for DYOR on the Solana Blockchain. Analyze the following whitepaper and provide answers based on the context provided.

Context/Question: ${context}

Document: "${filename}"

Content:
${text.substring(0, 3000)}

IMPORTANT: You must respond with ONLY valid JSON in the exact format below. Do not include any markdown formatting, code blocks, or additional text outside the JSON structure.

{
  "answer": "Your detailed analysis here with just one or two emojis and symbols",
  "analysis": "Your whitepaper analysis focusing on investment worthiness"
}

Focus on determining if the project is investment worthy and why. Keep answer brief, not more than 2000 words. Use symbols and emojis within the JSON string values for better readability.
`;
  } else {
    // Case 2: Prompt only (general blockchain questions)
    prompt = `
You are an expert Blockchain Expert, an Agent for DYOR on the Solana Blockchain. Answer the following question or provide information based on the context provided.

Question/Context: ${context}

IMPORTANT: You must respond with ONLY valid JSON in the exact format below. Do not include any markdown formatting, code blocks, or additional text outside the JSON structure.

{
  "answer": "Your detailed response here with emojis and symbols"
}

Focus on providing valuable blockchain/Solana insights. Keep answer brief, not more than 2000 words. Use symbols and emojis within the JSON string values for better readability.
`;
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error: ${res.status} ${res.statusText}\n${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  console.log("Groq response data:", data);
  console.log("Groq content:", content);

  if (!content) {
    throw new Error('Groq returned no message content');
  }

  try {
    // More aggressive cleaning of the response
    let cleanContent = content.trim();
    
    // Remove markdown code blocks
    cleanContent = cleanContent.replace(/```json\s*\n?|```\s*\n?/g, '');
    
    // Remove any leading/trailing whitespace
    cleanContent = cleanContent.trim();
    
    // Try to find JSON content between curly braces
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }
    
    // Additional cleanup for common issues
    cleanContent = cleanContent.replace(/^[^{]*/, ''); // Remove everything before first {
    cleanContent = cleanContent.replace(/[^}]*$/, '}'); // Ensure it ends with }
    
    return JSON.parse(cleanContent);
  } catch (e) {
    console.error('Raw Groq output:', content);
    console.error('JSON parse error:', e);
    
    // Enhanced fallback strategy
    try {
      // Try to extract JSON more aggressively
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const extractedJson = content.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(extractedJson);
      }
    } catch (fallbackError) {
      console.error('Fallback JSON parse also failed:', fallbackError);
    }
    
    // Last resort: create a structured response from the raw content
    console.warn('Creating fallback response due to JSON parsing failure');
    return {
      answer: content.replace(/[^\x00-\x7F]/g, ''), // Remove non-ASCII characters that might cause issues
      analysis: text ? "Analysis could not be properly formatted due to response format issues" : undefined
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    console.log('Form data received:', formData);

    // Get metadata
    const fileCount = parseInt(formData.get('fileCount') as string || '0');
    const customPrompt = formData.get('prompt') as string || '';

    // Validate that we have either files or a prompt
    if (fileCount === 0 && !customPrompt.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Please provide either a PDF file for analysis or a prompt for general blockchain questions.'
      }, { status: 400 });
    }

    // Case 1: File + Prompt (whitepaper analysis)
    if (fileCount > 0) {
      console.log(`Processing ${fileCount} file(s) with prompt: "${customPrompt}"`);

      // Process the first file (assuming single file for now)
      const file = formData.get('file_0') as File;
      
      if (!file) {
        return NextResponse.json({
          success: false,
          error: 'No file found in the request'
        }, { status: 400 });
      }

      // Validate file type
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json({
          success: false,
          error: `File ${file.name} is not a PDF. Only PDF files are supported.`
        }, { status: 400 });
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json({
          success: false,
          error: `File ${file.name} exceeds 10MB size limit`
        }, { status: 400 });
      }

      try {
        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract text from PDF
        const extractedText = await extractTextFromPDF(buffer);
        
        if (!extractedText.trim()) {
          return NextResponse.json({
            success: false,
            error: `Could not extract text from ${file.name}. The PDF might be image-based or corrupted.`
          }, { status: 400 });
        }

        // Analyze the document with AI
        const analysis = await analyzeDocumentWithGroq(extractedText, file.name, customPrompt || 'Analyze this whitepaper');
        
        console.log("Analysis result:", analysis);
        
        return NextResponse.json({
          success: true,
          message: `Successfully analyzed ${file.name}`,
          data: analysis,
          type: 'whitepaper_analysis'
        });

      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        return NextResponse.json({
          success: false,
          error: `Failed to process file ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`
        }, { status: 500 });
      }
    }

    // Case 2: Prompt only (general blockchain questions)
    else if (customPrompt.trim()) {
      console.log(`Processing prompt-only request: "${customPrompt}"`);

      try {
        // Analyze with just the prompt
        const analysis = await analyzeDocumentWithGroq(null, null, customPrompt);
        
        console.log("Prompt analysis result:", analysis);
        
        return NextResponse.json({
          success: true,
          message: 'Successfully processed your blockchain question',
          data: analysis,
          type: 'prompt_analysis'
        });

      } catch (promptError) {
        console.error('Error processing prompt:', promptError);
        return NextResponse.json({
          success: false,
          error: `Failed to process prompt: ${promptError instanceof Error ? promptError.message : 'Unknown error'}`
        }, { status: 500 });
      }
    }

    // This shouldn't be reached due to earlier validation, but just in case
    return NextResponse.json({
      success: false,
      error: 'Invalid request format'
    }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to submit documents for analysis or ask blockchain questions.'
  }, { status: 405 });
}