# ExpenseFlow

A modern and responsive Expense Tracker web application built using HTML, CSS and JavaScript.

## Features

### Core Features

- Add income transactions
- Add expense transactions
- Enter amount, category, date and description
- Edit existing transactions
- Delete transactions
- View total income
- View total expenses
- View current balance
- Filter transactions by type
- Filter transactions by category
- Data persistence using browser Local Storage
- Responsive design for desktop, tablet and mobile devices

### Bonus Features

- Monthly financial summary
- Monthly income, expenses and savings
- Expense ratio progress bar
- Category-wise expense chart
- Form validation
- Helpful error messages
- Toast notifications
- Category-specific icons

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Browser Local Storage
- HTML Canvas API
- Font Awesome
- Google Fonts

## How to Run

### Method 1 — Open directly

1. Download or clone this repository.
2. Open the project folder.
3. Double-click `index.html`.

The application will open in your browser.

### Method 2 — VS Code Live Server

1. Open the project folder in Visual Studio Code.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## Data Storage

Transactions are stored in the browser's Local Storage.

Therefore:

- Data remains available after refreshing the page.
- No backend or database is required.
- Data is stored locally on the user's device/browser.

Clearing the browser's Local Storage will remove the saved transactions.

## Project Structure

```text
expense-tracker-jithisha/
│
├── index.html
├── style.css
├── script.js
└── README.md