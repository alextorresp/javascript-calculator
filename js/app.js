const errorMsg = 'Error';
let currentValue = '0';
let displayValue = '0';
let previousValue = null;
let currentOperation = null;
let previousOperation = null;
let previousClick = null;

const displayedValue = document.getElementById('displayed-value');
const buttonsContainer = document.getElementById('calc-container');

buttonsContainer.addEventListener('click', (event) => {
  const button = event.target;

  if (button.hasAttribute('data-number')) {
    handleNumber(button.getAttribute('data-number'));
    previousClick = 'number';
  } else if (button.hasAttribute('data-operation')) {
    handleOperation(button, button.getAttribute('data-operation'));
    previousClick = 'operation';
  } else if (button.hasAttribute('data-arithmetic-operation')) {
    handleArithmeticOperation(button, button.getAttribute('data-arithmetic-operation'));
    previousClick = 'arithmetic-operation';
  };
});

function addCommas(rawValue) {
  const length = rawValue.length;

  if (length < 4) {
    return rawValue;
  } else if (length >= 4 && length < 7) {
    return rawValue.slice(0, length - 3) + ',' + rawValue.slice(length - 3);
  } else {
    return rawValue.slice(0, length - 6) + ',' + rawValue.slice(length - 6, length - 3) + ',' + rawValue.slice(length - 3);
  };
};

function absValue(rawValue) {
  return rawValue.startsWith('-') ? rawValue.slice(1) : rawValue;
};

function updateAndFormatNumberInput(numberClicked, currValue) {
  const hasDecimal = currValue.includes('.');
  const isDecimalClicked = numberClicked === '.';
  
  if (hasDecimal && isDecimalClicked) return null;
  
  const isNegativeNumber = currValue.includes('-');
  let updatedValue = absValue(currValue) + numberClicked;
  let formattedValue;

  if (!hasDecimal && isDecimalClicked) {
    formattedValue = `${addCommas(absValue(currValue))}.`;
  } else if (!hasDecimal && !isDecimalClicked) {
    formattedValue = addCommas(updatedValue);
  } else {
    const [digitsBeforeDecimal, digitsAfterDecimal] = updatedValue.split('.');
    formattedValue = `${addCommas(digitsBeforeDecimal)}.${digitsAfterDecimal}`;
  };

  return {
    rawValue: isNegativeNumber ? `-${updatedValue}`: updatedValue,
    formattedValue: isNegativeNumber ? `-${formattedValue}`: formattedValue
  };
};

function findAmountOfDigits(rawValue) {
  return rawValue.replace(/[^0-9]/g, '').length;
};

function setActiveArithmeticButton(clickedButton) {
  removeActiveArithmeticButton();
  clickedButton.classList.add('active-button');
};

function removeActiveArithmeticButton() {
  let arithmeticButtons = document.querySelectorAll('.arithmetic-operation');
  arithmeticButtons.forEach(button => button.classList.remove('active-button'));
};

function formatValueBasedOnLength(rawValue) {
  if (findAmountOfDigits(rawValue) <= 9) return rawValue;

  if (Number(absValue(rawValue)) < 0.1 || Number(absValue(rawValue)) > 999999999) {
    return toScientificNotation(rawValue);
  } else {
    return roundNumber(rawValue);
  };
};

function formatCalculatedValue(value) {
  if (value === errorMsg) return value;

  const formattedLength = formatValueBasedOnLength(value);
  
  if (formattedLength.includes('e')) {
    return formattedLength;
  };
  
  const isNegativeNumber = value.includes('-');
  const absValue = isNegativeNumber ? formattedLength.slice(1) : formattedLength;
  const [integerPart, decimalPart] = absValue.split('.');

  const formattedInteger = addCommas(integerPart);
  const formattedValue = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;

  return isNegativeNumber ? `-${formattedValue}` : formattedValue;
};

function calculateCurrentValue(currVal, prevVal, prevOper) {
  let calculatedValue, formattedValue;

  switch(prevOper) {
    case 'multiply': 
      calculatedValue = prevVal * currVal;
      break;
    case 'divide': 
      calculatedValue = currVal === '0' ? errorMsg : prevVal / currVal;
      break;
    case 'add':
      calculatedValue = Number(prevVal) + Number(currVal);
      break;
    case 'subtract': 
      calculatedValue = prevVal - currVal;
      break;
  };

  formattedValue = formatCalculatedValue(calculatedValue.toString());

  return {
    rawValue: calculatedValue.toString(),
    formattedValue: formattedValue
  };
};

function handleArithmeticOperation(button, operation) {
  setActiveArithmeticButton(button);

  currentOperation = operation; 

  if (!previousOperation || (previousClick === 'arithmetic-operation')) {
    previousValue = currentValue;
    previousOperation = operation;
  } else if (previousOperation) {
    const { rawValue, formattedValue } = calculateCurrentValue(currentValue, previousValue, previousOperation);
    if (rawValue === errorMsg) {
      handleDivisonByZero();
      return;
    };
    currentValue = rawValue;
    displayValue = formattedValue;
    displayedValue.innerHTML = displayValue;
    previousValue = currentValue;
    previousOperation = operation;
  };
};

function handleNumber(number) {
  removeActiveArithmeticButton();

  if (previousClick === 'arithmetic-operation') {
    currentValue = number === '.' ? '0.' : number;
    displayValue = currentValue;
    displayedValue.innerHTML = displayValue;
    return;
  };

  if (findAmountOfDigits(currentValue) >= 9) {
    return;
  } else if (currentValue === '0' && number === '.') {
    currentValue += number;
    displayValue = currentValue;
    displayedValue.innerHTML = displayValue;
  } else if (currentValue === '0') {
    currentValue = number;
    displayValue = currentValue;
    displayedValue.innerHTML = displayValue;
  } else {
    const result = updateAndFormatNumberInput(number, currentValue);
    if (result) { 
      const { rawValue, formattedValue } = result;
      currentValue = rawValue;
      displayValue = formattedValue;
      displayedValue.innerHTML = displayValue;
    };
  };
};

function handleOperation(button, operation) {
  removeActiveArithmeticButton();

  switch (operation) {
    case 'clear': 
      clear();
      break;
    case 'change-sign':
      changeSign();
      break;
    case 'percent':
      percent();
      break;
    case 'equals': 
      equals();
      break;
  };
};

function clear() {
  currentValue = '0';
  displayValue = '0';
  previousValue = null;
  currentOperation = null;
  previousOperation = null;
  displayedValue.innerHTML = currentValue;
  previousClick = null;
};

function equals() {
  if (!previousOperation) {
    return;
  } else if (previousOperation && previousValue && currentValue) {
    const { rawValue, formattedValue } = calculateCurrentValue(currentValue, previousValue, previousOperation);
    if (rawValue === errorMsg) {
      handleDivisonByZero();
      return;
    };
    currentValue = rawValue;
    displayValue = formattedValue;
    displayedValue.innerHTML = displayValue;
    previousOperation = null;
    currentOperation = null;
  };
};

function changeSign() {
  const isNegativeNumber = currentValue.includes('-');

  if (isNegativeNumber) {
    currentValue = currentValue.replace('-', '');
    displayValue = displayValue.replace('-', '');
  } else if (!isNegativeNumber && currentValue != '0') {
    currentValue = '-' + currentValue;
    displayValue = '-' + displayValue;
  };

  displayedValue.innerHTML = displayValue;
};

function percent() {
  currentValue = (Number(currentValue) / 100).toString();
  displayValue = formatCalculatedValue(currentValue.toString());
  displayedValue.innerHTML = displayValue;
};

function toScientificNotation(rawValue) {
  const isNegativeNumber = rawValue.startsWith('-');
  const abValue = absValue(rawValue);
  const notatedNumber = Number(abValue).toExponential(5).toString();
  return isNegativeNumber ? `-${notatedNumber}`: notatedNumber;
};

function roundNumber(value) {
  const isNegativeNumber = value.startsWith('-');
  const abValue = absValue(value);
  const [integerPart, decimalPart] = abValue.split('.');
  const amountOfDecimalPlaces =  9 - integerPart.length;
  const roundedNumber = Number(abValue).toFixed(amountOfDecimalPlaces).toString();
  return isNegativeNumber ? `-${roundedNumber}`: roundedNumber;
};

function handleDivisonByZero() {
  currentValue = '0';
  displayValue = errorMsg;
  displayedValue.innerHTML = displayValue;
  previousValue = null;
  previousOperation = null;
};












