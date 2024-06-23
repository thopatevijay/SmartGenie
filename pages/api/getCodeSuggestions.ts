import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

const getCodeSuggestions = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { code } = await req.json();

    const payload = {
      question: `Complete and review the following Solidity code: ${code}`,
      chat_history: [],
      knowledge_source_id: "clxqgkwcv002j60uvfw83gkby",
    };

    const headers = {
      "x-api-key": process.env.FLOCK_BOT_API_KEY as string,
    };

    const response = await axios.post(
      `${process.env.FLOCK_BOT_ENDPOINT}/chat/conversational_rag_chat`,
      payload,
      { headers }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: "Error fetching suggestions" }, { status: 500 });
  }
};

export default getCodeSuggestions;
