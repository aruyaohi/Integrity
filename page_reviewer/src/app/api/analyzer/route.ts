
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse'


//process api key from environment variable
const apikey = process.env.NEXT_PUBLIC_API_KEY
if(!apikey){
   throw new Error('Gemini API key is missing. Please set NEXT_PUBLIC_API_KEY in your .env.local file.');
}
const genAI = new GoogleGenerativeAI(apikey);
console.log("next public api ran", process.env.NEXT_PUBLIC_API_KEY)

interface AnalysisResult {
  success: boolean;
  data?: string;
  error?: string;
  analysis?: {
    factualInconsistencies: number;
    citationIssues: number;
    structuralRecommendations: number;
    improvements: number;
    details: string;
  };
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

// Helper function to analyze document with Google AI
async function analyzeDocument(text: string, filename: string): Promise<AnalysisResult['analysis']> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    You are an expert academic peer reviewer. Analyze the following research document and provide a comprehensive analysis focusing on:

    1. Factual inconsistencies or contradictions
    2. Citation and reference issues
    3. Structural and organizational recommendations
    4. Areas for improvement in clarity, methodology, or argumentation

    Document: "${filename}"
    
    Content:
    ${text.substring(0, 30000)} // Limit content to avoid token limits
    
    Please provide:
    - A count of major factual inconsistencies found
    - A count of citation/reference issues
    - A count of structural recommendations
    - A count of improvement suggestions
    - Detailed analysis explaining your findings
    
    Format your response as a structured analysis with clear sections and specific examples where possible.
    `;

    const result = await model.generateContent(prompt);
    console.log("This is chat's result",result);
    const response = await result.response;
    const analysisText = response.text();

    // Parse the AI response to extract counts (simple regex-based parsing)
    const factualMatches = analysisText.match(/(\d+)\s*(?:factual|inconsistenc)/gi);
    const citationMatches = analysisText.match(/(\d+)\s*(?:citation|reference)/gi);
    const structuralMatches = analysisText.match(/(\d+)\s*(?:structural|organization)/gi);
    const improvementMatches = analysisText.match(/(\d+)\s*(?:improvement|suggestion)/gi);

    return {
      factualInconsistencies: factualMatches ? parseInt(factualMatches[0].match(/\d+/)?.[0] || '0') : 0,
      citationIssues: citationMatches ? parseInt(citationMatches[0].match(/\d+/)?.[0] || '0') : 0,
      structuralRecommendations: structuralMatches ? parseInt(structuralMatches[0].match(/\d+/)?.[0] || '0') : 0,
      improvements: improvementMatches ? parseInt(improvementMatches[0].match(/\d+/)?.[0] || '0') : 0,
      details: analysisText
    };
    
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error('Failed to analyze document with AI');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    console.log('request went through');
    
    // Get metadata
    const fileCount = parseInt(formData.get('fileCount') as string || '0');
    // const fileNames = JSON.parse(formData.get('fileNames') as string || '[]');
    // const analysisType = formData.get('analysisType') as string || 'comprehensive';

    if (fileCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No files provided for analysis' 
      }, { status: 400 });
    }

    // Process each uploaded file
    const analysisResults: AnalysisResult['analysis'][] = [];
    
    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file_${i}`) as File;
      
      if (!file) {
        console.warn(`File ${i} not found in form data`);
        continue;
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
        console.log(extractedText)
        
        if (!extractedText.trim()) {
          return NextResponse.json({ 
            success: false, 
            error: `Could not extract text from ${file.name}. The PDF might be image-based or corrupted.` 
          }, { status: 400 });
        }

        // Analyze the document with AI
        const analysis = await analyzeDocument(extractedText, file.name);
        analysisResults.push(analysis);

      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        return NextResponse.json({ 
          success: false, 
          error: `Failed to process file ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}` 
        }, { status: 500 });
      }
    }

    // Combine results if multiple files
//    const combinedAnalysisAlt: AnalysisResult['analysis'] = {
//   factualInconsistencies: analysisResults.reduce((sum, result) => sum + result.factualInconsistencies, 0),
//   citationIssues: analysisResults.reduce((sum, result) => sum + result.citationIssues, 0),
//   structuralRecommendations: analysisResults.reduce((sum, result) => sum + result.structuralRecommendations, 0),
//   improvements: analysisResults.reduce((sum, result) => sum + result.improvements, 0),
//   details: analysisResults.map(result => result.details).join('\n\n---\n\n')
// };

    // Return successful analysis
    return NextResponse.json({
      success: true,
      data: `Successfully analyzed ${fileCount} document(s)`,
      analysis: analysisResults,
    });

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
    error: 'Method not allowed. Use POST to submit documents for analysis.' 
  }, { status: 405 });
}