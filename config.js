/**
 * Configuration module for the Puppeteer automation script.
 * 
 * Contains constants and selectors used throughout the script, including form field selectors,
 * file paths, screenshot details, and the target site URL.
 */
module.exports = {
    SELECTORS: {
        nameInput: 'input[id="name"]',
        emailInput: 'input[id="email"]',
        phoneInput: 'input[id="phone"]',
        companyInput: 'input[id="company"]',
        dropdownOption: '#option3',
        submitButton: 'button.primary.button',
        successHeading: 'h1',
    },
    SCREENSHOT: {
        before: 'before',
        after: 'after',
    },
    FILES: {
        data: './data',
        screenshots: './screenshots',
        dataCSV: 'data.csv',
    },
    SITE: 'https://testsite.getjones.com/ExampleForm/',
};
