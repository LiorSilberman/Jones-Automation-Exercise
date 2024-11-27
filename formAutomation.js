const puppeteer = require('puppeteer');
const path = require('path');
const { readCSV, createUniqueFolder } = require('./utils/fileUtils');
const { fillForm, selectDropdown, isValidData } = require('./utils/formUtils');
const { saveScreenshot } = require('./utils/screenshotUtils');
const { SELECTORS, FILES, SCREENSHOT, SITE } = require('./config');


/**
 * Main script to automate form filling and data validation using Puppeteer.
 * 
 * Reads user data from a CSV file, validates it, and fills a form on a website for each user.
 * Takes screenshots before and after submission and handles errors gracefully.
 */
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    try {
        const users = await readCSV(path.join(FILES.data, FILES.dataCSV));
        isValidData(users);

        for (const user of users) {
            await page.goto(SITE, { timeout: 60000 });
            await page.waitForSelector(SELECTORS.nameInput, { visible: true, timeout: 10000 }).catch(() => {
                throw new Error(`Selector not found: ${SELECTORS.nameInput}`);
            });

            await fillForm(SELECTORS, page, user);
            await selectDropdown(page, SELECTORS.dropdownOption).catch(() => {
                throw new Error(`Selector not found: ${SELECTORS.dropdownOption}`);
            });
            await saveScreenshot(page, user, SCREENSHOT.before, createUniqueFolder);

            await Promise.all([
                page.click(SELECTORS.submitButton),
                page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch((error) => {
                    throw new Error(`Navigation failed: ${error.message}`);
                }),
                page.waitForSelector(SELECTORS.successHeading, { visible: true, timeout: 10000 }).catch(() => {
                    throw new Error(`Selector not found: ${SELECTORS.successHeading}`);
                }),
            ]);

            await saveScreenshot(page, user, SCREENSHOT.after, createUniqueFolder);
            console.log(`${user.name}: Automation completed successfully!`);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        await browser.close();
    }
})();
