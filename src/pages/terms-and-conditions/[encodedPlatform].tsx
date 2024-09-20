import { GetStaticPaths, GetStaticProps } from 'next';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const platformSpecificTerms = {
  "Airbnb": "Additional terms specific to Airbnb listings...",
  "Vrbo": "Additional terms specific to Vrbo listings...",
  "Booking.com": "Additional terms specific to Booking.com listings...",
  "CB Island Vacations": "Additional terms specific to CB Island Vacations listings...",
  "IntegrityArizona": "Additional terms specific to IntegrityArizona listings...",
  "Evolve": "Additional terms specific to Evolve listings...",
  "Cleanbnb": "Additional terms specific to Cleanbnb listings...",
  "Casamundo": "Additional terms specific to Casamundo listings...",
  "RedAwning": "Additional terms specific to RedAwning listings...",
  "default": "Additional terms for Tramona listings...",
};

const encodeTermsLink = (platform: string) => {
  return crypto.createHash('sha256').update(platform).digest('hex');
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(platformSpecificTerms).map(platform => ({
    params: { encodedPlatform: encodeTermsLink(platform) }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const encodedPlatform = params?.encodedPlatform as string;
  const platform = Object.keys(platformSpecificTerms).find(p => encodeTermsLink(p) === encodedPlatform) || 'default';
  const additionalTerms = platformSpecificTerms[platform as keyof typeof platformSpecificTerms];

  // Read the static HTML file
  const filePath = path.join(process.cwd(), 'public', 'html', 'tos.html');
  let htmlContent = fs.readFileSync(filePath, 'utf8');

  const platformSpecificSection = `
    <section>
      <h2>Additional Terms for ${platform}</h2>
      <p>${additionalTerms}</p>
    </section>
  `;

  htmlContent = htmlContent.replace('</body>', `${platformSpecificSection}</body>`);

  return {
    props: {
      content: htmlContent,
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
      {/* <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <h2 className="text-xl font-semibold mb-2">{platform}</h2> */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}