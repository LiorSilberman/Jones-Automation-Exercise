/**
 * Fills the form with data from the given user object.
 */
async function fillForm(page, user) {
    await page.type('input[id="name"]', user.name);
    await page.type('input[id="email"]', user.email);
    await page.type('input[id="phone"]', user.phone);
    await page.type('input[id="company"]', user.company);
}

/**
 * Selects a dropdown option using the provided selector.
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

module.exports = { fillForm, selectDropdown };
