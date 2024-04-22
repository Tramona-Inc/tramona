const scrapedData = require('./s3-images.json');

const keysArray = Object.keys(scrapedData);

// const start = keysArray.indexOf(`ATL Downtown! City View! Onsite Parking 1B1B!`);
// const end = keysArray.indexOf(`Atlanta Downtown City View and Free Parking`)
// console.log(start, end);

const seenKeys = {};
let hasDuplicates = false;

for (let key of keysArray) {
    if (seenKeys[key]) {
        console.log(`Duplicate key found: ${key}`);
        hasDuplicates = true;
    } else {
        seenKeys[key] = true;
    }
}

if (!hasDuplicates) {
    console.log("No duplicate keys found.");
}


console.log(Object.keys(scrapedData).length);