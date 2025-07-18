// import { NextRequest, NextResponse } from 'next/server';
// import { Connection, PublicKey } from '@solana/web3.js';
// import pdfParse from 'pdf-parse';
// import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SchemaType, FunctionDeclaration } from '@google/generative-ai';

// // Importing utility functions
// import { getSolanaAccountInfo, getSolBalance } from '../../../../utils/solanaRpc';
// import { getTokenHoldings } from '../../../../utils/solanaRpc'; 

// // Process Gemini API key from environment variable
// const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
// if (!GEMINI_API_KEY) {
//   throw new Error('Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
// }

// // Process Helius RPC URL from environment variable
// const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL;
// if (!HELIUS_RPC_URL) {
//   throw new Error('Helius RPC URL is missing. Please set HELIUS_RPC_URL in your .env.local file.');
// }

// // Initialize Solana Connection
// const solanaConnection = new Connection(HELIUS_RPC_URL, 'confirmed');
// console.log('Backend Solana Connection initialized with:', HELIUS_RPC_URL);

// // Initialize GoogleGenerativeAI client
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// // Interface for document analysis response
// interface ProjectData {
//   answer: string;
//   analysis?: string;
// }

// // Helper function to extract text from PDF buffer
// async function extractTextFromPDF(buffer: Buffer): Promise<string> {
//   try {
//     const data = await pdfParse(buffer);
//     return data.text;
//   } catch (error) {
//     console.error('PDF parsing error:', error);
//     throw new Error('Failed to extract text from PDF');
//   }
// }

// // Define tools for Gemini function calling
// const tools: FunctionDeclaration[] = [
//   {
//     name: "getSolBalance",
//     description: "Get the current SOL balance of a given Solana wallet address.",
//     parameters: {
//       type: SchemaType.OBJECT,
//       properties: {
//         address: {
//           type: SchemaType.STRING,
//           description: "The Solana wallet address (Public Key) to check the balance for. Must be a valid base58 encoded Solana address.",
//         },
//       },
//       required: ["address"],
//     },
//   },
//   {
//     name: "getTokenHoldings",
//     description: "Get the SPL token holdings for a given Solana wallet address.",
//     parameters: {
//       type: SchemaType.OBJECT,
//       properties: {
//         address: {
//           type: SchemaType.STRING,
//           description: "The Solana wallet address (Public Key) to check token holdings for.",
//         },
//       },
//       required: ["address"],
//     },
//   },
// ];

// // Function to call Gemini with tools
// async function callGeminiWithTools(prompt: string): Promise<any> {
//   const generationConfig = {
//     temperature: 0.2,
//     topK: 64,
//     topP: 0.95,
//     maxOutputTokens: 8192,
//   };

//   const safetySettings = [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//   ];

//   try {
//     const chat = model.startChat({
//       tools: [{ functionDeclarations: tools }],
//       generationConfig,
//       safetySettings,
//     });

//     const result = await chat.sendMessage(prompt);
//     const response = result.response;
    
//     console.log("Gemini response:", JSON.stringify(response, null, 2));
    
//     return response;
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

// // Function to call Gemini without tools (for document analysis)
// async function callGeminiForAnalysis(prompt: string): Promise<string> {
//   const generationConfig = {
//     temperature: 0.2,
//     topK: 64,
//     topP: 0.95,
//     maxOutputTokens: 8192,
//   };

//   const safetySettings = [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//       threshold: HarmBlockThreshold.BLOCK_NONE,
//     },
//   ];

//   try {
//     const result = await model.generateContent({
//       contents: [{ role: 'user', parts: [{ text: prompt }] }],
//       generationConfig,
//       safetySettings,
//     });

//     const response = result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const contentType = request.headers.get('content-type');
//     let prompt: string | null = null;
//     let fileCount: number = 0;
//     let file: File | null = null;

//     if (contentType?.includes('multipart/form-data')) {
//       // For file uploads (whitepaper analysis)
//       const formData = await request.formData();
//       fileCount = parseInt(formData.get('fileCount') as string || '0');
//       prompt = formData.get('prompt') as string || '';
//       file = formData.get('file_0') as File;
//     } else {
//       // For JSON chat messages
//       const body = await request.json();
//       prompt = body.prompt as string;
//     }

//     if (fileCount === 0 && !prompt?.trim()) {
//       return NextResponse.json({
//         success: false,
//         error: 'Please provide either a PDF file for analysis or a prompt for general blockchain questions.'
//       }, { status: 400 });
//     }

//     // Case 1: File + Prompt (whitepaper analysis)
//     if (fileCount > 0 && file) {
//       console.log(`Processing file analysis for prompt: "${prompt}"`);

//       if (!file) {
//         return NextResponse.json({ success: false, error: 'No file found in the request' }, { status: 400 });
//       }
//       if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
//         return NextResponse.json({ success: false, error: `File ${file.name} is not a PDF. Only PDF files are supported.` }, { status: 400 });
//       }
//       const maxSize = 10 * 1024 * 1024; // 10MB
//       if (file.size > maxSize) {
//         return NextResponse.json({ success: false, error: `File ${file.name} exceeds 10MB size limit` }, { status: 400 });
//       }

//       try {
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         const extractedText = await extractTextFromPDF(buffer);

//         if (!extractedText.trim()) {
//           return NextResponse.json({ 
//             success: false, 
//             error: `Could not extract text from ${file.name}. The PDF might be image-based or corrupted.` 
//           }, { status: 400 });
//         }

//         const analysisPrompt = `You are an expert Blockchain Expert, an Agent for DYOR on the Solana Blockchain. Analyze the following whitepaper and provide answers based on the context provided.

// Context/Question: ${prompt || 'Analyze this whitepaper'}
// Document: "${file.name}"
// Content:
// ${extractedText.substring(0, 3000)}

// IMPORTANT: You must respond with ONLY valid JSON in the exact format below. Do not include any markdown formatting, code blocks, or additional text outside the JSON structure.

// {
//   "answer": "Your detailed analysis here with just one or two emojis and symbols",
//   "analysis": "Your whitepaper analysis focusing on investment worthiness"
// }

// Focus on determining if the project is investment worthy and why. Keep answer brief, not more than 2000 words. Use symbols and emojis within the JSON string values for better readability.`;

//         const llmResponse = await callGeminiForAnalysis(analysisPrompt);

//         // Parse the LLM's JSON response for document analysis
//         let parsedAnalysis: ProjectData;
//         try {
//           let cleanContent = llmResponse.trim();
//           cleanContent = cleanContent.replace(/```json\s*\n?|```\s*\n?/g, '');
//           cleanContent = cleanContent.trim();
//           const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
//           if (jsonMatch) {
//             cleanContent = jsonMatch[0];
//           }
//           cleanContent = cleanContent.replace(/^[^{]*/, '');
//           cleanContent = cleanContent.replace(/[^}]*$/, '}');
//           parsedAnalysis = JSON.parse(cleanContent);
//         } catch (e) {
//           console.error('JSON parse error for document analysis:', e);
//           parsedAnalysis = {
//             answer: llmResponse || "Analysis could not be properly formatted.",
//             analysis: "Formatting error."
//           };
//         }

//         return NextResponse.json({
//           success: true,
//           message: `Successfully analyzed ${file.name}`,
//           data: parsedAnalysis,
//           type: 'whitepaper_analysis'
//         });

//       } catch (fileError) {
//         console.error(`Error processing file ${file.name}:`, fileError);
//         return NextResponse.json({
//           success: false,
//           error: `Failed to process file ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`
//         }, { status: 500 });
//       }
//     }

//     // Case 2: Chat Prompt (LLM-driven with tool calling)
//     else if (prompt?.trim()) {
//       console.log(`Processing chat prompt with tool calling: "${prompt}"`);

//       try {
//         const response = await callGeminiWithTools(prompt);
//         const candidates = response.candidates;
        
//         if (!candidates || candidates.length === 0) {
//           return NextResponse.json({
//             success: false,
//             error: 'No response from Gemini'
//           }, { status: 500 });
//         }

//         const candidate = candidates[0];
//         const content = candidate.content;
        
//         let botResponseText = "I'm not sure how to respond to that. Can you clarify?";
//         let responseType: string = 'llm_analysis';

//         // Check if there are function calls
//         if (content.parts && content.parts.some((part: any) => part.functionCall)) {
//           const functionCallPart = content.parts.find((part: any) => part.functionCall);
//           const functionCall = functionCallPart.functionCall;
//           const functionName = functionCall.name;
//           const functionArgs = functionCall.args;

//           let toolResult: any = null;
//           let toolError: string | null = null;

//           if (functionName === 'getSolBalance') {
//             const address = functionArgs.address;
//             if (address) {
//               try {
//                 new PublicKey(address);
//                 toolResult = await getSolBalance(address, solanaConnection);
//                 responseType = 'onchain_sol_balance';
//                 if (toolResult === null) {
//                   toolError = `Failed to get SOL balance for ${address}.`;
//                 }
//               } catch (pkError) {
//                 toolError = `Invalid Solana address provided: ${address}.`;
//               }
//             } else {
//               toolError = "No address provided for getSolBalance.";
//             }
//           } else if (functionName === 'getTokenHoldings') {
//             const address = functionArgs.address;
//             if (address) {
//               try {
//                 new PublicKey(address);
//                 toolResult = await getTokenHoldings(address, solanaConnection);
//                 responseType = 'onchain_token_holdings';
//                 if (toolResult === null) {
//                   toolError = `Failed to get token holdings for ${address}.`;
//                 }
//               } catch (pkError) {
//                 toolError = `Invalid Solana address provided: ${address}.`;
//               }
//             } else {
//               toolError = "No address provided for getTokenHoldings.";
//             }
//           }

//           else if (functionName === 'getSolanaAccountInfo') {
//             const address = functionArgs.address;
//             if (address) {
//               try {
//                 new PublicKey(address);
//                 toolResult = await getSolanaAccountInfo(address, solanaConnection);
//                 responseType = 'onchain_token_holdings';
//                 if (toolResult === null) {
//                   toolError = `Failed to get token holdings for ${address}.`;
//                 }
//               } catch (pkError) {
//                 toolError = `Invalid Solana address provided: ${address}.`;
//               }
//             } else {
//               toolError = "No address provided for getTokenHoldings.";
//             }
//           }

//           // Create follow-up prompt with tool result
//           const followUpPrompt = `The user asked: "${prompt}"

// I called the function ${functionName} with arguments ${JSON.stringify(functionArgs)} and got this result:
// ${toolResult !== null ? JSON.stringify(toolResult, null, 2) : `Error: ${toolError}`}

// Please provide a natural language response to the user based on this information.`;

//           const finalResponse = await callGeminiForAnalysis(followUpPrompt);
//           botResponseText = finalResponse || "I processed your request, but couldn't generate a clear response.";

//         } else {
//           // No function calls, get direct text response
//           const textParts = content.parts.filter((part: any) => part.text);
//           if (textParts.length > 0) {
//             botResponseText = textParts.map((part: any) => part.text).join(' ');
//           } else {
//             botResponseText = "I couldn't understand that request.";
//           }
//           responseType = 'llm_analysis';
//         }

//         return NextResponse.json({
//           success: true,
//           data: { answer: botResponseText },
//           type: responseType
//         });

//       } catch (error) {
//         console.error('Error in chat processing:', error);
//         return NextResponse.json({
//           success: false,
//           error: `Failed to process chat: ${error instanceof Error ? error.message : 'Unknown error'}`
//         }, { status: 500 });
//       }
//     }

//     return NextResponse.json({
//       success: false,
//       error: 'Invalid request format'
//     }, { status: 400 });

//   } catch (error) {
//     console.error('API Error:', error);
//     return NextResponse.json({
//       success: false,
//       error: error instanceof Error ? error.message : 'Internal server error'
//     }, { status: 500 });
//   }
// }

// // Handle other HTTP methods
// export async function GET() {
//   return NextResponse.json({
//     success: false,
//     error: 'Method not allowed. Use POST to submit documents for analysis or ask blockchain questions.'
//   }, { status: 405 });
// }

import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SchemaType, FunctionDeclaration } from '@google/generative-ai';

// Importing utility functions
import { getSolanaAccountInfo, getSolBalance } from '../../../../utils/solanaRpc';
import { getTokenHoldings } from '../../../../utils/solanaRpc'; 

// Process Gemini API key from environment variable
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
}

// Process Helius RPC URL from environment variable
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL;
if (!HELIUS_RPC_URL) {
  throw new Error('Helius RPC URL is missing. Please set HELIUS_RPC_URL in your .env.local file.');
}

// Initialize Solana Connection
const solanaConnection = new Connection(HELIUS_RPC_URL, 'confirmed');
console.log('Backend Solana Connection initialized with:', HELIUS_RPC_URL);

// Initialize GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// Interface for document analysis response
interface ProjectData {
  answer: string;
  analysis?: string;
}

// Type definitions for Gemini API responses
interface GeminiPart {
  text?: string;
  functionCall?: {
    name: string;
    args: Record<string, unknown>;
  };
}

interface GeminiContent {
  parts: GeminiPart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
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

// Define tools for Gemini function calling
const tools: FunctionDeclaration[] = [
  {
    name: "getSolBalance",
    description: "Get the current SOL balance of a given Solana wallet address.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        address: {
          type: SchemaType.STRING,
          description: "The Solana wallet address (Public Key) to check the balance for. Must be a valid base58 encoded Solana address.",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "getTokenHoldings",
    description: "Get the SPL token holdings for a given Solana wallet address.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        address: {
          type: SchemaType.STRING,
          description: "The Solana wallet address (Public Key) to check token holdings for.",
        },
      },
      required: ["address"],
    },
  },
];

// Function to call Gemini with tools
async function callGeminiWithTools(prompt: string): Promise<GeminiResponse> {
  const generationConfig = {
    temperature: 0.2,
    topK: 64,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  try {
    const chat = model.startChat({
      tools: [{ functionDeclarations: tools }],
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    
    console.log("Gemini response:", JSON.stringify(response, null, 2));
    
    return response as GeminiResponse;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to call Gemini without tools (for document analysis)
async function callGeminiForAnalysis(prompt: string): Promise<string> {
  const generationConfig = {
    temperature: 0.2,
    topK: 64,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let prompt: string | null = null;
    let fileCount: number = 0;
    let file: File | null = null;

    if (contentType?.includes('multipart/form-data')) {
      // For file uploads (whitepaper analysis)
      const formData = await request.formData();
      fileCount = parseInt(formData.get('fileCount') as string || '0');
      prompt = formData.get('prompt') as string || '';
      file = formData.get('file_0') as File;
    } else {
      // For JSON chat messages
      const body = await request.json();
      prompt = body.prompt as string;
    }

    if (fileCount === 0 && !prompt?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Please provide either a PDF file for analysis or a prompt for general blockchain questions.'
      }, { status: 400 });
    }

    // Case 1: File + Prompt (whitepaper analysis)
    if (fileCount > 0 && file) {
      console.log(`Processing file analysis for prompt: "${prompt}"`);

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file found in the request' }, { status: 400 });
      }
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json({ success: false, error: `File ${file.name} is not a PDF. Only PDF files are supported.` }, { status: 400 });
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json({ success: false, error: `File ${file.name} exceeds 10MB size limit` }, { status: 400 });
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const extractedText = await extractTextFromPDF(buffer);

        if (!extractedText.trim()) {
          return NextResponse.json({ 
            success: false, 
            error: `Could not extract text from ${file.name}. The PDF might be image-based or corrupted.` 
          }, { status: 400 });
        }

        const analysisPrompt = `You are an expert Blockchain Expert, an Agent for DYOR on the Solana Blockchain. Analyze the following whitepaper and provide answers based on the context provided.

Context/Question: ${prompt || 'Analyze this whitepaper'}
Document: "${file.name}"
Content:
${extractedText.substring(0, 3000)}

IMPORTANT: You must respond with ONLY valid JSON in the exact format below. Do not include any markdown formatting, code blocks, or additional text outside the JSON structure.

{
  "answer": "Your detailed analysis here with just one or two emojis and symbols",
  "analysis": "Your whitepaper analysis focusing on investment worthiness"
}

Focus on determining if the project is investment worthy and why. Keep answer brief, not more than 2000 words. Use symbols and emojis within the JSON string values for better readability.`;

        const llmResponse = await callGeminiForAnalysis(analysisPrompt);

        // Parse the LLM's JSON response for document analysis
        let parsedAnalysis: ProjectData;
        try {
          let cleanContent = llmResponse.trim();
          cleanContent = cleanContent.replace(/```json\s*\n?|```\s*\n?/g, '');
          cleanContent = cleanContent.trim();
          const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cleanContent = jsonMatch[0];
          }
          cleanContent = cleanContent.replace(/^[^{]*/, '');
          cleanContent = cleanContent.replace(/[^}]*$/, '}');
          parsedAnalysis = JSON.parse(cleanContent);
        } catch (e) {
          console.error('JSON parse error for document analysis:', e);
          parsedAnalysis = {
            answer: llmResponse || "Analysis could not be properly formatted.",
            analysis: "Formatting error."
          };
        }

        return NextResponse.json({
          success: true,
          message: `Successfully analyzed ${file.name}`,
          data: parsedAnalysis,
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

    // Case 2: Chat Prompt (LLM-driven with tool calling)
    else if (prompt?.trim()) {
      console.log(`Processing chat prompt with tool calling: "${prompt}"`);

      try {
        const response = await callGeminiWithTools(prompt);
        const candidates = response.candidates;
        
        if (!candidates || candidates.length === 0) {
          return NextResponse.json({
            success: false,
            error: 'No response from Gemini'
          }, { status: 500 });
        }

        const candidate = candidates[0];
        const content = candidate.content;
        
        let botResponseText = "I'm not sure how to respond to that. Can you clarify?";
        let responseType: string = 'llm_analysis';

        // Check if there are function calls
        if (content.parts && content.parts.some((part: GeminiPart) => part.functionCall)) {
          const functionCallPart = content.parts.find((part: GeminiPart) => part.functionCall);
          const functionCall = functionCallPart?.functionCall;
          
          if (!functionCall) {
            throw new Error('Function call not found');
          }
          
          const functionName = functionCall.name;
          const functionArgs = functionCall.args;

          let toolResult: unknown = null;
          let toolError: string | null = null;

          if (functionName === 'getSolBalance') {
            const address = functionArgs.address as string;
            if (address) {
              try {
                new PublicKey(address);
                toolResult = await getSolBalance(address, solanaConnection);
                responseType = 'onchain_sol_balance';
                if (toolResult === null) {
                  toolError = `Failed to get SOL balance for ${address}.`;
                }
              } catch {
                toolError = `Invalid Solana address provided: ${address}.`;
              }
            } else {
              toolError = "No address provided for getSolBalance.";
            }
          } else if (functionName === 'getTokenHoldings') {
            const address = functionArgs.address as string;
            if (address) {
              try {
                new PublicKey(address);
                toolResult = await getTokenHoldings(address, solanaConnection);
                responseType = 'onchain_token_holdings';
                if (toolResult === null) {
                  toolError = `Failed to get token holdings for ${address}.`;
                }
              } catch {
                toolError = `Invalid Solana address provided: ${address}.`;
              }
            } else {
              toolError = "No address provided for getTokenHoldings.";
            }
          }

          else if (functionName === 'getSolanaAccountInfo') {
            const address = functionArgs.address as string;
            if (address) {
              try {
                new PublicKey(address);
                toolResult = await getSolanaAccountInfo(address, solanaConnection);
                responseType = 'onchain_token_holdings';
                if (toolResult === null) {
                  toolError = `Failed to get token holdings for ${address}.`;
                }
              } catch {
                toolError = `Invalid Solana address provided: ${address}.`;
              }
            } else {
              toolError = "No address provided for getTokenHoldings.";
            }
          }

          // Create follow-up prompt with tool result
          const followUpPrompt = `The user asked: "${prompt}"

I called the function ${functionName} with arguments ${JSON.stringify(functionArgs)} and got this result:
${toolResult !== null ? JSON.stringify(toolResult, null, 2) : `Error: ${toolError}`}

Please provide a natural language response to the user based on this information.`;

          const finalResponse = await callGeminiForAnalysis(followUpPrompt);
          botResponseText = finalResponse || "I processed your request, but couldn't generate a clear response.";

        } else {
          // No function calls, get direct text response
          const textParts = content.parts.filter((part: GeminiPart) => part.text);
          if (textParts.length > 0) {
            botResponseText = textParts.map((part: GeminiPart) => part.text).join(' ');
          } else {
            botResponseText = "I couldn't understand that request.";
          }
          responseType = 'llm_analysis';
        }

        return NextResponse.json({
          success: true,
          data: { answer: botResponseText },
          type: responseType
        });

      } catch (error) {
        console.error('Error in chat processing:', error);
        return NextResponse.json({
          success: false,
          error: `Failed to process chat: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, { status: 500 });
      }
    }

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