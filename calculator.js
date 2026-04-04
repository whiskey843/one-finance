// Salary Calculator Logic
function calculateSalary() {
    const grossSalary = parseFloat(document.getElementById('grossSalary').value);
    const dependents = parseInt(document.getElementById('dependents').value);

    if (isNaN(grossSalary) || grossSalary < 0) {
        alert('Ju lutemi futni një pagë bruto të vlefshme');
        return;
    }

    // Albanian tax rates and calculations
    const socialContributionRate = 0.095; // 9.5%
    const healthInsuranceRate = 0.017; // 1.7%
    const employerSocialRate = 0.15; // 15%
    const employerHealthRate = 0.017; // 1.7%

    // Calculate employee deductions
    const socialContribution = grossSalary * socialContributionRate;
    const healthInsurance = grossSalary * healthInsuranceRate;
    
    // Calculate TAP (Progressive tax)
    let tap = 0;
    if (grossSalary <= 10000) {
        tap = 0; // 0% up to 10,000
    } else if (grossSalary <= 20000) {
        tap = (grossSalary - 10000) * 0.08; // 8% for 10,000-20,000
    } else if (grossSalary <= 30000) {
        tap = 10000 * 0.08 + (grossSalary - 20000) * 0.14; // 8% + 14%
    } else {
        tap = 10000 * 0.08 + 10000 * 0.14 + (grossSalary - 30000) * 0.18; // Full
    }

    // Dependent deduction (if applicable)
    const dependentDeduction = dependents > 0 ? dependents * 5000 : 0;
    const taxableIncome = grossSalary - socialContribution - healthInsurance;
    const adjustedTap = Math.max(0, tap - dependentDeduction);

    // Net salary
    const netSalary = grossSalary - socialContribution - healthInsurance - adjustedTap;

    // Employer costs
    const employerSocial = grossSalary * employerSocialRate;
    const employerHealth = grossSalary * employerHealthRate;
    const totalEmployerCost = grossSalary + employerSocial + employerHealth;

    // Display results
    document.getElementById('resultGross').textContent = formatCurrency(grossSalary);
    document.getElementById('resultSocialEmp').textContent = formatCurrency(socialContribution);
    document.getElementById('resultHealthEmp').textContent = formatCurrency(healthInsurance);
    document.getElementById('resultTAP').textContent = formatCurrency(adjustedTap);
    document.getElementById('resultNet').textContent = formatCurrency(netSalary);
    document.getElementById('resultSocialEr').textContent = formatCurrency(employerSocial);
    document.getElementById('resultHealthEr').textContent = formatCurrency(employerHealth);
    document.getElementById('resultTotal').textContent = formatCurrency(totalEmployerCost);

    // Scroll to results
    document.querySelector('.calculator-results').scrollIntoView({ behavior: 'smooth' });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('sq-AL', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Allow Enter key to calculate
document.addEventListener('DOMContentLoaded', function () {
    const grossSalaryInput = document.getElementById('grossSalary');
    if (grossSalaryInput) {
        grossSalaryInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                calculateSalary();
            }
        });
    }
});
