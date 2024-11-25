# Jones-Automation-Exercise

## Automated Form Submission with Puppeteer

This project automates the process of submitting a web form using [Puppeteer](https://pptr.dev/), a Node.js library for browser automation. It reads user data from a CSV file, fills out the form, captures screenshots before and after submission, and saves them in user-specific folders.

---

## **Features**

- Read user data from a CSV file
- Automates form submission using Puppeteer.
- Captures screenshots of the form before and after submission.
- Organizes screenshots in unique folders for each user.
- Handles dynamic dropdown selection.

---

## **Project Structure**
```bash
Jones-Automation-Exercise/ 
├── formAutomation.js # Main script to orchestrate the automation 
├── config.js # Configuration constants for selectors, file paths, and URLs 
├── utils/ # Utility functions 
│ ├── fileUtils.js # File handling utilities (readCSV, createUniqueFolder)
│ ├── formUtils.js # Puppeteer form utilities (fillForm, selectDropdown) 
│ └── screenshotUtils.js # Screenshot management utilities 
├── data/ # Input data 
│ └── data.csv # CSV file containing user details 
├── screenshots/ # Output screenshots
└── package.json # Project dependencies and scripts
└── package-lock.json # Project dependencies and scripts
```

---

## **Installation**

### **1. Clone the Repository**

```bash
git clone https://github.com/LiorSilberman/Jones-Automation-Exercise.git
cd Jones-Automation-Exercise
```

### **2. Install Dependencies**
Ensure you have Node.js installed, then run:
```bash
npm install
```

---

## **Usage**

### **1. Add Your Data**
Place a CSV file with the following format in the `data/` folder:
```bash
name,email,phone,company
Lior Silberman,lior@example.com,1234567890,Jones Software
Jane Doe,jane.doe@example.com,9876543210,Example Corp
```

### **2. Run the Script**
Run the automation script with:
```bash
node formAutomation.js
```

### **3. View Screenshots**
Screenshots for each user will be saved in the `screenshots/` folder. Each user will have a unique subfolder named after their details.

---

## **Configuration**

You can customize the following settings in `config.js`:
- **Selectors:** Update form field and button selectors if they change.
- **File Paths:** Modify paths for input/output files.
- **Site URL:** Change the target site for automation.

---

## **Dependencies**

- [Puppeteer](https://pptr.dev/): Browser automation library.
- [csv-parser](https://www.npmjs.com/package/csv-parser): Parses CSV files.

Install them with:
```bash
npm install puppeteer csv-parser
```

---

## **Example Workflow**

### **1. The script reads user details from data.csv.**
### **2. It navigates to the form page and fills in the user's details.**
### **3. A screenshot is captured before submission (`before.png`).**
### **4. The form is submitted, and the script waits for a success confirmation.**
### **5. A screenshot is captured after submission (`after.png`).**
