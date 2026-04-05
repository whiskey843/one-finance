// ATK Payroll Calculator
let employees = [];
let employeeCounter = 1;
let currentCalculation = null;

// Set current date
function setCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (!currentDateElement) {
        return;
    }

    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = today.toLocaleDateString('sq-AL', options);
}

function buildSalaryCalculation(grossSalary) {
    const personalContribution = grossSalary * 0.05;
    const employerContribution = grossSalary * 0.05;
    const taxableIncome = grossSalary - personalContribution;

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

    return {
        grossSalary,
        personalContribution,
        employerContribution,
        taxableIncome,
        tax,
        netSalary
    };
}

function formatEuro(amount) {
    return `${amount.toFixed(2)} €`;
}

function updatePreview(calculation) {
    document.getElementById('previewPersonal').textContent = formatEuro(calculation.personalContribution);
    document.getElementById('previewEmployer').textContent = formatEuro(calculation.employerContribution);
    document.getElementById('previewTaxable').textContent = formatEuro(calculation.taxableIncome);
    document.getElementById('previewTax').textContent = formatEuro(calculation.tax);
    document.getElementById('previewNet').textContent = formatEuro(calculation.netSalary);
}

function resetPreview() {
    currentCalculation = null;
    document.getElementById('previewPersonal').textContent = '0.00 €';
    document.getElementById('previewEmployer').textContent = '0.00 €';
    document.getElementById('previewTaxable').textContent = '0.00 €';
    document.getElementById('previewTax').textContent = '0.00 €';
    document.getElementById('previewNet').textContent = '0.00 €';
}

function calculateSalaryPreview() {
    const grossSalary = parseFloat(document.getElementById('grossSalary').value);

    if (isNaN(grossSalary) || grossSalary <= 0) {
        alert('Ju lutemi shkruani një pagë bruto të vlefshme');
        return;
    }

    currentCalculation = buildSalaryCalculation(grossSalary);
    updatePreview(currentCalculation);
}

function addEmployee() {
    const name = document.getElementById('employeeName').value.trim();
    const personalId = document.getElementById('personalId').value.trim();
    const grossSalary = parseFloat(document.getElementById('grossSalary').value);

    if (!name || !personalId || isNaN(grossSalary) || grossSalary <= 0) {
        alert('Ju lutemi plotësoni të gjitha fushat saktë');
        return;
    }

    if (!currentCalculation || currentCalculation.grossSalary !== grossSalary) {
        alert('Së pari klikoni "Llogarit" për ta llogaritur pagën.');
        return;
    }

    const employee = {
        id: employeeCounter++,
        name: name,
        personalId: personalId,
        grossSalary: currentCalculation.grossSalary,
        personalContribution: currentCalculation.personalContribution,
        employerContribution: currentCalculation.employerContribution,
        taxableIncome: currentCalculation.taxableIncome,
        tax: currentCalculation.tax,
        netSalary: currentCalculation.netSalary
    };

    employees.push(employee);

    document.getElementById('employeeName').value = '';
    document.getElementById('personalId').value = '';
    document.getElementById('grossSalary').value = '';
    document.getElementById('employeeName').focus();
    resetPreview();

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
    const employeeNameInput = document.getElementById('employeeName');
    const personalIdInput = document.getElementById('personalId');

    if (grossSalaryInput) {
        grossSalaryInput.addEventListener('input', resetPreview);
        grossSalaryInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                calculateSalaryPreview();
            }
        });
    }

    if (employeeNameInput) {
        employeeNameInput.addEventListener('input', function () {
            if (currentCalculation) {
                return;
            }
        });
    }

    if (personalIdInput) {
        personalIdInput.addEventListener('input', function () {
            if (currentCalculation) {
                return;
            }
        });
    }
});
