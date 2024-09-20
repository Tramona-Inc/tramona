import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';

export const getStaticProps: GetStaticProps = async () => {
  const baseFilePath = path.join(process.cwd(), 'public', 'html', 'tos.html');
  let baseHtmlContent = fs.readFileSync(baseFilePath, 'utf8');

  return {
    props: {
      content: baseHtmlContent,
    }
  };
};

interface TermsPageProps {
  content: string;
}

export default function DefaultTermsPage({ content }: TermsPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}