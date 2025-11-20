import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIService {
  transcribeAudio(audioBuffer: Buffer): Promise<string>;
  summarizeTranscript(transcript: string): Promise<string>;
  answerQuestion(transcript: string, summary: string, question: string, conversationHistory?: Array<{ question: string; answer: string }>): Promise<string>;
}

class OpenAIService implements AIService {
  /**
   * Transcribe audio using OpenAI Whisper API
   * Note: Whisper API accepts files up to 25MB
   */
  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      // Create a File object from the buffer
      const file = new File([audioBuffer], "audio.mp3", { type: "audio/mp3" });

      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        response_format: "text",
      });

      return transcription as string;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  /**
   * Generate a summary from a transcript using GPT-3.5-turbo (cost-effective)
   */
  async summarizeTranscript(transcript: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates concise, well-structured summaries of video transcripts. Focus on the main topics, key points, and actionable insights.",
          },
          {
            role: "user",
            content: `Please summarize the following video transcript:\n\n${transcript}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500, // Keep summaries concise
      });

      return response.choices[0]?.message?.content || "Summary generation failed";
    } catch (error) {
      console.error("Error generating summary:", error);
      throw new Error(`Summary generation failed: ${error.message}`);
    }
  }

  /**
   * Answer questions about a video using the transcript and summary as context
   */
  async answerQuestion(transcript: string, summary: string, question: string, conversationHistory: Array<{ question: string; answer: string }> = []): Promise<string> {
    try {
      // Build conversation context
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `You are a helpful assistant that answers questions about a video. Use the following transcript and summary as context to answer questions accurately and concisely.

Summary: ${summary}

Full Transcript: ${transcript.substring(0, 3000)}...`, // Limit context size
        },
      ];

      // Add conversation history (last 3 exchanges to save tokens)
      const recentHistory = conversationHistory.slice(-3);
      for (const exchange of recentHistory) {
        messages.push({ role: "user", content: exchange.question }, { role: "assistant", content: exchange.answer });
      }

      // Add current question
      messages.push({ role: "user", content: question });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content || "Unable to generate answer";
    } catch (error) {
      console.error("Error answering question:", error);
      throw new Error(`Question answering failed: ${error.message}`);
    }
  }
}

export const aiService: AIService = new OpenAIService();
