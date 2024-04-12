const scrapedData = require('./scrape-data.json');

const keysArray = Object.keys(scrapedData);
const start = keysArray.indexOf(`La Costa Beach House - Malibu Beachfront Villa`);
const end = keysArray.indexOf(`Beverly Hills Canyon Villa`)
console.log(end - start);


console.log(Object.keys(scrapedData).length);