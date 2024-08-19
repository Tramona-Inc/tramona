import { directSiteScrapers } from './index';

async function runScrapers() {
  for (const scraper of directSiteScrapers) {
    try {
      console.log(`Running scraper: ${scraper.name}`);
      const results = await scraper();
      console.log(`Scraper ${scraper.name} finished. Found ${results.length} properties.`);
      
      // Here you would typically save the results to your database
      // For now, let's just log the first result
      if (results.length > 0) {
        console.log('First property:', JSON.stringify(results[0], null, 2));
      }
    } catch (error) {
      console.error(`Error running scraper ${scraper.name}:`, error);
    }
  }
}

runScrapers().catch(console.error);