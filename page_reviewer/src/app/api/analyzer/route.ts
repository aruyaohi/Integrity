import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse'


//process api key from environment variable
const apikey = process.env.NEXT_PUBLIC_API_KEY
if(!apikey){
   throw new Error('Gemini API key is missing. Please set NEXT_PUBLIC_API_KEY in your .env.local file.');
}

console.log(apikey)


interface ProjectData {
  icon: string
  projectName: string,
  about?:string,
  summary? : {
    coreInnovation:string ,
    businessModel: string,
    valueGeneration: string,
  },
  AI : {
    metrics: string 
    whyinvest: string 
    howtoinvest: string 
  },
  projectPlatforms?:   
  {
  website?: string;
  socials?: {
    X?: string;
    Discord:string;
    telegram:string;
    other?: string;
  };
  articles?: string[]; //
};
  contactFounder?: string;
  achievements?: string[];
  success: boolean;
  data?: string;
  error?: string;
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
async function analyzeDocumentWithGroq(text: string, filename: string) {
const prompt = `
You are an expert white paper auditor for investors. Analyze the following project whitepaper and provide a structured JSON response with:

- keep summary very short
{
  "icon" : "..." //Link to icon
  "projectName": "...";
  "about": "...";
  "summary": //each and everyone of this summary should have about 100 - 200 words of useful information
  {
  coreInnovation: "...";
  businessModel: "...";
  valueGeneration: "..." // How value is generated. 
  };
  "AI" : {
    metrics: "..." // Provide metric for analysis based on white paper, this should be reason for whyinvest sugesstion
    whyinvest: "..." // Provide accurate reason why investor should invest based on up-to-date information
    howtoinvest: "..." // Provide accurate information to the project investment process
  }
  };
  projectPlatforms?:   
  {
  website?: "...";
  socials?: {
    X?: "...";
    Discord?: "...";
    telegram?: "...";
    other?: "...";
  };
  articles?: string[]; //
};
  contactFounder?: string;
  achievements?: string[];
}

Document: "${filename}"

Content:
${text.substring(0, 2000)}


**Important** Result should lay more emphasis on determining if project is investment worthy and why!!


Respond only in valid JSON.
`;


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

  if (!content) {
    throw new Error('Groq returned no message content');
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Raw Groq output:', content);
    console.log(e)
    throw new Error('Failed to parse Groq response as JSON');
  }
}


//Analyze function ends here


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


  const analysisResults: NonNullable<ProjectData>[] = [];

    // Process each uploaded file    
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
        
        if (!extractedText.trim()) {
          return NextResponse.json({ 
            success: false, 
            error: `Could not extract text from ${file.name}. The PDF might be image-based or corrupted.` 
          }, { status: 400 });
        }

        // Analyze the document with AI
        const analysis = await analyzeDocumentWithGroq(extractedText, file.name);
        if(analysis){
            console.log(analysis)
            analysisResults.push(analysis);
        }

      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        return NextResponse.json({ 
          success: false, 
          error: `Failed to process file ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}` 
        }, { status: 500 });
      }
    }

    //Return successful analysis
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