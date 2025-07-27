
'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

export default function Home() {
  const [chatId, setChatId] = useState<string>('');
  const [model, setModel] = useState<string>('gpt');
  const [style, setStyle] = useState<string>('default');
  const [instructions, setInstructions] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe) {
      const id = window.Telegram.WebApp.initDataUnsafe.user?.id;
      setChatId(id);
      window.Telegram.WebApp.ready();
    }
  }, []);

  const handleSubmit = async () => {
    if (!chatId || !image) return alert('Please select image and wait for Telegram to load');
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('model', model);
    formData.append('style', style);
    formData.append('instructions', instructions);
    formData.append('image', image);

    await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    });

    if (window.Telegram?.WebApp?.close) window.Telegram.WebApp.close();
  };

  return (
    <main>
      <h1>AI Redesign Tool</h1>
      <div>
        <label>Choose Model:</label>
        <select onChange={(e) => setModel(e.target.value)} value={model}>
          <option value="gpt">GPT-Image</option>
          <option value="google">Google (Replicate)</option>
        </select>
      </div>
      <div>
        <label>Choose Style:</label>
        <select onChange={(e) => setStyle(e.target.value)} value={style}>
          <option value="default">Default</option>
          <option value="vintage">Vintage</option>
          <option value="horror">Horror</option>
          <option value="patriotic">Patriotic</option>
          <option value="funny">Funny</option>
        </select>
      </div>
      <div>
        <label>Additional Instructions:</label>
        <textarea
          placeholder="e.g. Add fireworks background..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      <div>
        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      </div>
      <button onClick={handleSubmit} disabled={!image || !chatId}>Submit</button>
    </main>
  );
}
