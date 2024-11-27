const validator = require('validator');


/**
 * Fills the form with data from the given user object.
 * 
 * @param {Object} SELECTORS - An object containing the selectors for form inputs.
 * @param {Object} page - Puppeteer page object used to interact with the browser.
 * @param {Object} user - User object containing data to populate the form.
 * @throws {Error} Throws an error if the SELECTORS are incorrect or an issue occurs while typing.
 */
async function fillForm(SELECTORS, page, user) {
    try{
        await page.type(SELECTORS.nameInput, user.name);
        await page.type(SELECTORS.emailInput, user.email);
        await page.type(SELECTORS.phoneInput, user.phone);
        await page.type(SELECTORS.companyInput, user.company);
    } catch{
        throw new Error('In fillForm function: Check SELCTORS names');
    }
}


/**
 * Selects a dropdown option using the provided selector.
 * 
 * @param {Object} page - Puppeteer page object used to interact with the browser.
 * @param {string} optionSelector - Selector for the dropdown option to be selected.
 * @throws {Error} Throws an error if the dropdown option cannot be found.
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
 * Validates user data to ensure names, emails, phone numbers, and company values are valid.
 * 
 * @param {Array<Object>} users - Array of user objects to be validated.
 * @throws {Error} Throws an error if any user data is invalid or missing.
 */
function isValidData(users){

    try{
        for (const user of users){
            if (!isValidName(user.name)){
                throw new Error(`Invalid name for user: ${user.name}.`);
            }
            if (!isValidAsciiEmail(user.email)) {
                throw new Error(`Invalid email format for user: ${user.email}`);
            }

            if (!validator.isMobilePhone(user.phone, "any")){
                throw new Error(`Invalid phone number format for user: ${user.phone}`);
            }
            if (!user.company){
                throw new Error('Please check your data.csv for missing values.');
            }
        }
    }catch (error){
        throw new Error(`An error occurred: ${error.message}`);
    }
}


/**
 * Checks if a name is valid.
 * 
 * @param {string} name - The name to validate.
 * @returns {boolean} Returns true if the name is valid, false otherwise.
 */
function isValidName(name) {
    const nameRegex = /^[\p{L}]+(?:[\p{L}' -][\p{L}]+)*$/u;

    return (
        typeof name === "string" &&
        validator.isLength(name, { min: 1, max: 50 }) &&
        nameRegex.test(name)
    );
}


/**
 * Checks if an email is valid and restricted to ASCII characters.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} Returns true if the email is valid, false otherwise.
 */
function isValidAsciiEmail(email) {
    return validator.isEmail(email) && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

module.exports = { fillForm, selectDropdown, isValidData };
