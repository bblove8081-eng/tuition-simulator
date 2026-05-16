document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const inputs = {
        targetRate: document.getElementById('target-rate'),
        totalStudents: document.getElementById('total-students'),
        aRate: document.getElementById('a-rate'),
        aFeeWith: document.getElementById('a-fee-with'),
        aFeeWithout: document.getElementById('a-fee-without'),
        bRate: document.getElementById('b-rate'),
        bFeeWith: document.getElementById('b-fee-with'),
        bFeeWithout: document.getElementById('b-fee-without')
    };

    // Output elements
    const elements = {
        errorMessage: document.getElementById('error-message'),
        resultsContent: document.getElementById('results-content'),
        resACount: document.getElementById('res-a-count'),
        resARatio: document.getElementById('res-a-ratio'),
        resBCount: document.getElementById('res-b-count'),
        resBRatio: document.getElementById('res-b-ratio'),
        barA: document.getElementById('bar-a'),
        barB: document.getElementById('bar-b'),
        resRevenue: document.getElementById('res-revenue'),
        resRevA: document.getElementById('res-rev-a'),
        resRevB: document.getElementById('res-rev-b')
    };

    // Number formatter
    const formatCurrency = (num) => {
        return new Intl.NumberFormat('ko-KR').format(Math.round(num)) + ' 만원';
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('ko-KR').format(Math.round(num));
    };

    // Main calculation logic
    const calculate = () => {
        // Get values
        const targetRate = parseFloat(inputs.targetRate.value) / 100;
        const totalStudents = parseInt(inputs.totalStudents.value);
        const aRate = parseFloat(inputs.aRate.value) / 100;
        const bRate = parseFloat(inputs.bRate.value) / 100;
        
        const aFeeWith = parseFloat(inputs.aFeeWith.value);
        const aFeeWithout = parseFloat(inputs.aFeeWithout.value);
        const bFeeWith = parseFloat(inputs.bFeeWith.value);
        const bFeeWithout = parseFloat(inputs.bFeeWithout.value);

        let aRatio = 0;

        if (aRate === bRate) {
            if (targetRate === aRate) {
                aRatio = 0.5; // Any ratio works, default to 50/50
            } else {
                showError();
                return;
            }
        } else {
            aRatio = (targetRate - bRate) / (aRate - bRate);
        }

        // Validate possible ratios
        if (aRatio < 0 || aRatio > 1) {
            showError();
            return;
        }

        const bRatio = 1 - aRatio;

        // Calculate student counts
        const aCount = Math.round(totalStudents * aRatio);
        const bCount = totalStudents - aCount; // Ensure total is exactly totalStudents
        
        // Recalculate actual ratio due to rounding
        const actualARatio = totalStudents > 0 ? aCount / totalStudents : 0;
        const actualBRatio = totalStudents > 0 ? bCount / totalStudents : 0;

        // Calculate revenues
        const aCountWith = aCount * aRate;
        const aCountWithout = aCount * (1 - aRate);
        const aRevenue = (aCountWith * aFeeWith) + (aCountWithout * aFeeWithout);

        const bCountWith = bCount * bRate;
        const bCountWithout = bCount * (1 - bRate);
        const bRevenue = (bCountWith * bFeeWith) + (bCountWithout * bFeeWithout);

        const totalRevenue = aRevenue + bRevenue;

        // Update UI
        updateUI(aCount, bCount, actualARatio, actualBRatio, aRevenue, bRevenue, totalRevenue);
    };

    const showError = () => {
        elements.errorMessage.classList.remove('hidden');
        elements.resultsContent.classList.add('hidden');
    };

    const updateUI = (aCount, bCount, aRatio, bRatio, aRev, bRev, totalRev) => {
        elements.errorMessage.classList.add('hidden');
        elements.resultsContent.classList.remove('hidden');

        // Update counts and ratios
        elements.resACount.textContent = formatNumber(aCount) + '명';
        elements.resARatio.textContent = `(${(aRatio * 100).toFixed(1)}%)`;
        
        elements.resBCount.textContent = formatNumber(bCount) + '명';
        elements.resBRatio.textContent = `(${(bRatio * 100).toFixed(1)}%)`;

        // Update chart
        elements.barA.style.width = `${aRatio * 100}%`;
        elements.barB.style.width = `${bRatio * 100}%`;

        // Update revenue
        elements.resRevenue.textContent = formatCurrency(totalRev);
        elements.resRevA.textContent = formatCurrency(aRev);
        elements.resRevB.textContent = formatCurrency(bRev);
    };

    // Add event listeners to all inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Initial calculation
    calculate();
});
