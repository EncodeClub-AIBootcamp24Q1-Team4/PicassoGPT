import OpenAI from 'openai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const assistantID = process.env.OPENAI_API_ASSISTANT;
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {

    const { paintingTheme } = await req.json();

    let prompt = `Create a prompt to create a painting with the theme of ${paintingTheme}.`;

    console.log(`Assistant ID: ${assistantID}`);
    console.log(`Prompt: ${prompt}`);

    // const assistant = await openai.beta.assistants.create({
    // name: "Professional Artist",
    // instructions: "You are a professional artist.  You composes descriptions of paintings.  You should be able to suggest and describe the details of a painting based on a short description from the user.  You are efficient at answering strictly painting descriptions with details about its elements, style, details, and colors.",
    // tools: [],
    // model: "gpt-4-turbo-preview"
    // });
    // const thread = await openai.beta.threads.create();

    // Structure as per https://www.youtube.com/watch?v=BqnyGSLQMS8
    const assistant = await openai.beta.assistants.retrieve(`${assistantID}`);
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: prompt
        },
    );
    const run = await openai.beta.threads.runs.createAndPoll(
        thread.id, 
        {
            assistant_id: assistant.id,
        }
   );
    
    const messageResponse = await openai.beta.threads.messages.list(thread.id);
    if(messageResponse.data[0].content[0].type === "text")
    {
        return new Response(
            JSON.stringify(
                {prompt: messageResponse.data[0].content[0].text.value}
        ));
    } else {
        throw new Error(`Unexpected response type: ${messageResponse.data[0].content[0]}`);
    }
}
