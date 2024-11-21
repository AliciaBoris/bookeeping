let totalIncome = 0;
let totalExpense = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadEntries();
    updateSummary();
});

// Add Income Entry
function addIncome() {
    const date = document.getElementById('income-date').value;
    const service = document.getElementById('income-service').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    const quantity = parseInt(document.getElementById('income-quantity').value);
    const deposit = parseFloat(document.getElementById('income-deposit').value);
    const balance = parseFloat(document.getElementById('income-balance').value) || 0;
    const totalCost = parseFloat(document.getElementById('income-total-cost').value);
    const attendant = document.getElementById('income-attendant').value;

    if (!date || !service || isNaN(amount) || isNaN(quantity) || isNaN(deposit) || isNaN(totalCost) || !attendant) {
        alert('Please fill in all required fields.');
        return;
    }

    const incomeData = { date, service, amount, quantity, deposit, balance, totalCost, attendant };
    saveEntry(incomeData, 'income');
    totalIncome += totalCost;
    updateSummary();

    // Reset form fields
    document.getElementById('income-form').reset();
}

// Add Expense Entry
function addExpense() {
    const date = document.getElementById('expense-date').value;
    const type = document.getElementById('expense-type').value;
    const item = document.getElementById('expense-item').value;
    const cost = parseFloat(document.getElementById('expense-cost').value);
    const totalAmount = parseFloat(document.getElementById('expense-total-amount').value);
    const attendant = document.getElementById('expense-attendant').value;

    if (!date || !type || !item || isNaN(cost) || isNaN(totalAmount) || !attendant) {
        alert('Please fill in all required fields.');
        return;
    }

    const expenseData = { date, type, item, cost, totalAmount, attendant };
    saveEntry(expenseData, 'expense');
    totalExpense += totalAmount;
    updateSummary();

    // Reset form fields
    document.getElementById('expense-form').reset();
}

// Save Entry to localStorage
function saveEntry(entry, type) {
    const entries = JSON.parse(localStorage.getItem(type)) || [];
    entries.push(entry);
    localStorage.setItem(type, JSON.stringify(entries));
    addToTable(entry, type);
}

// Load Entries from localStorage
function loadEntries() {
    const incomeEntries = JSON.parse(localStorage.getItem('income')) || [];
    const expenseEntries = JSON.parse(localStorage.getItem('expense')) || [];

    incomeEntries.forEach(entry => {
        addToTable(entry, 'income');
        totalIncome += entry.totalCost;
    });

    expenseEntries.forEach(entry => {
        addToTable(entry, 'expense');
        totalExpense += entry.totalAmount;
    });
}

// Add entry to the table
function addToTable(entry, type) {
    const table = document.getElementById(`${type}-table`).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    if (type === 'income') {
        newRow.innerHTML = `
            <td>${new Date(entry.date).toLocaleDateString()}</td>
            <td>${entry.service}</td>
            <td>${entry.amount.toFixed(2)}</td>
            <td>${entry.quantity}</td>
            <td>${entry.deposit.toFixed(2)}</td>
            <td>${entry.balance.toFixed(2)}</td>
            <td>${entry.totalCost.toFixed(2)}</td>
            <td>${entry.attendant}</td>
            <td><button onclick="deleteRow(this, '${type}', ${entry.totalCost})">Delete</button></td>
        `;
    } else if (type === 'expense') {
        newRow.innerHTML = `
            <td>${new Date(entry.date).toLocaleDateString()}</td>
            <td>${entry.type}</td>
            <td>${entry.item}</td>
            <td>${entry.cost.toFixed(2)}</td>
            <td>${entry.totalAmount.toFixed(2)}</td>
            <td>${entry.attendant}</td>
            <td><button onclick="deleteRow(this, '${type}', ${entry.totalAmount})">Delete</button></td>
        `;
    }
}

// Delete Row from Table and localStorage
function deleteRow(button, type, amount) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    // Update totals based on type of entry
    if (type === 'income') {
        totalIncome -= amount;
    } else if (type === 'expense') {
        totalExpense -= amount;
    }
    updateSummary();

    // Remove entry from localStorage
    const entries = JSON.parse(localStorage.getItem(type));
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    entries.splice(rowIndex, 1);
    localStorage.setItem(type, JSON.stringify(entries));
}

// Update Summary
function updateSummary() {
    const netProfit = totalIncome - totalExpense;
    document.getElementById('total-income').innerText = `₦${totalIncome.toFixed(2)}`;
    document.getElementById('total-expense').innerText = `₦${totalExpense.toFixed(2)}`;
    document.getElementById('net-profit').innerText = `₦${netProfit.toFixed(2)}`;
}

// Search by Date
function searchByDate() {
    const searchDate = new Date(document.getElementById('search-date').value).toLocaleDateString();

    // Filter income table
    const incomeTable = document.getElementById('income-table').getElementsByTagName('tbody')[0];
    const incomeRows = incomeTable.getElementsByTagName('tr');

    for (let i = 0; i < incomeRows.length; i++) {
        const dateCell = incomeRows[i].getElementsByTagName('td')[0].innerText;
        incomeRows[i].style.display = dateCell === searchDate ? '' : 'none';
    }

    // Filter expense table
    const expenseTable = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    const expenseRows = expenseTable.getElementsByTagName('tr');

    for (let i = 0; i < expenseRows.length; i++) {
        const dateCell = expenseRows[i].getElementsByTagName('td')[0].innerText;
        expenseRows[i].style.display = dateCell === searchDate ? '' : 'none';
    }
}

// Reset Search
function resetSearch() {
    const incomeRows = document.getElementById('income-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < incomeRows.length; i++) {
        incomeRows[i].style.display = '';
    }

    const expenseRows = document.getElementById('expense-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < expenseRows.length; i++) {
        expenseRows[i].style.display = '';
    }

    document.getElementById('search-date').value = '';
}

// Show Current Profit Alert
function showTotalProfit() {
    const netProfit = totalIncome - totalExpense;
    alert(`Current Total Profit: ₦${netProfit.toFixed(2)}`);
}
