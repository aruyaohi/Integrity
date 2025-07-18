import { Connection, PublicKey, LAMPORTS_PER_SOL, ParsedAccountData, AccountInfo } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'; // Correctly import TOKEN_PROGRAM_ID from @solana/spl-token

// The correct SPL Token Program ID.
// The previous one had a typo (ending in 5mW instead of 5DA).
// Using the imported TOKEN_PROGRAM_ID is the safest way.
// const SPL_TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'); // This is the correct string if you were to hardcode it

/**
 * Fetches the SOL balance for a given Solana public key.
 * @param address The base58 encoded public key string.
 * @param connection The Solana Connection object.
 * @returns The SOL balance as a fixed-point string, or null if an error occurs.
 */
export async function getSolBalance(address: string, connection: Connection): Promise<string | null> {
  try {
    const publicKey = new PublicKey(address);
    const balanceInLamports = await connection.getBalance(publicKey);
    const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
    return balanceInSol.toFixed(4); // Format to 4 decimal places for display
  } catch (err) {
    console.error(`Error fetching SOL balance for ${address}:`, err);
    return null;
  }
}

/**
 * Fetches the SPL token holdings for a given Solana public key.
 * @param address The base58 encoded public key string.
 * @param connection The Solana Connection object.
 * @returns A string summarizing token holdings, or null if an error occurs.
 */
export async function getTokenHoldings(address: string, connection: Connection): Promise<string | null> {
  try {
    console.log("Groq is running getTokenHoldings for address:", address);
    const publicKey = new PublicKey(address);

    // Using getParsedTokenAccountsByOwner is generally preferred as it automatically
    // parses the account data into a human-readable format, making it easier to extract token info.
    // It takes the owner's PublicKey and an optional filter (e.g., by programId).
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: TOKEN_PROGRAM_ID } // Use the correctly imported TOKEN_PROGRAM_ID
    );

    if (tokenAccounts.value.length === 0) {
      return "No SPL tokens found for this address.";
    }

    let holdings = [];

    // Iterate through the parsed token accounts
    for (const account of tokenAccounts.value) {
      // The 'data' field will already be parsed if using getParsedTokenAccountsByOwner
      const parsedInfo = account.account.data as ParsedAccountData;

      // Ensure it's an SPL token account and has parsed info
      if (parsedInfo.program === 'spl-token' && parsedInfo.parsed?.info) {
        const amount = parsedInfo.parsed.info.tokenAmount.uiAmount;
        const mintAddress = parsedInfo.parsed.info.mint;

        // Only show tokens with a positive balance
        if (amount > 0) {
          // For better readability, you might want to fetch token metadata (symbol/name)
          // from a service like the Solana Token List or a Block Explorer API.
          // For this example, we'll use a truncated mint address.
          holdings.push(`${amount} tokens of mint: ${mintAddress.substring(0, 6)}...${mintAddress.slice(-6)}`);
        }
      }
    }

    return holdings.length > 0 ? holdings.join('\n') : "No SPL tokens found for this address (or all had zero balance).";

  } catch (err) {
    console.error(`Error fetching token holdings for ${address}:`, err);
    // Provide a more user-friendly error message if the address itself was the issue
    if (err instanceof Error && err.message.includes("unrecognized Token program id")) {
        return `Error: Could not retrieve token holdings due to an internal configuration issue. Please contact support.`;
    }
    return `Error retrieving token holdings for ${address}.`;
  }
}

/**
 * Fetches general account information for a given Solana public key.
 * @param address The base58 encoded public key string.
 * @param connection The Solana Connection object.
 * @returns A string summarizing account information, or null if an error occurs.
 */
export async function getSolanaAccountInfo(address: string, connection: Connection): Promise<string | null> {
  try {
    const publicKey = new PublicKey(address);
    // Using getParsedAccountInfo to automatically parse common account types
    const accountInfo = await connection.getParsedAccountInfo(publicKey);

    if (!accountInfo.value) { // accountInfo.value will be null if account not found
      return `Account ${address.substring(0, 6)}...${address.slice(-6)} not found.`;
    }

    const { executable, lamports, owner, rentEpoch, data } = accountInfo.value;

    let infoSummary = `Account Info for ${address.substring(0, 6)}...${address.slice(-6)}:\n`;
    infoSummary += `- SOL Balance: ${(lamports / LAMPORTS_PER_SOL).toFixed(4)} SOL\n`;
    infoSummary += `- Executable: ${executable ? 'Yes' : 'No'} (Is it a program?)\n`;
    infoSummary += `- Rent Epoch: ${rentEpoch}\n`;
    // infoSummary += `- Data Size: ${space} bytes\n`;
    infoSummary += `- Owner Program: ${owner.toBase58()}\n`;

    // Attempt to provide more specific data if it's parsed
    if (typeof data === 'object' && 'parsed' in data && data.program) {
        infoSummary += `- Program Type: ${data.program}\n`;
        if (data.program === 'spl-token') {
            if (data.parsed.type === 'account') {
                infoSummary += `- SPL Token Account (Mint: ${data.parsed.info.mint}, Owner: ${data.parsed.info.owner}, Amount: ${data.parsed.info.tokenAmount.uiAmount})\n`;
            } else if (data.parsed.type === 'mint') {
                infoSummary += `- SPL Token Mint (Supply: ${data.parsed.info.supply}, Decimals: ${data.parsed.info.decimals})\n`;
            }
        }
        // Add more parsing for other known programs if needed
    } else if (data instanceof Buffer) {
        infoSummary += `- Raw Data (Base64): ${data.toString('base64').substring(0, 50)}...\n`; // Truncate for display
    }


    return infoSummary;
  } catch (err) {
    console.error(`Error fetching account info for ${address}:`, err);
    return `Error retrieving account info for ${address}.`;
  }
}
