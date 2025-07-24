// import { NextRequest, NextResponse } from "next/server";

// const functionOne = async (message: string) => {
//     const result = `Message logged at ${new Date().toISOString()}: ${message}`;
//     console.log(result);
//     return result;
// };

// export async function POST(request: NextRequest) {
//     try {
//         // Parse the request body
//         const body = await request.json();
//         const { message } = body;
//         console.log(message);

//         // Validate that message exists
//         if (!message) {
//             return NextResponse.json(
//                 { error: "Message is required" },
//                 { status: 400 }
//             );
//         }

//         // Log the message using functionOne
//         const logResult = await functionOne(message);

//         // Return success response
//         return NextResponse.json({
//             success: true,
//             logged: logResult,
//             timestamp: new Date().toISOString()
//         });

//     } catch (error) {
//         console.error("Error processing message:", error);
//         return NextResponse.json(
//             { error: "Failed to process message" },
//             { status: 500 }
//         );
//     }
// }

// export async function GET(request: NextRequest) {
//     // Optional: Handle GET requests to test the endpoint
//     return NextResponse.json({
//         message: "Message logging endpoint is active",
//         method: "POST",
//         expectedBody: { message: "your message here" }
//     });
// }

import { NextRequest, NextResponse } from "next/server";

const functionOne = async (message: string) => {
    const result = `Message logged at ${new Date().toISOString()}: ${message}`;
    console.log(result);
    return result;
};

async function sendTelegramMessage(chatId:Number, text:string) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
  
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML' // or 'Markdown'
    })
  });
}
export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json();
        const { message, botWebhookUrl } = body;

        // Validate that message exists
        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Log the message using functionOne
        const logResult = await functionOne(message);

        // Generate a response (customize this logic as needed)
        const response = `Received your message: "${message}". Processing complete!`;

        // Send response back to bot if webhook URL is provided

            // try {
            //     const botResponse = await sendTelegramMessage(, botWebhookUrl);
            // } catch (error) {
            //     console.error("Bot webhook failed, but continuing...", error);
            // }  


        // Return success response
        return NextResponse.json({
            success: true,
            logged: logResult,
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error processing message:", error);
        return NextResponse.json(
            { error: "Failed to process message" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Optional: Handle GET requests to test the endpoint
    return NextResponse.json({
        message: "Message logging endpoint is active",
        method: "POST",
        expectedBody: { 
            message: "your message here",
            botWebhookUrl: "https://your-bot-webhook-url.com/webhook" 
        }
    });
}