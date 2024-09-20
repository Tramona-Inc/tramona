// src/pages/terms-and-conditions/[encodedPlatform].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import crypto from 'crypto';

const platforms = [
  "CB Island Vacations",
  "IntegrityArizona",
  "Evolve",
  "Cleanbnb",
  "Casamundo",
  "RedAwning",
  "default"
];

const encodeTermsLink = (platform: string) => {
  return crypto.createHash('sha256').update(platform).digest('hex');
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = platforms.map(platform => ({
    params: { encodedPlatform: encodeTermsLink(platform) }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const encodedPlatform = params?.encodedPlatform as string;
  return { props: { encodedPlatform } };
};

interface TermsPageProps {
  encodedPlatform: string;
}

export default function TermsPage({ encodedPlatform }: TermsPageProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/terms-and-conditions/${encodedPlatform}`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Failed to fetch terms:', error);
        setContent('<p>Failed to load terms. Please try again later.</p>');
      }
    };

    void fetchContent();
  }, [encodedPlatform]);

  return (
    <div className="container mx-auto py-8">
      <iframe srcDoc={content} style={{ width: '100%', height: '100vh', border: 'none' }} />
    </div>
  );
}