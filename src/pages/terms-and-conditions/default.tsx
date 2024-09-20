// src/pages/terms-and-conditions/default.tsx
import { useEffect, useState } from 'react';

export default function DefaultTermsPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/terms-and-conditions/default');
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Failed to fetch terms:', error);
        setContent('<p>Failed to load terms. Please try again later.</p>');
      }
    };

    void fetchContent();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <iframe srcDoc={content} style={{ width: '100%', height: '100vh', border: 'none' }} />
    </div>
  );
}