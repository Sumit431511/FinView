// ============================================
//  MOCK DATA
//  This file holds sample transactions used
//  to populate the dashboard on first load.
// ============================================

const defaultTransactions = [
  { id: 1,  date: "2024-11-05", desc: "Salary",            cat: "Salary",        type: "income",  amount: 65000 },
  { id: 2,  date: "2024-11-08", desc: "Grocery Store",     cat: "Food",          type: "expense", amount: 2800  },
  { id: 3,  date: "2024-11-12", desc: "Netflix",           cat: "Entertainment", type: "expense", amount: 649   },
  { id: 4,  date: "2024-11-14", desc: "Freelance Project", cat: "Freelance",     type: "income",  amount: 18000 },
  { id: 5,  date: "2024-11-18", desc: "Electricity Bill",  cat: "Utilities",     type: "expense", amount: 1200  },
  { id: 6,  date: "2024-11-22", desc: "Amazon Shopping",   cat: "Shopping",      type: "expense", amount: 3500  },
  { id: 7,  date: "2024-11-25", desc: "Doctor Visit",      cat: "Health",        type: "expense", amount: 800   },
  { id: 8,  date: "2024-11-28", desc: "Cab Rides",         cat: "Transport",     type: "expense", amount: 950   },
  { id: 9,  date: "2024-12-05", desc: "Salary",            cat: "Salary",        type: "income",  amount: 65000 },
  { id: 10, date: "2024-12-07", desc: "Restaurant",        cat: "Food",          type: "expense", amount: 1600  },
  { id: 11, date: "2024-12-10", desc: "Gym Membership",    cat: "Health",        type: "expense", amount: 1500  },
  { id: 12, date: "2024-12-15", desc: "Freelance Project", cat: "Freelance",     type: "income",  amount: 22000 },
  { id: 13, date: "2024-12-18", desc: "Movie Tickets",     cat: "Entertainment", type: "expense", amount: 700   },
  { id: 14, date: "2024-12-22", desc: "Grocery Store",     cat: "Food",          type: "expense", amount: 3100  },
  { id: 15, date: "2024-12-28", desc: "Internet Bill",     cat: "Utilities",     type: "expense", amount: 999   },
  { id: 16, date: "2025-01-05", desc: "Salary",            cat: "Salary",        type: "income",  amount: 65000 },
  { id: 17, date: "2025-01-09", desc: "New Shoes",         cat: "Shopping",      type: "expense", amount: 4200  },
  { id: 18, date: "2025-01-13", desc: "Food Delivery",     cat: "Food",          type: "expense", amount: 1800  },
  { id: 19, date: "2025-01-17", desc: "Freelance Project", cat: "Freelance",     type: "income",  amount: 15000 },
  { id: 20, date: "2025-01-24", desc: "Pharmacy",          cat: "Health",        type: "expense", amount: 620   },
];

// Load from localStorage if available, otherwise use the default list above
function loadTransactions() {
  const saved = localStorage.getItem("finview_data");
  if (saved) {
    return JSON.parse(saved);
  }
  return defaultTransactions;
}

function saveTransactions(data) {
  localStorage.setItem("finview_data", JSON.stringify(data));
}
