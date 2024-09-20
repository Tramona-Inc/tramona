// pages/api/terms/[encodedPlatform].ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
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

// Add this function to log encoded URLs
const logEncodedUrls = () => {
  console.log("Encoded URLs for each platform:");
  platforms.forEach(platform => {
    const encodedUrl = encodeTermsLink(platform);
    console.log(`${platform}: /terms/${encodedUrl}`);
  });
};

// Call the logging function
logEncodedUrls();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { encodedPlatform } = req.query;
  const platform = platforms.find(p => encodeTermsLink(p) === encodedPlatform) ?? 'default';

  const baseFilePath = path.join(process.cwd(), 'public', 'html', 'tos.html');
  const baseHtmlContent = fs.readFileSync(baseFilePath, 'utf8');

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

  res.setHeader('Content-Type', 'text/html');
  res.send(combinedContent);
}