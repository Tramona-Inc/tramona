const scrapedData = require('./scraped-dates-minus.json');

const keysArray = Object.keys(scrapedData);
const start = keysArray.indexOf(`Ozark Spring Cabin Rock Bluff 03 King Bed, Spa Tub`);
const end = keysArray.indexOf(`New Remodel, Slps 2, Modern feel, Historic Town`)
console.log(end - start);


console.log(Object.keys(scrapedData).length);