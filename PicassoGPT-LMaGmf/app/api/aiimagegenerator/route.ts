import OpenAI from 'openai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
    const { message } = await req.json();
    const prompt = `Generate: ${message}`;
    console.log(`Prompt: ${prompt}`)
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        quality: "hd",
        response_format: "b64_json",
        n: 1,
    });
    return new Response(JSON.stringify(response.data[0].b64_json))
}
