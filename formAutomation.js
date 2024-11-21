const puppeteer = require('puppeteer');
const path = require('path');
const { readCSV, createUniqueFolder } = require('./utils/fileUtils');
const { fillForm, selectDropdown } = require('./utils/formUtils');
const { saveScreenshot } = require('./utils/screenshotUtils');
const { SELECTORS, FILES, SCREENSHOT, SITE } = require('./config');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    try {
        const users = await readCSV(path.join(FILES.data, FILES.dataCSV));

        for (const user of users) {
            await page.goto(SITE, { timeout: 60000 });
            await page.waitForSelector(SELECTORS.nameInput, { visible: true, timeout: 10000 });

            await fillForm(page, user);
            await selectDropdown(page, SELECTORS.dropdownOption);
            await saveScreenshot(page, user, SCREENSHOT.before, createUniqueFolder);

            await Promise.all([
                page.click(SELECTORS.submitButton),
                page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {}),
                page.waitForSelector(SELECTORS.successHeading, { visible: true, timeout: 10000 }).catch(() => {}),
            ]);

            await saveScreenshot(page, user, SCREENSHOT.after, createUniqueFolder);
            console.log(`${user.name}: Automation completed successfully!`);
        }
    } catch (error) {
        console.log('An error occurred:', error);
    } finally {
        await browser.close();
    }
})();
