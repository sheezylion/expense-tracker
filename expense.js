let targetAmount = 0;
let totalSpent = 0;
let expenseEntries = [];
let currentEditIndex = -1;

document.getElementById("target").addEventListener("change", function () {
  targetAmount = parseFloat(this.value) || 0;
  updateSummary();
});

function addExpense() {
  const name = document.getElementById("expense-name").value.trim();
  const amount =
    parseFloat(document.getElementById("expense-amount").value) || 0;
  const date = document.getElementById("expense-date").value;

  if (!name || !amount || !date) {
    alert("Please fill in all fields.");
    return;
  }

  if (targetAmount <= 0) {
    alert("Please set a valid target amount first.");
    return;
  }

  if (currentEditIndex >= 0) {
    totalSpent -= expenseEntries[currentEditIndex].amount;
    expenseEntries[currentEditIndex] = { name, amount, date };
    totalSpent += amount;
    currentEditIndex = -1;
  } else {
    expenseEntries.push({ name, amount, date });
    totalSpent += amount;
  }

  document.getElementById("expense-name").value = "";
  document.getElementById("expense-amount").value = "";
  document.getElementById("expense-date").value = "";

  updateSummary();
  updateExpenseList();
  updateChart();

  if (totalSpent >= targetAmount * 0.6) {
    alert(
      "You are running out of money. Consider adjusting your spending or adding more funds."
    );
  }
}

function updateSummary() {
  let remaining = targetAmount - totalSpent;
  document.getElementById("remaining").textContent = remaining.toFixed(2);
  document.getElementById("spent-amount").textContent = totalSpent.toFixed(2);
}

function updateExpenseList() {
  let expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";
  expenseEntries.forEach((entry, index) => {
    let li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.amount} Naira on ${entry.date}`;

    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => {
      document.getElementById("expense-name").value = entry.name;
      document.getElementById("expense-amount").value = entry.amount;
      document.getElementById("expense-date").value = entry.date;
      currentEditIndex = index;
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => {
      totalSpent -= entry.amount;
      expenseEntries.splice(index, 1);
      updateSummary();
      updateExpenseList();
      updateChart();
    };

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    expenseList.appendChild(li);
  });
}

let chart;
function updateChart() {
  let ctx = document.getElementById("expenseChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total Spent", "Remaining Budget"],
      datasets: [
        {
          label: "Monthly Spending",
          data: [totalSpent, targetAmount - totalSpent],
          backgroundColor: ["#00796b", "#ffeb3b"],
          borderColor: ["#004d40", "#ffca28"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
