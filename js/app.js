let currentValue = '0';
let previousValue = null;
let displayValue = '0';
let currentOperation = null;
let previousOperation = null;
let buttonsClicked = [];

const displayedValue = document.getElementById('displayed-value');
const buttonsContainer = document.getElementById('calc-container');

buttonsContainer.addEventListener('click', (event) => {
  const button = event.target;

  if (button.hasAttribute('data-number')) {
    handleNumber(button.getAttribute('data-number'));
    buttonsClicked.push('number');
  } else if (button.hasAttribute('data-operation')) {
    handleOperation(button, button.getAttribute('data-operation'));
    buttonsClicked.push('operation');
  } else if (button.hasAttribute('data-arithmetic-operation')) {
    handleArithmeticOperation(button, button.getAttribute('data-arithmetic-operation'));
    buttonsClicked.push('arithmetic-operation');
  };
});

function handleNumber(number) {
  removeActiveArithmeticButton();

  if (buttonsClicked[buttonsClicked.length - 1] === 'arithmetic-operation') {
    currentValue = number === '.' ? '0.' : number;
    displayValue = currentValue;
    displayedValue.innerHTML = displayValue;
    return;
  };
  
  if (findAmountOfDigits(currentValue) === 9) {
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
    let result = updateAndFormatNumberInput(number, currentValue);
    if (result) { 
      const { rawValue, formattedValue } = result;
      currentValue = rawValue;
      displayValue = formattedValue;
      displayedValue.innerHTML = displayValue;
    };
  };
};

function updateAndFormatNumberInput(numberClicked, currValue) {
  const hasDecimal = currValue.includes('.');
  const isDecimalClicked = numberClicked === '.';
  const isNegativeNumber = currValue.includes('-');

  if (hasDecimal && isDecimalClicked) {
    return null;
  };
  
  const absValue = isNegativeNumber ? currValue.slice(1) : currValue;
  let updatedValue = absValue + numberClicked;
  let formattedValue;

  if (!hasDecimal && isDecimalClicked) {
    formattedValue = `${addCommas(absValue)}.`;
  } else if (!hasDecimal && !isDecimalClicked) {
    formattedValue = addCommas(updatedValue);
  } else {
    let decimalIndex = absValue.search('\\.');
    let digitsBeforeDecimal = absValue.slice(0, decimalIndex);
    let digitsWithCommas = addCommas(digitsBeforeDecimal);
    formattedValue = digitsWithCommas + updatedValue.slice(decimalIndex);
  };

  if (isNegativeNumber) {
    formattedValue = `-${formattedValue}`;
    updatedValue = `-${updatedValue}`;
  };

  return {
    rawValue: updatedValue,
    formattedValue: formattedValue
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

function handleArithmeticOperation(button, operation) {
  setActiveArithmeticButton(button);

  currentOperation = operation; 

  if (!previousOperation || (buttonsClicked[buttonsClicked.length - 1] === 'arithmetic-operation')) {
    previousValue = currentValue;
    previousOperation = operation;
  } else if (previousOperation) {
    const { rawValue, formattedValue } = calculateCurrentValue(currentValue, previousValue, previousOperation);
    currentValue = rawValue;
    displayValue = formattedValue;
    displayedValue.innerHTML = displayValue;
    previousValue = currentValue;
    previousOperation = operation;
  };
};

function calculateCurrentValue(currVal, prevVal, prevOper) {
  let calculatedValue, formattedValue;

  switch(prevOper) {
    case 'multiply': 
      calculatedValue = prevVal * currVal;
      break;
    case 'divide': 
      calculatedValue = prevVal / currVal;
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

function formatCalculatedValue(value) {
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

function formatValueBasedOnLength(rawValue) {
  if (findAmountOfDigits(rawValue) <= 9) return rawValue;

  if (Number(absValue(rawValue)) < 1 || Number(absValue(rawValue)) > 999999999) {
    return toScientificNotation(rawValue);
  } else {
    return roundNumber(rawValue);
  };
};

function clear() {
  currentValue = '0';
  displayValue = '0';
  previousValue = null;
  currentOperation = null;
  previousOperation = null;
  displayedValue.innerHTML = currentValue;
  buttonsClicked = [];
};

function equals() {
  if (!previousOperation) {
    return;
  } else if (previousOperation && previousValue && currentValue) {
    const { rawValue, formattedValue } = calculateCurrentValue(currentValue, previousValue, previousOperation);
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

function addCommas(value) {
  const length = value.length;

  if (length < 4) {
    return value;
  } else if (length >= 4 && length < 7) {
    return value.slice(0, length - 3) + ',' + value.slice(length - 3);
  } else {
    return value.slice(0, length - 6) + ',' + value.slice(length - 6, length - 3) + ',' + value.slice(length - 3);
  };
};

function findAmountOfDigits(rawValue) {
  if (rawValue.includes('-') && rawValue.includes('.')) {
    return rawValue.length - 2;
  } else if (rawValue.includes('-') || rawValue.includes('.')) {
    return rawValue.length - 1;
  };

  return rawValue.length;
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

function absValue(rawValue) {
  return rawValue.startsWith('-') ? rawValue.slice(1) : rawValue;
};

function setActiveArithmeticButton(clickedButton) {
  removeActiveArithmeticButton();
  clickedButton.classList.add('active-button');
};

function removeActiveArithmeticButton() {
  let arithmeticButtons = document.querySelectorAll('.arithmetic-operation');
  arithmeticButtons.forEach(button => button.classList.remove('active-button'));
};












