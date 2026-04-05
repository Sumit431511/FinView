// ============================================
//  APP.JS — Main application logic
// ============================================

// Load transactions from localStorage (or default data)
let transactions = loadTransactions();

// Chart instances (kept so we can destroy before redrawing)
let lineChartInstance = null;
let doughnutChartInstance = null;


// ============================================
//  HELPERS
// ============================================

// Format number as Indian Rupees
function formatMoney(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Format date string to readable form
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Calculate total income, expenses, and balance
function getSummary(data) {
  let income = 0;
  let expense = 0;

  data.forEach(function (t) {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
    }
  });

  return { income, expense, balance: income - expense };
}

// Group expenses by category and return totals
function groupByCategory(data) {
  const result = {};
  data.forEach(function (t) {
    if (t.type === "expense") {
      if (!result[t.cat]) result[t.cat] = 0;
      result[t.cat] += t.amount;
    }
  });
  return result;
}

// Group all transactions by month (YYYY-MM format)
function groupByMonth(data) {
  const result = {};
  data.forEach(function (t) {
    const month = t.date.slice(0, 7);
    if (!result[month]) result[month] = { income: 0, expense: 0 };
    result[month][t.type] += t.amount;
  });
  return result;
}


// ============================================
//  NAVIGATION
// ============================================

function goTo(pageName, clickedEl) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(function (p) {
    p.classList.remove("active");
  });

  // Remove active from all nav items
  document.querySelectorAll(".nav-item").forEach(function (n) {
    n.classList.remove("active");
  });

  // Show the target page
  document.getElementById("page-" + pageName).classList.add("active");

  // Highlight the correct nav item
  if (clickedEl) {
    clickedEl.classList.add("active");
  } else {
    const order = { dashboard: 0, transactions: 1, insights: 2 };
    const navItems = document.querySelectorAll(".nav-item");
    if (navItems[order[pageName]]) {
      navItems[order[pageName]].classList.add("active");
    }
  }

  // Close sidebar on mobile
  document.getElementById("sidebar").classList.remove("open");

  // Render the correct content
  if (pageName === "dashboard")    renderDashboard();
  if (pageName === "transactions") renderTable();
  if (pageName === "insights")     renderInsights();
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}


// ============================================
//  ROLE SWITCHING
// ============================================

function switchRole(role) {
  // Swapping the class on the shell shows/hides admin-only elements via CSS
  document.getElementById("shell").className = "shell role-" + role;
}


// ============================================
//  DASHBOARD
// ============================================

function renderDashboard() {
  // Show today's date in the subtitle
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("dash-date").textContent = today;

  renderSummaryCards();
  renderLineChart();
  renderDoughnutChart();
  renderRecentTransactions();
}

function renderSummaryCards() {
  const { income, expense, balance } = getSummary(transactions);

  document.getElementById("summaryCards").innerHTML = `
    <div class="card">
      <div class="card-label">Total Balance</div>
      <div class="card-value">${formatMoney(balance)}</div>
      <div class="card-sub">All time net</div>
    </div>
    <div class="card">
      <div class="card-label">Total Income</div>
      <div class="card-value income">${formatMoney(income)}</div>
      <div class="card-sub">Across all transactions</div>
    </div>
    <div class="card">
      <div class="card-label">Total Expenses</div>
      <div class="card-value expense">${formatMoney(expense)}</div>
      <div class="card-sub">Across all transactions</div>
    </div>
  `;
}

function renderLineChart() {
  const monthly = groupByMonth(transactions);
  const sortedMonths = Object.keys(monthly).sort();

  const labels = sortedMonths.map(function (m) {
    const parts = m.split("-");
    return new Date(parts[0], parts[1] - 1).toLocaleString("en-IN", {
      month: "short",
      year: "2-digit",
    });
  });

  const incomeData  = sortedMonths.map(function (m) { return monthly[m].income; });
  const expenseData = sortedMonths.map(function (m) { return monthly[m].expense; });

  if (lineChartInstance) lineChartInstance.destroy();

  lineChartInstance = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "#22C9A5",
          backgroundColor: "rgba(34, 201, 165, 0.08)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: "#F25C5C",
          backgroundColor: "rgba(242, 92, 92, 0.08)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { font: { family: "Inter", size: 12 } } },
      },
      scales: {
        y: {
          ticks: {
            callback: function (v) { return "₹" + v / 1000 + "k"; },
            font: { family: "Inter" },
          },
          grid: { color: "#E4E8F0" },
        },
        x: {
          ticks: { font: { family: "Inter" } },
          grid: { display: false },
        },
      },
    },
  });
}

function renderDoughnutChart() {
  const catMap = groupByCategory(transactions);
  const labels = Object.keys(catMap);
  const values = labels.map(function (k) { return catMap[k]; });
  const colors = ["#5B6EF5", "#22C9A5", "#F25C5C", "#F7A440", "#A78BFA", "#60A5FA", "#34D399", "#FB7185"];

  if (doughnutChartInstance) doughnutChartInstance.destroy();

  doughnutChartInstance = new Chart(document.getElementById("doughnutChart"), {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#fff",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { family: "Inter", size: 11 }, boxWidth: 12, padding: 12 },
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return " " + ctx.label + ": ₹" + ctx.parsed.toLocaleString("en-IN");
            },
          },
        },
      },
    },
  });
}

function renderRecentTransactions() {
  // Show the 5 most recent transactions
  const recent = [...transactions]
    .sort(function (a, b) { return b.date.localeCompare(a.date); })
    .slice(0, 5);

  const tbody = document.getElementById("recentTbody");

  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No transactions yet.</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(function (t) {
    return buildTableRow(t, false);
  }).join("");
}


// ============================================
//  TRANSACTIONS PAGE
// ============================================

function getFilteredTransactions() {
  const search     = document.getElementById("searchInput").value.toLowerCase();
  const typeFilter = document.getElementById("filterType").value;
  const catFilter  = document.getElementById("filterCat").value;
  const sortValue  = document.getElementById("sortSelect").value;

  let data = transactions.filter(function (t) {
    if (typeFilter && t.type !== typeFilter) return false;
    if (catFilter  && t.cat  !== catFilter)  return false;
    if (search && !t.desc.toLowerCase().includes(search) && !t.cat.toLowerCase().includes(search)) return false;
    return true;
  });

  // Sort
  const sortField = sortValue.split("-")[0];
  const sortDir   = sortValue.split("-")[1];

  data.sort(function (a, b) {
    const valA = sortField === "date" ? a.date : a.amount;
    const valB = sortField === "date" ? b.date : b.amount;
    if (sortDir === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  return data;
}

function populateCategoryDropdown() {
  const categories = [...new Set(transactions.map(function (t) { return t.cat; }))].sort();
  const select = document.getElementById("filterCat");
  const current = select.value;

  select.innerHTML = '<option value="">All Categories</option>' +
    categories.map(function (c) {
      return '<option value="' + c + '" ' + (current === c ? "selected" : "") + '>' + c + "</option>";
    }).join("");
}

function renderTable() {
  populateCategoryDropdown();

  const data  = getFilteredTransactions();
  const tbody = document.getElementById("txTbody");
  const empty = document.getElementById("emptyState");

  if (data.length === 0) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  tbody.innerHTML = data.map(function (t) {
    return buildTableRow(t, true);
  }).join("");
}

function buildTableRow(t, showActions) {
  const sign = t.type === "income" ? "+" : "-";
  const actionsCell = showActions
    ? '<td class="admin-only"><button class="btn btn-danger btn-sm" onclick="deleteTransaction(' + t.id + ')">Delete</button></td>'
    : "";

  return `
    <tr>
      <td>${formatDate(t.date)}</td>
      <td>${t.desc}</td>
      <td><span class="badge badge-${t.type}">${t.cat}</span></td>
      <td class="amount-${t.type}">${sign}${formatMoney(t.amount)}</td>
      <td><span class="badge badge-${t.type}">${t.type}</span></td>
      ${actionsCell}
    </tr>
  `;
}

function deleteTransaction(id) {
  const confirmed = confirm("Are you sure you want to delete this transaction?");
  if (!confirmed) return;

  transactions = transactions.filter(function (t) { return t.id !== id; });
  saveTransactions(transactions);
  renderTable();
}


// ============================================
//  ADD TRANSACTION MODAL
// ============================================

function openModal() {
  // Set today's date as default
  document.getElementById("f-date").value = new Date().toISOString().slice(0, 10);
  document.getElementById("overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("overlay").classList.remove("open");
  document.getElementById("f-desc").value   = "";
  document.getElementById("f-amount").value = "";
}

function closeModalOutside(event) {
  if (event.target.id === "overlay") closeModal();
}

function addTransaction() {
  const desc   = document.getElementById("f-desc").value.trim();
  const amount = parseFloat(document.getElementById("f-amount").value);
  const type   = document.getElementById("f-type").value;
  const cat    = document.getElementById("f-cat").value;
  const date   = document.getElementById("f-date").value;

  if (!desc || !amount || !date) {
    alert("Please fill in all fields.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    date: date,
    desc: desc,
    cat: cat,
    type: type,
    amount: amount,
  };

  transactions.unshift(newTransaction);
  saveTransactions(transactions);
  closeModal();
  renderTable();
}


// ============================================
//  INSIGHTS PAGE
// ============================================

function renderInsights() {
  const catMap  = groupByCategory(transactions);
  const monthly = groupByMonth(transactions);
  const months  = Object.keys(monthly).sort();

  const { income, expense } = getSummary(transactions);

  // Top spending category
  const sortedCategories = Object.entries(catMap).sort(function (a, b) { return b[1] - a[1]; });
  const topCategory = sortedCategories[0] || ["—", 0];

  // Month-over-month comparison
  const lastMonth = months[months.length - 1];
  const prevMonth = months[months.length - 2];
  const lm = lastMonth ? monthly[lastMonth] : { expense: 0 };
  const pm = prevMonth ? monthly[prevMonth] : { expense: 0 };
  const diff = lm.expense - pm.expense;
  const diffText  = diff >= 0 ? "▲ " + formatMoney(Math.abs(diff)) + " more" : "▼ " + formatMoney(Math.abs(diff)) + " less";
  const diffColor = diff >= 0 ? "var(--red)" : "var(--green)";

  // Savings rate
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  // Average monthly spending
  const totalMonths = months.length || 1;
  const avgSpend = Math.round(expense / totalMonths);

  // Category progress bars (top 5)
  const maxValue = sortedCategories[0] ? sortedCategories[0][1] : 1;
  const bars = sortedCategories.slice(0, 5).map(function (entry) {
    const cat = entry[0];
    const val = entry[1];
    const width = ((val / maxValue) * 100).toFixed(1);
    return `
      <div class="bar-row">
        <div class="bar-label">${cat}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${width}%"></div>
        </div>
        <div class="bar-val">${formatMoney(val)}</div>
      </div>
    `;
  }).join("");

  document.getElementById("insightsGrid").innerHTML = `
    <div class="insight-card">
      <h3>Highest Spending Category</h3>
      <div class="insight-big" style="color: var(--accent)">${topCategory[0]}</div>
      <div class="insight-sub">${formatMoney(topCategory[1])} spent in total</div>
    </div>

    <div class="insight-card">
      <h3>Month-over-Month Expenses</h3>
      <div class="insight-big" style="color: ${diffColor}">${diffText}</div>
      <div class="insight-sub">Compared to the previous month</div>
    </div>

    <div class="insight-card">
      <h3>Savings Rate</h3>
      <div class="insight-big" style="color: var(--green)">${savingsRate}%</div>
      <div class="insight-sub">Of total income saved</div>
    </div>

    <div class="insight-card">
      <h3>Avg Monthly Spend</h3>
      <div class="insight-big">${formatMoney(avgSpend)}</div>
      <div class="insight-sub">Across ${totalMonths} month(s) of data</div>
    </div>

    <div class="insight-card" style="grid-column: 1 / -1;">
      <h3>Spending Breakdown</h3>
      ${bars || '<div class="insight-sub">No expense data yet.</div>'}
    </div>
  `;
}


// ============================================
//  EXPORT CSV
// ============================================

function exportCSV() {
  const data = getFilteredTransactions();
  let csv = "Date,Description,Category,Type,Amount\n";

  data.forEach(function (t) {
    csv += t.date + ',"' + t.desc + '",' + t.cat + "," + t.type + "," + t.amount + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transactions.csv";
  link.click();
}


// ============================================
//  INIT — Run on page load
// ============================================

renderDashboard();
