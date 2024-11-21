/**
 * Captures a screenshot of the current page.
 */
async function saveScreenshot(page, user, type, createFolderCallback) {
    const userFolder = createFolderCallback(user);
    const filePath = `${userFolder}/${type}.png`;
    await page.screenshot({ path: filePath });
}

module.exports = { saveScreenshot };
