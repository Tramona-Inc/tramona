import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com'); // Replace with the URL you want to scrape

    // Example: Scrape all paragraph texts
    const paragraphs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('p')).map(p => p.textContent);
    });

    await browser.close();

    res.status(200).json({ success: true, data: paragraphs });
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ success: false, error: 'Scraping failed' });
  }
}