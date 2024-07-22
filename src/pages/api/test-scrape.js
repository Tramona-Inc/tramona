import puppeteer, { Browser, Page } from "puppeteer";

void (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://traunseeresidenzen.guestybookings.com/properties');

    await delay(3000);

    const properties = await page.evaluate(() => {
        const results = [];
        // const items = document.querySelectorAll('.property-item'); // Adjust the selector to match the elements you want to scrape
        const items = document.querySelectorAll('div[class*="root-0-2-563"]'); // Select divs with class containing 'root-0-2-563'

        items.forEach((item) => {
            // const title = item.querySelector('.property-title').innerText;
            const title = item.querySelector('[data-qa="property-title"]').innerText;

            results.push({ title });
        });

        return results;
    });

    console.log(properties);

    await browser.close();
})();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// let items = document.querySelectorAll('div[class*="root-0-2-563"]'); // Select divs with class containing 'root-0-2-563'
