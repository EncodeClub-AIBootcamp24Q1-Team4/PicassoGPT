import OpenAI from "openai";
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
    const { paintingTheme, paintingStyle, paintingMood } = await req.json();

    let options = `Write an image prompt for a painting in the style of ${paintingStyle}, in the mood of ${paintingMood}, about ${paintingTheme}`;

    // const myAssistant = await openai.beta.assistants.create({
    //     instructions: "You are a painting expert and AI image generation prompt assistant. When asked a question, write a prompt for an AI image generator.",
    //     name: "Painting Prompter",
    //     model: "gpt-4",
    // });

    // console.log(myAssistant);

    const threadMessages = await openai.beta.threads.messages.create(
        `${process.env.OPENAI_API_THREAD}`,
        {
            role: "user",
            content: `${options}`
        },
      )
    
    //   console.log(threadMessages.id);
    
      const messageResponse = await openai.beta.threads.runs.createAndPoll(
        `${process.env.OPENAI_API_THREAD}`,
        {
            assistant_id: `${process.env.OPENAI_API_ASSISTANT}`,
        }
      )
    
      if (messageResponse.status != 'completed')
        throw new Error(`Unexpected run status: ${messageResponse.status}`);
    
      const assistantResponse = await openai.beta.threads.messages.list(`${process.env.OPENAI_API_THREAD}`);
      return new Response(JSON.stringify(
        {prompt: assistantResponse.data[0].content[0].text.value}
      ))
}