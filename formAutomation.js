const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');



const SELECTORS = {
    nameInput: 'input[id="name"]',
    emailInput: 'input[id="email"]',
    phoneInput: 'input[id="phone"]',
    companyInput: 'input[id="company"]',
    dropdownOption: '#option3',
    submitButton: 'button.primary.button',
    successHeading: 'h1',
    before: 'before',
    after: 'after'
};

const SCREENSHOT = {
    before: 'before',
    after: 'after'
};

const FILES = {
    data: './data',
    screenshots: './screenshots',
    dataCSV: 'data.csv'
};

const SITE = 'https://testsite.getjones.com/ExampleForm/';

/**
 * Reads data from a CSV file.
 * 
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Array>} - A promise that resolves to an array of user data objects.
 */
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
}


/**
 * Fills the form with data from the given user object.
 * 
 * @param {puppeteer.Page} page - The Puppeteer page instance.
 * @param {Object} user - The user data object containing name, email, phone, and company.
 */
async function fillForm(page, user) {
    await page.type(SELECTORS.nameInput, user.name);
    await page.type(SELECTORS.emailInput, user.email);
    await page.type(SELECTORS.phoneInput, user.phone);
    await page.type(SELECTORS.companyInput, user.company);
}


/**
 * Selects a dropdown option using the provided selector.
 * 
 * @param {puppeteer.Page} page - The Puppeteer page instance.
 * @param {string} optionSelector - The id selector for the dropdown option to select.
 */
async function selectDropdown(page, optionSelector) {
    await page.evaluate((dropdownOption) => {
        const option = document.querySelector(dropdownOption);
        if (option) {
            option.selected = true;
            option.parentElement;
        }
    }, optionSelector);
}


/**
 * Captures a screenshot of the current page.
 * 
 * @param {puppeteer.Page} page - The Puppeteer page instance.
 * @param {string} fileName - The name of the screenshot file to save.
 * @param {string} type - 'before' or 'after' submit.
 */
async function saveScreenshot(page, user, type) {
    
    const userFolder = createUniqueFolder(user);
    const filePath = `${userFolder}/${type}.png`;
    await page.screenshot({ path: filePath });
}


/**
 * Creates a unique folder based on client details.
 * 
 * @param {Object} user - The user object containing name, email, phone, and company.
 * @returns {string} - The path of the created folder.
 */
function createUniqueFolder(user) {
    const combinedDetails = `${user.name}_${user.phone}`;
    const folderPath = path.join(FILES.screenshots, combinedDetails);;
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    return folderPath;
  }



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
            await saveScreenshot(page, user, SCREENSHOT.before); 
            await Promise.all([
                page.click(SELECTORS.submitButton),
                page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {}),
                page.waitForSelector(SELECTORS.successHeading, { visible: true, timeout: 10000 }).catch(() => {}),
            ]);
            await saveScreenshot(page, user, SCREENSHOT.after); 
            console.log(`${user.name}: Automation completed successfully!`);
        }
    } catch (error) {
        console.log('An error occurred:', error);
    } finally {
        await browser.close();
    }
})();
