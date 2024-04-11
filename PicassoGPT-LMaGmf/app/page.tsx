'use client';
 
import { useEffect, useRef, useState } from 'react';

const paintingThemes: string[] = [
  "Landscape",
  "Portrait",
  "Still Life",
  "Abstract",
  "Cityscape",
  "Seascape",
  "Wildlife",
  "Floral",
  "Fantasy",
  "Historical",
  "Surrealism",
  "Impressionism",
  "Expressionism",
  "Realism",
  "Modernism"
];
 
export default function Chat() {

  const defaultPrompt = "Click 'Generate Prompt' to generate a prompt.";

  const [paintingTheme, setPaintingTheme] = useState(paintingThemes[0]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="mx-4">
      <h1 className="text-4xl">Picasso Painting Generator</h1>
      <div className="flex w-full h-screen max-w-7xl py-12 mx-auto items-stretch">
        <div className="flex flex-col w-1/4 h-full p-4 bg-gray-100 rounded-lg">
          <label className="text-black font-bold mr-2">
              Painting Themes: 
          </label>
          <select 
            className="mb-2 text-black bg-white rounded border shadow-inner w-32"
            onChange={(e) => setPaintingTheme(e.target.value)}
            >
            {paintingThemes.map((theme) => (
               <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
          <br />
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              setPrompt('Generating Prompt...')
              const response = await fetch("api/aitextassistant", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paintingTheme
                }),
              });
              const data = await response.json();
              console.log(data);
              setPrompt(data.prompt);
              setIsLoading(false);
            }}
            >
            Generate Prompt
          </button>
          <br />
          {prompt !== defaultPrompt && prompt.length > 10 && (
            <button 
              className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true)
                const response = await fetch("api/aiimagegenerator", {
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
                setIsLoading(false);
              }}
              >
              Generate Image
            </button>
        )}
        </div>
        <div className="flex flex-col w-3/4 h-full p-4 bg-gray-100 rounded-lg">
          <label className="text-black font-bold mr-2">
            Generated Prompt
          </label>
          <textarea 
            className="w-full h-1/2 p-4 bg-white rounded-lg" 
            placeholder={defaultPrompt}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value) } 
            />
          {image && (
          <img 
            className="w-full h-1/2 p-4 bg-white rounded-lg"
            src={`data:image/jpeg;base64,${image}`}
            />
          )}
          {!image && (
          <img 
            className="w-full h-1/2 p-4 bg-white rounded-lg"
            src="https://via.placeholder.com/1024x1024" 
            />
          )}
         </div>
    </div>
   </div>
  );
}