// ATK Payroll Calculator
const CALCULATOR_PAGE_VERSION = '20260406-10';

if (!window.location.search.includes(`v=${CALCULATOR_PAGE_VERSION}`)) {
    const params = new URLSearchParams(window.location.search);
    params.set('v', CALCULATOR_PAGE_VERSION);
    const targetUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.location.replace(targetUrl);
}

let employees = [];
let employeeCounter = 1;
let currentCalculation = null;

function setAddButtonState(isEnabled) {
    const addEmployeeButton = document.getElementById('addEmployeeButton');
    if (addEmployeeButton) {
        addEmployeeButton.disabled = !isEnabled;
        addEmployeeButton.classList.toggle('button-ready', isEnabled);
    }
}

function setCalculatorStatus(message, type) {
    const statusElement = document.getElementById('calculatorStatus');
    if (!statusElement) {
        return;
    }

    statusElement.textContent = message;
    statusElement.classList.remove('status-idle', 'status-success', 'status-error');
    statusElement.classList.add(type);
}

function getGrossSalaryValue() {
    const grossSalaryInput = document.getElementById('grossSalary');
    if (!grossSalaryInput) {
        return NaN;
    }

    const normalizedValue = grossSalaryInput.value.replace(/\s+/g, '').replace(',', '.');
    return parseFloat(normalizedValue);
}

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

function resetPreview() {
    currentCalculation = null;
    setAddButtonState(false);
    setCalculatorStatus('Klikoni "Llogarit" dhe pastaj "Shto Punonjësin".', 'status-idle');
}

function calculateSalaryPreview() {
    const grossSalary = getGrossSalaryValue();

    if (isNaN(grossSalary) || grossSalary <= 0) {
        setCalculatorStatus('Shkruani një pagë bruto të vlefshme.', 'status-error');
        alert('Ju lutemi shkruani një pagë bruto të vlefshme');
        return;
    }

    currentCalculation = buildSalaryCalculation(grossSalary);
    setAddButtonState(true);
    setCalculatorStatus('Llogaritja u bë. Tani klikoni "Shto Punonjësin".', 'status-success');
}

function addEmployee() {
    const name = document.getElementById('employeeName').value.trim();
    const personalId = document.getElementById('personalId').value.trim();

    if (!name || !personalId) {
        setCalculatorStatus('Plotësoni emrin dhe numrin personal para se ta shtoni punonjësin.', 'status-error');
        alert('Ju lutemi plotësoni emrin dhe numrin personal.');
        return;
    }

    if (!currentCalculation) {
        setCalculatorStatus('Së pari klikoni "Llogarit".', 'status-error');
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
    setCalculatorStatus('Punonjësi u shtua me sukses në tabelë.', 'status-success');

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
        resetPreview();
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

window.calculateSalaryPreview = calculateSalaryPreview;
window.addEmployee = addEmployee;
window.removeEmployee = removeEmployee;
window.clearAll = clearAll;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    setCurrentDate();
    resetPreview();

    const calculateButton = document.getElementById('calculateButton');
    const addEmployeeButton = document.getElementById('addEmployeeButton');
    const grossSalaryInput = document.getElementById('grossSalary');
    const employeeNameInput = document.getElementById('employeeName');
    const personalIdInput = document.getElementById('personalId');

    if (calculateButton) {
        calculateButton.addEventListener('click', calculateSalaryPreview);
    }

    if (addEmployeeButton) {
        addEmployeeButton.addEventListener('click', addEmployee);
    }

    if (grossSalaryInput) {
        grossSalaryInput.addEventListener('input', resetPreview);
        grossSalaryInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateSalaryPreview();
            }
        });
    }

    if (employeeNameInput) {
        employeeNameInput.addEventListener('input', resetPreview);
    }

    if (personalIdInput) {
        personalIdInput.addEventListener('input', resetPreview);
    }
});
