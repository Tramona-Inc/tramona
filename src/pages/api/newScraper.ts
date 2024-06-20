// import {NextApiRequest, NextApiResponse} from 'next';
// import puppeteer, {Browser, Page} from 'puppeteer';

// const urls = [
//     "https://vayadu.kross.travel/it/appartamenti",
//     "https://casadasuite.kross.travel/book/step1",
//     "https://salentoinfotour.kross.travel/it/strutture",
//     "https://homielivings.kross.travel/it/appartamenti",
//     "https://sudest.kross.travel/it/strutture",
//     "https://affittibreviliguria.kross.travel/it/appartamenti",
//     "https://deniacosta.kross.travel/es/apartamentos",
//     "https://arcasuite.kross.travel/it/appartamenti",
//     "https://thefamilynest.kross.travel/it/camere",
//     "https://nicevacation.kross.travel/it/camere",
//     "https://casevacanzesanteodoro.kross.travel/it/appartamenti",
//     "https://kibilu.kross.travel/it/camere",
//     "https://ihost.kross.travel/it/appartamenti?_gl=1*1k4jitr*_up*MQ..*_ga*MTYyNjMyMTU1Ny4xNzE3MTkxMTU2*_ga_MZ4DBQ8FYM*MTcxNzE5MTE1MS4xLjAuMTcxNzE5MTE1MS4wLjAuMA..",
//     "https://housmart.kross.travel/it/appartamenti",
//     "https://apservice.kross.travel/it/strutture",
//     "https://openhouseimobiliare.kross.travel/en/apartments",
//     "https://holidayhomes.kross.travel/it/alloggi",
//     "https://camelotels.kross.travel/en/accommodations",
//     // "https://travelandstay.kross.travel/en/accommodations",
//     // "https://casakollmann.kross.travel/it/camere",
//     // "https://casakollmann.kross.travel/it/camere",
//     // "https://larihome.kross.travel/",
//     // "https://ciudaddevacaciones.kross.travel/es/apartamentos",
//     // "https://ihome.kross.travel/it/camere",
//     // "https://theurbanhosts.kross.travel/es/apartamentos",
//     // "https://yourhost.kross.travel/en/accommodations",
//     // "https://scappoinumbria.kross.travel/en/apartments",
//     // "https://medano4you.kross.travel/es/apartamentos",
//     // "https://lionhost.kross.travel/it/appartamenti",
//     // "https://stopesleepudine.kross.travel/it/camere",
//     // "https://houseflo.kross.travel/it/appartamenti",
//     // "https://italianrivierarent.kross.travel/it/camere",
//     // "https://pollonsrl.kross.travel/en/rooms",
//     // "https://floapartments.kross.travel/it/camere",
//     // "https://hostly.kross.travel/it/appartamenti",
//     // "https://bbtreviso.kross.travel/en/properties",
//     // "https://holive.kross.travel/it/appartamenti",
//     // "https://piazzettaimmobiliare.kross.travel/it/appartamenti",
//     // "https://holive.kross.travel/it/appartamenti",
//     // "https://cozyhost.kross.travel/en/rooms",
//     // "https://alquilervacacionalcadiz.kross.travel/es/apartamentos",
//     // "https://venicecera.kross.travel/en/apartments?r=1",
//     // "https://chiaimmobiliare.kross.travel/it/appartamenti",
//     // "https://thomasdeflorian.kross.travel/it/appartamenti",
//     // "https://sbhospitality.kross.travel/it/appartamenti",
//     // "https://poloturisticoumbria.kross.travel/en/apartments",
//     // "https://sciclialbergodiffuso.kross.travel/it/camere",
//     // "https://triestereception.kross.travel/it/appartamenti",
//     // "https://casaboutique.kross.travel/es/habitaciones",
//     // "https://ibizadirectstay.kross.travel/it/appartamenti",
//     // "https://affittasardegna.kross.travel/en/apartments",
//     // "https://mylodgingfy.kross.travel/es/apartamentos",
//     // "https://welcome2pisa.kross.travel/it/appartamenti",
//     // "https://hubbnbsrls.kross.travel/it/appartamenti",
//     // "https://notami.kross.travel/it/appartamenti",
//     // "https://mg.kross.travel/it/appartamenti",
//     // "https://vearhausing.kross.travel/it/appartamenti",
//     // "https://agriturismobio4stagioni.kross.travel/it/camere",
//     // "https://lalagunasomiedo.kross.travel/es/apartamentos",
//     // "https://caprichosdesevilla.kross.travel/es/apartamentos",
//     // "https://artapartmentflorence.kross.travel/en/apartments",
//     // "https://gardappartamenti.kross.travel/it/appartamenti",
//     // "https://chicstays.kross.travel/es/apartamentos",
//     // "https://sottocosta.kross.travel/it/strutture",
//     // "https://feelathomesrl.kross.travel/en/rooms",
//     // "https://hispaces.kross.travel/en/rooms",
//     // "https://roaminginrome.kross.travel/it/camere",
//     // "https://holihome.kross.travel/it/appartamenti",
//     // "https://bestwayrent.kross.travel/en/apartments",
//     // "https://newtopique.kross.travel/it/appartamenti",
//     // "https://reguesthouse.kross.travel/it/camere",
//     // "https://pugliamare.kross.travel/it/strutture",
//     // "https://italstay.kross.travel/it/appartamenti",
//     // "https://luxuryapartmentsvenice.kross.travel/it/appartamenti",
//     // "https://casacafe.kross.travel/es/habitaciones",
//     // "https://barirooms.kross.travel/it/camere",
//     // "https://elcagigal.kross.travel/es/apartamentos",
//     // "https://dvcapartments.kross.travel/it/appartamenti",
//     // "https://xeniamilano.kross.travel/it/appartamenti",
//     // "https://getthekey.kross.travel/it/appartamenti",
//     // "https://bestate.kross.travel/it/appartamenti",
//     // "https://stayinromeapartments.kross.travel/it/appartamenti",
//     // "https://wanderlustexperience.kross.travel/it/camere",
//     // "https://magentacollection.kross.travel/en/properties",
//     // "https://itshome.kross.travel/it/appartamenti",
//     // "https://stagabin.kross.travel/it/appartamenti",
//     // "https://winepairings.kross.travel/it/alloggi",
//     // "https://ariele.kross.travel/it/appartamenti",
//     // "https://letuevacanzeinpuglia.kross.travel/it/appartamenti",
//     // "https://innpisarentals.kross.travel/it/appartamenti",
//     // "https://atlasapartments.kross.travel/it/appartamenti",
//     // "https://weloveroma.kross.travel/it/strutture",
//     // "https://anticacivita.kross.travel/it/camere",
//     // "https://mamahouse.kross.travel/it/appartamenti",
//     // "https://ngguesthouse.kross.travel/it/camere",
//     // "https://cortinastyle.kross.travel/it/appartamenti",
//     // "https://easybb.kross.travel/it/appartamenti",
//     // "https://shurapartments.kross.travel/it/appartamenti",
//     // "https://suitesyou.kross.travel/en/apartments",
//     // "https://pulcinofurioso.kross.travel/it/appartamenti",
//     // "https://exporesidencerho.kross.travel/it/camere",
//     // "https://apuliaaccommodation.kross.travel/it/strutture",
//     // "https://memoriesinflorence.kross.travel/it/appartamenti",
//     // "https://maremmaholidays.kross.travel/it/appartamenti",
//     // "https://stasiproperties.kross.travel/en/apartments",
//     // "https://keytovillas.kross.travel/it/ville",
//     // "https://sevesoschiaparelli.kross.travel/it/appartamenti",
//     // "https://stasiproperties.kross.travel/en/apartments",
//     // "https://apulianstay.kross.travel/it/appartamenti",
//     // "https://autenticaortigia.kross.travel/it/camere",
//     // "https://albadea.kross.travel/it/strutture",
//     // "https://sgherri.kross.travel/it/appartamenti",
//     // "https://bariaccomodations.kross.travel/it/appartamenti",
//     // "https://iflatdolomiti.kross.travel/it/appartamenti",
//     // "https://appratamentosonofrio.kross.travel/it/appartamenti",
//     // "https://pinusvillage.kross.travel/it/appartamenti",
//     // "https://momiflats.kross.travel/it/appartamenti",
//     // "https://roamatic.kross.travel/it/appartamenti",
//     // "https://mylodgingfy.kross.travel/es/apartamentos",
//     // "https://rentalbenidorm.kross.travel/en/apartments",
//     // "https://sweetdreamsinflorence.kross.travel/it/camere",
//     // "https://alpstay.kross.travel/en/apartments",
//     // "https://flexyrent.kross.travel/it/appartamenti",
//     // "https://floapartments.kross.travel/it/camere",
//     // "https://rentalsevilla.kross.travel/es/alojamientos",
//     // "https://theurbanhosts.kross.travel/en/apartments",
//     // "https://tenutasangiovanni.kross.travel/it/camere",
//     // "https://venicevillas.kross.travel/en/rooms",
//     // "https://travelandstay.kross.travel/de/unterkuenfte",
//     // "https://oidahome.kross.travel/de/wohnungen",
//     // "https://sevillaluxurysuites.kross.travel/en/apartments",
//     // "https://biancoeblu.kross.travel/en/apartments",
//     // "https://medano4you.kross.travel/es/apartamentos",
//     // "https://checkincheckoutfacile.kross.travel/en/apartments",
//     // "https://houseflo.kross.travel/en/apartments",
//     // "https://rentalbenidorm.kross.travel/en/apartments",
//     // "https://oldtownflats.kross.travel/en/apartments",
//     // "https://maisonmetropole.kross.travel/es/habitaciones",
//     // "https://hacca.kross.travel/book/step1",
//     // "https://travelandstay.kross.travel/en/accommodations",
//     // "https://tenutasangiovanni.kross.travel/it/camere",
//     // "https://camelotels.kross.travel/en/accommodations",
//     // "https://flexyrent.kross.travel/it/appartamenti",
//     // "https://flimmobiliare.kross.travel/en/properties",
//     // "https://guesth4u.kross.travel/en/apartments",
//     // "https://scappoinumbria.kross.travel/en/apartments",
//     // "https://flexyrent.kross.travel/it/appartamenti",
//     // "https://alpstay.kross.travel/en/apartments",
//     // "https://mg.kross.travel/it/appartamenti",
//     // "https://www.cleanbnb.house/it/appartamenti",
// ]

// export default async(req: NextApiRequest, res: NextApiResponse) => {
//     try{
//         let propertyData = {}

//         for(const url of urls) {
//             const browser = await puppeteer.launch({
//                 headless: false,
//                 protocolTimeout: 4000000,
//                  args: [
//                    `--window-size=1920,1080`,
//                    "--disable-background-timer-throttling",
//                    "--disable-backgrounding-occluded-windows",
//                    "--disable-renderer-backgrounding",
//                  ],
//                  defaultViewport: {
//                    width: 1920,
//                    height: 1080,
//                  },
//                     })
//             const page = await browser.newPage();
//             const newData = await scrapeUrl(browser, page, url, propertyData); // Retrieve data from scrapeUrl function
//             propertyData = { ...propertyData, ...newData };
//             console.log(propertyData);
//             console.log("done with ", url);
//             await browser.close();
//           }
//     } catch {

//     }

// }

// async function scrapeUrl(
//   browser: Browser,
//   page: Page,
//   url: string,
//   propertyData: Record<string, any>
// ) {
//       let tempData = propertyData;
//       const openedPages: Page[] = [];
//       // await page.goto(url, { waitUntil: "domcontentloaded" });
//       await page.goto(url);
//       // await delay(3000);

//       // const title = await page.evaluate(() => document.title);
//       // return {title: title}
//       // async function scrollDownUntilNoChange(page: Page) {
//       // let previousScrollHeight = 0;
//       // let currentScrollHeight = -1;

//     //   while (previousScrollHeight !== currentScrollHeight) {
//     //     previousScrollHeight = currentScrollHeight;

//     //     try {
//     //       currentScrollHeight = await page.evaluate(async () => {
//     //         let element;

//     //         const overflowYScrollElement =
//     //           document.querySelector(".overflow-y-scroll");

//     //         await new Promise((resolve) => setTimeout(resolve, 1500));

//     //         if (overflowYScrollElement) {
//     //           element = overflowYScrollElement;
//     //         } else {
//     //           element = document.documentElement;
//     //         }
//     //         if (element) {
//     //           element.scrollTo(0, element.scrollHeight);
//     //         }
//     //         await new Promise((resolve) => setTimeout(resolve, 1500));
//     //         return element ? element.scrollHeight : -1;
//     //       });
//     //     } catch (err) {
//     //       console.log("error inside scroll", err);
//     //     }
//     //   }
//     // } 
//     const propertySelecter = await page.evaluate( () => {
//       const div = document.querySelector('div[class*=#propertiesResultContainer]')
//       return div ? (div.children.length / 2) : 0;
//     })
// }

// const delay = (ms : number) => {new Promise((resolve) => {setTimeout(resolve, ms)})}