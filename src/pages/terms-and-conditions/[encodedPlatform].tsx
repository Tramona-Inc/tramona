import { GetStaticPaths, GetStaticProps } from 'next';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

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
  const platform = platforms.find(p => encodeTermsLink(p) === encodedPlatform) ?? 'default';

  const baseFilePath = path.join(process.cwd(), 'public', 'html', 'tos.html');
  let baseHtmlContent = fs.readFileSync(baseFilePath, 'utf8');

  const platformFilePath = path.join(process.cwd(), 'public', 'html', `${platform.toLowerCase().replace(/\s+/g, '-')}-tos.html`);
  let platformHtmlContent = '';

  try {
    platformHtmlContent = fs.readFileSync(platformFilePath, 'utf8');
  } catch (error) {
    console.warn(`No specific terms file found for ${platform}. Using default content.`);
    platformHtmlContent = '<p>No additional terms for this platform.</p>';
  }

  const combinedContent = baseHtmlContent.replace('</body>', `
    <h2>Additional Terms for ${platform}</h2>
    ${platformHtmlContent}
    </body>
  `);

  return {
    props: {
      content: combinedContent,
      platform
    }
  };
};

interface TermsPageProps {
  content: string;
  platform: string;
}

export default function TermsPage({ content, platform }: TermsPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}