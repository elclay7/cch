/* --- LÓGICA JAVASCRIPT --- */

const formatterCLP = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
   });
   
   const formatterUF = new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
   });
   
   // --- FETCH API UF ---
   async function fetchUFValue() {
    const btn = document.getElementById('btnFetchUF');
    const input = document.getElementById('ufValue');
    const originalText = btn.innerText;
    
    btn.innerText = "Cargando...";
    btn.disabled = true;
    
    try {
    const response = await fetch('https://mindicador.cl/api');
    if (!response.ok) throw new Error('Error en la red');
    
    const data = await response.json();
    const valorUF = data.uf.valor;
    
    const formattedUF = new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
    }).format(valorUF);
    
    input.value = formattedUF;
    
    btn.innerText = "¡Listo!";
    setTimeout(() => {
    btn.innerText = originalText;
    btn.disabled = false;
    }, 1000);
    
    } catch (error) {
    console.error(error);
    alert("No se pudo obtener el valor de la UF automáticamente. Por favor ingrésalo manualmente.");
    btn.innerText = originalText;
    btn.disabled = false;
    }
   }
   
   // --- FORMATO INPUTS ---
   function formatCLInput(input) {
    let value = input.value;
    value = value.replace(/[^0-9,]/g, '');
    const parts = value.split(',');
    if (parts.length > 2) {
    value = parts[0] + ',' + parts.slice(1).join('');
    }
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? parts[1] : null;
    
    integerPart = integerPart.replace(/\./g, '');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    if (decimalPart !== null) {
    decimalPart = decimalPart.substring(0, 2);
    }
    
    if (decimalPart !== null) {
    input.value = `${integerPart},${decimalPart}`;
    } else {
    if (value.endsWith(',')) {
    input.value = `${integerPart},`;
    } else {
    input.value = integerPart;
    }
    }
   }
   
   function parseFormattedFloat(value) {
    if (!value) return 0;
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue);
   }
   
   // --- CÁLCULO CRÉDITO ---
   function calculateMortgage() {
    const ufValue = parseFormattedFloat(document.getElementById('ufValue').value);
    const salary = parseFormattedFloat(document.getElementById('salary').value);
    const propValue = parseFormattedFloat(document.getElementById('propValue').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value);
    const years = parseFloat(document.getElementById('years').value);
    const cae = parseFloat(document.getElementById('cae').value);
   
    if (!ufValue || !salary || !propValue || !downPaymentPercent || !years || !cae) {
    alert("Por favor completa todos los campos para realizar el cálculo.");
    return;
    }
   
    const pieUF = propValue * (downPaymentPercent / 100);
    const pieCLP = pieUF * ufValue;
    const loanUF = propValue - pieUF;
    const loanCLP = loanUF * ufValue;
   
    const monthlyRate = (cae / 100) / 12;
    const totalMonths = years * 12;
    
    const dividendUF = loanUF * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const dividendCLP = dividendUF * ufValue;
    const incomeRequired = dividendCLP / 0.25;
   
    document.getElementById('resYears').innerText = years;
    document.getElementById('resCAE').innerText = cae;
    document.getElementById('resPiePercent').innerText = downPaymentPercent;
    
    document.getElementById('resPieUF').innerText = formatterUF.format(pieUF) + " UF";
    document.getElementById('resPieCLP').innerText = formatterCLP.format(pieCLP);
   
    document.getElementById('resLoanUF').innerText = formatterUF.format(loanUF) + " UF";
    document.getElementById('resLoanCLP').innerText = formatterCLP.format(loanCLP);
   
    document.getElementById('resDividendUF').innerText = formatterUF.format(dividendUF) + " UF";
    document.getElementById('resDividendCLP').innerText = formatterCLP.format(dividendCLP);
   
    document.getElementById('resIncomeReq').innerText = formatterCLP.format(incomeRequired);
   
    const statusElement = document.getElementById('resIncomeStatus');
    if (salary >= incomeRequired) {
    statusElement.innerHTML = "<span style='color:#34c759'>✓ Tu renta actual es suficiente</span>";
    } else {
    const diff = incomeRequired - salary;
    statusElement.innerHTML = `<span style='color:#ff3b30'>⚠ Faltan ${formatterCLP.format(diff)} en tu renta</span>`;
    }
   
    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.classList.remove('active');
    
    document.getElementById('btnDownload').classList.add('visible');
   
    setTimeout(() => {
    resultsPanel.classList.add('active');
    }, 100);
   }
   
   // --- LIMPIAR DATOS ---
   function clearInputs() {
    document.getElementById('ufValue').value = '';
    document.getElementById('salary').value = '';
    document.getElementById('propValue').value = '';
    document.getElementById('downPayment').value = '';
    document.getElementById('years').value = '';
    document.getElementById('cae').value = '';
   
    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.classList.remove('active');
    document.getElementById('btnDownload').classList.remove('visible');
   }
   
   // --- DESCARGA PDF ---
   /* --- 
   function downloadPDF() {
    const element = document.getElementById('pdfContent');
    const opt = {
    margin: 10,
    filename: 'Resumen_Financiero.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
   }
    --- */