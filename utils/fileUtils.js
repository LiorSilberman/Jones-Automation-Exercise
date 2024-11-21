const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

/**
 * Reads data from a CSV file.
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
 * Creates a unique folder based on client details.
 */
function createUniqueFolder(user) {
    const combinedDetails = `${user.name}_${user.phone}`;
    const folderPath = path.join('./screenshots', combinedDetails);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    return folderPath;
}

module.exports = { readCSV, createUniqueFolder };
