// Calculator Functions
let display = document.getElementById('calc-display');

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = 'Error';
    }
}

// Timer Functions
let timerInterval;
let timeLeft = 0;
let isPaused = false;

function startTimer() {
    if (isPaused) {
        isPaused = false;
        timerInterval = setInterval(updateTimer, 1000);
        return;
    }

    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;

    timeLeft = hours * 3600 + minutes * 60 + seconds;
    
    if (timeLeft > 0) {
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isPaused = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 0;
    isPaused = false;
    updateTimerDisplay();
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        clearInterval(timerInterval);
        alert('Timer finished!');
    }
}

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    document.getElementById('timer-display').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Color Picker Functions
const colorPicker = document.getElementById('colorPicker');
const rgbR = document.getElementById('rgb-r');
const rgbG = document.getElementById('rgb-g');
const rgbB = document.getElementById('rgb-b');
const hexValue = document.getElementById('hex-value');
const colorPreview = document.querySelector('.color-preview');

// Update color preview and values when color picker changes
colorPicker.addEventListener('input', function(e) {
    const color = e.target.value;
    colorPreview.style.backgroundColor = color;
    hexValue.value = color;
    
    // Convert hex to RGB
    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    
    rgbR.value = r;
    rgbG.value = g;
    rgbB.value = b;
});

// Update color when RGB values change
[rgbR, rgbG, rgbB].forEach(input => {
    input.addEventListener('input', function() {
        const r = parseInt(rgbR.value) || 0;
        const g = parseInt(rgbG.value) || 0;
        const b = parseInt(rgbB.value) || 0;
        
        const hex = '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
        
        colorPicker.value = hex;
        hexValue.value = hex;
        colorPreview.style.backgroundColor = hex;
    });
});

// Initialize color preview
colorPreview.style.backgroundColor = colorPicker.value;
hexValue.value = colorPicker.value;

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Word Counter Functions
const wordCounterInput = document.getElementById('word-counter-input');
if (wordCounterInput) {
    wordCounterInput.addEventListener('input', function() {
        const text = this.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const chars = text.length;
        const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);

        document.getElementById('word-count').textContent = words.length;
        document.getElementById('char-count').textContent = chars;
        document.getElementById('paragraph-count').textContent = paragraphs.length;
    });
}

// Forex Calculator Functions
function convertCurrency() {
    const amount = parseFloat(document.getElementById('forex-amount').value) || 0;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    // Example exchange rates (you should use real API rates in production)
    const rates = {
        USD: { EUR: 0.85, GBP: 0.73, INR: 74.5 },
        EUR: { USD: 1.18, GBP: 0.86, INR: 87.5 },
        GBP: { USD: 1.37, EUR: 1.16, INR: 101.5 },
        INR: { USD: 0.013, EUR: 0.011, GBP: 0.0098 }
    };

    const result = amount * rates[fromCurrency][toCurrency];
    document.getElementById('forex-result').textContent = result.toFixed(2);
}

// Image Enhancer Functions
let originalImage = null;

document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                const previewImage = document.getElementById('previewImage');
                previewImage.src = e.target.result;
                previewImage.classList.remove('d-none');
                resetImage();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function adjustBrightness(value) {
    const input = document.getElementById('brightness');
    const newValue = Math.max(0, Math.min(200, parseInt(input.value) + value));
    input.value = newValue;
    applyImageAdjustments();
}

function adjustContrast(value) {
    const input = document.getElementById('contrast');
    const newValue = Math.max(0, Math.min(200, parseInt(input.value) + value));
    input.value = newValue;
    applyImageAdjustments();
}

function adjustSaturation(value) {
    const input = document.getElementById('saturation');
    const newValue = Math.max(0, Math.min(200, parseInt(input.value) + value));
    input.value = newValue;
    applyImageAdjustments();
}

function applyImageAdjustments() {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Get adjustment values
    const brightness = document.getElementById('brightness').value / 100;
    const contrast = document.getElementById('contrast').value / 100;
    const saturation = document.getElementById('saturation').value / 100;

    // Apply adjustments
    for (let i = 0; i < data.length; i += 4) {
        // Brightness
        data[i] = data[i] * brightness;
        data[i + 1] = data[i + 1] * brightness;
        data[i + 2] = data[i + 2] * brightness;

        // Contrast
        data[i] = ((data[i] - 128) * contrast) + 128;
        data[i + 1] = ((data[i + 1] - 128) * contrast) + 128;
        data[i + 2] = ((data[i + 2] - 128) * contrast) + 128;

        // Saturation
        const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
        data[i] = gray + (data[i] - gray) * saturation;
        data[i + 1] = gray + (data[i + 1] - gray) * saturation;
        data[i + 2] = gray + (data[i + 2] - gray) * saturation;

        // Clamp values
        data[i] = Math.min(255, Math.max(0, data[i]));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
    }

    // Put the modified image data back
    ctx.putImageData(imageData, 0, 0);

    // Update preview
    const previewImage = document.getElementById('previewImage');
    previewImage.src = canvas.toDataURL();
}

function resetImage() {
    if (!originalImage) return;

    // Reset sliders
    document.getElementById('brightness').value = 100;
    document.getElementById('contrast').value = 100;
    document.getElementById('saturation').value = 100;

    // Reset preview to original
    const previewImage = document.getElementById('previewImage');
    previewImage.src = originalImage.src;
}

function downloadImage() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage.src) {
        const link = document.createElement('a');
        link.download = 'enhanced-image.png';
        link.href = previewImage.src;
        link.click();
    }
}

// Loan Calculator Functions
function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
    const loanTerm = parseFloat(document.getElementById('loan-term').value) || 0;

    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    document.getElementById('monthly-payment').textContent = `₹${monthlyPayment.toFixed(2)}`;
    document.getElementById('total-interest').textContent = `₹${totalInterest.toFixed(2)}`;
    document.getElementById('total-payment').textContent = `₹${totalPayment.toFixed(2)}`;
}

// EMI Calculator Functions
function calculateEMI() {
    const principal = parseFloat(document.getElementById('principal-amount').value) || 0;
    const annualRate = parseFloat(document.getElementById('annual-rate').value) || 0;
    const months = parseFloat(document.getElementById('loan-months').value) || 0;

    const monthlyRate = annualRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    document.getElementById('monthly-emi').textContent = `₹${emi.toFixed(2)}`;
    document.getElementById('emi-total-interest').textContent = `₹${totalInterest.toFixed(2)}`;
    document.getElementById('emi-total-payment').textContent = `₹${totalPayment.toFixed(2)}`;
}

// 8th Pay Commission Calculator Functions
function calculatePayCommission() {
    const basicPay = parseFloat(document.getElementById('basic-pay').value) || 0;
    const gradePay = parseFloat(document.getElementById('grade-pay').value) || 0;
    const daPercentage = parseFloat(document.getElementById('da-percentage').value) || 0;

    // 8th Pay Commission formula (simplified)
    const newBasic = (basicPay + gradePay) * 2.57; // 2.57 is the fitment factor
    const newDA = newBasic * (daPercentage / 100);
    const totalSalary = newBasic + newDA;

    document.getElementById('new-basic').textContent = `₹${newBasic.toFixed(2)}`;
    document.getElementById('new-da').textContent = `₹${newDA.toFixed(2)}`;
    document.getElementById('total-salary').textContent = `₹${totalSalary.toFixed(2)}`;
}

// Age Calculator Functions
function calculateAge() {
    const birthDate = document.getElementById('birthDate').value;
    const currentDate = document.getElementById('currentDate').value;
    const ageResult = document.getElementById('ageResult');

    if (!birthDate || !currentDate) {
        alert('Please select both dates');
        return;
    }

    const birth = new Date(birthDate);
    const current = new Date(currentDate);

    if (birth > current) {
        alert('Birth date cannot be in the future');
        return;
    }

    let years = current.getFullYear() - birth.getFullYear();
    let months = current.getMonth() - birth.getMonth();
    let days = current.getDate() - birth.getDate();

    // Adjust for negative months or days
    if (days < 0) {
        months--;
        const lastMonth = new Date(current.getFullYear(), current.getMonth() - 1, birth.getDate());
        days += Math.floor((current - lastMonth) / (1000 * 60 * 60 * 24));
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    ageResult.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5>Your Age</h5>
                <h3>${years} Years</h3>
                <h5>Months</h5>
                <h3>${months} Months</h3>
                <h5>Days</h5>
                <h3>${days} Days</h3>
            </div>
        </div>
    `;
}

// Set current date as default in the current date input
document.addEventListener('DOMContentLoaded', function() {
    const currentDateInput = document.getElementById('currentDate');
    if (currentDateInput) {
        const today = new Date().toISOString().split('T')[0];
        currentDateInput.value = today;
    }
}); 