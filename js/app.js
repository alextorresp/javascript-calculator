let currentValue = '0';
let displayValue = '0';
let previousValue = null;
let previousOperation = null;
let previousClick = null;
const errorMsg = 'Error';

const displayedValue = document.getElementById('displayed-value');
const buttonsContainer = document.getElementById('calc-container');

buttonsContainer.addEventListener('click', (event) => {
  if (event.target.hasAttribute('data-number')) {
    handleNumber(event.target.getAttribute('data-number'));
    previousClick = 'number';
  } else if (event.target.hasAttribute('data-operation')) {
    handleOperation(event.target.getAttribute('data-operation'));
    previousClick = 'operation';
  } else if (event.target.hasAttribute('data-arithmetic-operation')) {
    handleArithmeticOperation(event.target, event.target.getAttribute('data-arithmetic-operation'));
    previousClick = 'arithmetic-operation';
  };
});

function addCommas(value) {
  const [digitsBeforeDecimal, digitsAfterDecimal] = value.split('.');
  const absoluteValue = value.startsWith('-') ? absValue(digitsBeforeDecimal) : digitsBeforeDecimal;
  const length = absoluteValue.length;
  let formattedValue = '';  

  if (length < 4) {
    formattedValue = absoluteValue;
  } else if (length >= 4 && length < 7) {
    formattedValue = absoluteValue.slice(0, length - 3) + ',' + absoluteValue.slice(length - 3);
  } else {
    formattedValue = absoluteValue.slice(0, length - 6) + ',' + absoluteValue.slice(length - 6, length - 3) + ',' + absoluteValue.slice(length - 3);
  };

  formattedValue = digitsAfterDecimal ? `${formattedValue}.${digitsAfterDecimal}` : formattedValue;
  return value.startsWith('-') ? `-${formattedValue}` : formattedValue;
};

function absValue(rawValue) {
  return rawValue.startsWith('-') ? rawValue.slice(1) : rawValue;
};

function updateAndFormatNumberInput(numberClicked, currValue) {
  const hasDecimal = currValue.includes('.');
  const isDecimalClicked = numberClicked === '.';
  let updatedValue = currValue + numberClicked;
  let formattedValue;

  if (hasDecimal && isDecimalClicked) {
    return null;
  } else if (!hasDecimal && isDecimalClicked) {
    formattedValue = `${addCommas(currValue)}.`;
  } else {
    formattedValue = addCommas(updatedValue);
  };

  return {
    rawValue: updatedValue,
    formattedValue: formattedValue
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

function formatNumberByDigitCount(rawValue) {
  if (findAmountOfDigits(rawValue) <= 9) return rawValue;

  if (Number(absValue(rawValue)) < 0.1 || Number(absValue(rawValue)) > 999999999) {
    return toScientificNotation(rawValue);
  } else {
    return roundNumber(rawValue);
  };
};

function formatCalculatedValue(value) {
  if (value === errorMsg) return value;
  const formattedLength = formatNumberByDigitCount(value);
  if (formattedLength.includes('e')) return formattedLength;
  return addCommas(formattedLength);
};

function calculateCurrentValue(currVal, prevVal, prevOper) {
  let calculatedValue;

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

  return calculatedValue.toString();
};

function setValues(currValue, dispValue) {
  currentValue = currValue;
  displayValue = dispValue;
  displayedValue.innerHTML = dispValue;
};

function setPreviousValues(prevValue, prevOper) {
  previousValue = prevValue;
  previousOperation = prevOper;
};

function handleArithmeticOperation(button, operation) {
  setActiveArithmeticButton(button);

  if (!previousOperation || (previousClick === 'arithmetic-operation')) {
    setPreviousValues(currentValue, operation);
  } else if (previousOperation) {
    const calculatedValue = calculateCurrentValue(currentValue, previousValue, previousOperation);
    if (calculatedValue === errorMsg) return handleDivisonByZero();
    const formattedValue = formatCalculatedValue(calculatedValue);
    setValues(calculatedValue, formattedValue);
    setPreviousValues(currentValue, operation);
  };
};

function handleNumber(number) {
  removeActiveArithmeticButton();
  
  if (previousClick === 'arithmetic-operation') {
    const updatedNumber = number === '.' ? '0.' : number;
    setValues(updatedNumber, updatedNumber);
    return;
  };

  if (findAmountOfDigits(currentValue) >= 9) return;

  if (currentValue === '0' && number === '.') {
    setValues(currentValue + number, currentValue + number);
  } else if (currentValue === '0') {
    setValues(number, number);
  } else {
    const result = updateAndFormatNumberInput(number, currentValue);
    if (result) { 
      const { rawValue, formattedValue } = result;  
      setValues(rawValue, formattedValue);
    };
  };
};

function handleOperation(operation) {
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
  setValues('0', '0');
  setPreviousValues(null, null);
  previousClick = null;
};

function equals() {
  if (!previousOperation) {
    return;
  } else if (previousOperation && previousValue && currentValue) {
    const calculatedValue = calculateCurrentValue(currentValue, previousValue, previousOperation);
    const formattedValue = formatCalculatedValue(calculatedValue);
    if (calculatedValue === errorMsg) return handleDivisonByZero();
    setValues(calculatedValue, formattedValue);
    previousOperation = null;
  };
};

function changeSign() {
  if (currentValue.includes('-')) {
    setValues(currentValue.replace('-', ''), displayValue.replace('-', ''));
  } else if (!currentValue.includes('-') && currentValue !== '0' & currentValue !== '0.') {
    setValues(`-${currentValue}`, `-${displayValue}`);
  };
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
  setValues('0', errorMsg)
  setPreviousValues(null, null);
};












