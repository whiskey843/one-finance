// ATK Payroll Calculator
let employees = [];
let employeeCounter = 1;

// Set current date
function setCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = today.toLocaleDateString('sq-AL', options);
}

function addEmployee() {
    const name = document.getElementById('employeeName').value.trim();
    const personalId = document.getElementById('personalId').value.trim();
    const grossSalary = parseFloat(document.getElementById('grossSalary').value);

    if (!name || !personalId || isNaN(grossSalary) || grossSalary <= 0) {
        alert('Ju lutemi plotësoni të gjitha fushat saktë');
        return;
    }

    // Calculate deductions (5% each)
    const personalContribution = grossSalary * 0.05;
    const employerContribution = grossSalary * 0.05;
    const taxableIncome = grossSalary - personalContribution;
    
    // Calculate TAP (Income Tax)
    let tax = 0;
    if (taxableIncome <= 10000) {
        tax = 0;
    } else if (taxableIncome <= 20000) {
        tax = (taxableIncome - 10000) * 0.08;
    } else if (taxableIncome <= 30000) {
        tax = 800 + (taxableIncome - 20000) * 0.14;
    } else {
        tax = 800 + 1400 + (taxableIncome - 30000) * 0.18;
    }

    const netSalary = taxableIncome - tax;

    // Create employee object
    const employee = {
        id: employeeCounter++,
        name: name,
        personalId: personalId,
        grossSalary: grossSalary,
        personalContribution: personalContribution,
        employerContribution: employerContribution,
        taxableIncome: taxableIncome,
        tax: tax,
        netSalary: netSalary
    };

    employees.push(employee);
    
    // Clear form
    document.getElementById('employeeName').value = '';
    document.getElementById('personalId').value = '';
    document.getElementById('grossSalary').value = '';
    document.getElementById('employeeName').focus();

    // Update table
    updateEmployeeTable();
}

function removeEmployee(id) {
    employees = employees.filter(emp => emp.id !== id);
    updateEmployeeTable();
}

function clearAll() {
    if (confirm('A ste sigur që dëshironi të fshini të gjithë punonjësit?')) {
        employees = [];
        employeeCounter = 1;
        updateEmployeeTable();
    }
}

function updateEmployeeTable() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';

    let totalGross = 0, totalPersonal = 0, totalEmployer = 0, totalTaxable = 0, totalTax = 0, totalNet = 0;

    employees.forEach((emp, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${emp.name}</td>
            <td>${emp.personalId}</td>
            <td class="amount">${emp.grossSalary.toFixed(2)}</td>
            <td class="amount">${emp.personalContribution.toFixed(2)}</td>
            <td class="amount">${emp.employerContribution.toFixed(2)}</td>
            <td class="amount">${emp.taxableIncome.toFixed(2)}</td>
            <td class="amount">${emp.tax.toFixed(2)}</td>
            <td class="amount">${emp.netSalary.toFixed(2)}</td>
            <td><button onclick="removeEmployee(${emp.id})" class="btn-delete"><i class="fas fa-trash"></i></button></td>
        `;
        tbody.appendChild(row);

        totalGross += emp.grossSalary;
        totalPersonal += emp.personalContribution;
        totalEmployer += emp.employerContribution;
        totalTaxable += emp.taxableIncome;
        totalTax += emp.tax;
        totalNet += emp.netSalary;
    });

    // Update totals
    document.getElementById('totalGross').textContent = totalGross.toFixed(2);
    document.getElementById('totalPersonal').textContent = totalPersonal.toFixed(2);
    document.getElementById('totalEmployer').textContent = totalEmployer.toFixed(2);
    document.getElementById('totalTaxable').textContent = totalTaxable.toFixed(2);
    document.getElementById('totalTax').textContent = totalTax.toFixed(2);
    document.getElementById('totalNet').textContent = totalNet.toFixed(2);
}

function printPayroll() {
    window.print();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    setCurrentDate();
    
    const grossSalaryInput = document.getElementById('grossSalary');
    if (grossSalaryInput) {
        grossSalaryInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addEmployee();
            }
        });
    }
});
