'use client';
 
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
 
export default function Chat() {
  const { messages, input, isLoading, append, handleInputChange, handleSubmit } = useChat();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [paintingTheme, setPaintingTheme] = useState('random');
  const [paintingMood, setPaintingMood] = useState('serene');
  const [paintingStyle, setPaintingStyle] = useState('pop-art');

  const [isPromptLoading, setPromptLoading] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Select options, then generate prompt.");

  const [jokeRating, setJokeRating] = useState('Dall-E 2');

  // useEffect(() => {
  //   if (messagesContainerRef.current) {
  //     messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  //   }
  // }, [messages]);

  return (
    <div className="flex w-full h-screen max-w-7xl py-12 mx-auto items-stretch">
      <div className='flex-2'>
        <div className='flex flex-col justify-center mb-2 items-center'>
          <div className='flex flex-col mb-2'>
            <label className="text-white font-bold text-xl mr-2">
              Generate An Image Prompt
            </label>
            <label className="text-white font-bold mr-2">
              Style: 
            </label>
              <select 
                className="mb-2 text-black bg-white rounded border shadow-inner w-64"
                disabled={isLoading}
                onChange={(e) => setPaintingStyle(e.target.value)}
                >
                <option value="pop-art">Pop Art</option>
                <option value="impressionism">Impressionism</option>
                <option value="surrealism">Surrealism</option>
                <option value="cubism">Cubism</option>
                <option value="Realism">Realism</option>
              </select>
            <label className="text-white font-bold mr-2">
              Mood: 
            </label>
              <select 
                className="mb-2 text-black bg-white rounded border shadow-inner w-64"
                disabled={isLoading}
                onChange={(e) => setPaintingMood(e.target.value)}
                >
                <option value="serene">Serene</option>
                <option value="joyful">Joyful</option>
                <option value="eerie">Eerie</option>
                <option value="vibrant">Vibrant</option>
                <option value="foreboding">Foreboding</option>
              </select>
            <label className="text-white font-bold mr-2">
              Theme: 
            </label>
              <select 
                className="mb-2 text-black bg-white rounded border shadow-inner w-64"
                disabled={isLoading}
                onChange={(e) => setPaintingTheme(e.target.value)}
                >
                <option value="random">Random</option>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="abstract">Abstract</option>
                <option value="historical">Historical Events</option>
              </select>
          </div>
          {prompt.length < 100 && (
            <button
              className='bg-blue-500 p-2 text-white rounded shadow-xl'
              disabled={isLoading}
              onClick={async () => {
                setImageIsLoading(true)
                setPrompt('Generating...')
                const response = await fetch("api/assistant", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    paintingTheme, paintingStyle, paintingMood
                  }),
                });
                // append({ role: "user", content: `Write an image prompt for a painting in the style of ${paintingStyle}, in the mood of ${paintingMood}, about ${paintingTheme}` });
                const data = await response.json();
                console.log(data);
                // append({ role: 'assistant', content: `${data.prompt}`});
                setPrompt(data.prompt);
                setImageIsLoading(false);
              }}
            >
              Generate Prompt
            </button>
          )}
          {prompt.length > 100 && !isLoading && (
            <><button
              className='bg-blue-500 p-2 text-white rounded shadow-xl mb-2'
              disabled={isLoading}
              onClick={async () => {
                setImageIsLoading(true)
                setPrompt('Generating...')
                const response = await fetch("api/assistant", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({paintingTheme, paintingStyle, paintingMood}),
                });
                const data = await response.json();
                // append({ role: "user", content: `Write an image prompt for a painting in the style of ${paintingStyle}, in the mood of ${paintingMood}, about ${paintingTheme}` });
                // // console.log(data);
                setPrompt(data.prompt);
                setImageIsLoading(false);
              }}
            >
              Generate New Prompt
            </button></>
          )}
          {prompt.length > 100 && !isLoading && (
            <button
            className='bg-red-500 p-2 text-white rounded shadow-xl'
            disabled={isLoading}
            onClick={async () => {
              setImageIsLoading(true)
              const response = await fetch("api/images", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message: prompt,
                }),
              });
              const data = await response.json();
              setImage(data);
              setImageIsLoading(false);
            }}
          >
            Generate image
          </button>
          )}
        </div>
      </div>
      <div className='flex-1 overflow-auto mb-8 p-5' ref={messagesContainerRef}>
        <textarea
          className="border-2 border-gray-300 p-2 rounded-lg w-full h-40 mt-5"
          placeholder={prompt}
        />
        {
          imageIsLoading && (
            <div className='flex justify-center items-center'>
              <div className='loader'>
                <div className='animate-pulse flex space-x-4'>
                  <div className='rounded-full bg-slate-700 h-10 w-10'></div>
                </div>
              </div>
            </div>
          )
        }
        {
          image && (
            <div className='card flex max-w-md py-2 mx-auto stretch'>
              <img src={`data:image/jpeg;base64,${image}`}/>
              <textarea
                className='mt-4 w-full text-white bg-black h-64'
                value={prompt}
                readOnly
              />
            </div>
          )
        }
      </div>
    </div>
  );
}