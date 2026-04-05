# FinView — Finance Dashboard

A simple, clean finance dashboard to track income, expenses, and spending patterns.

---


## Project Structure

```
finance-dashboard/
├── index.html      → Page layout and HTML structure
├── style.css       → All styles and responsive design
├── data.js         → Sample transaction data + localStorage helpers
├── app.js          → All application logic and interactivity
└── README.md       → This file
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| HTML5 | Page structure and markup |
| CSS3 | Styling, layout (CSS Grid, Flexbox), animations |
| Vanilla JavaScript | All interactivity and logic — no framework |
| [Chart.js 4.4](https://www.chartjs.org/) | Line chart and doughnut chart (via CDN) |
| Google Fonts (Inter) | Typography (via CDN) |
| localStorage | Persisting transaction data across page reloads |

No npm, no build tools, no framework — just open the file and it works.

---

## Features

### Dashboard
- Summary cards showing total balance, income, and expenses
- Line chart showing income vs expenses by month
- Doughnut chart showing spending breakdown by category
- Table of the 5 most recent transactions

### Transactions
- Full list of all transactions
- Search by description or category
- Filter by type (income / expense) and by category
- Sort by date or amount (ascending / descending)
- Export current view to CSV

### Insights
- Highest spending category
- Month-over-month expense comparison
- Savings rate (% of income saved)
- Average monthly spending
- Horizontal bar chart of top 5 categories

### Role-Based UI
Switch between two roles using the dropdown in the sidebar:

- **Viewer** — can browse, filter, search, and export data
- **Admin** — additionally can add new transactions and delete existing ones

This is a frontend-only simulation. Switching roles changes a CSS class on the page which shows or hides admin controls. No backend or authentication is involved.

---

## State Management

All state is managed with plain JavaScript variables:

- `transactions` — the main array of transaction objects
- Filters (search, type, category, sort) — read directly from DOM inputs when needed
- Role — stored as a CSS class on the shell element

Transactions are saved to `localStorage` so data persists between page refreshes.

---

## Assumptions

- Currency is Indian Rupees (₹)
- Sample data covers November 2024 to January 2025
- Role switching is for UI demonstration only — there is no real authentication
