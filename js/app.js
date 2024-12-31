let currentValue = '0';
let previousOperation = null;
let previousValue = null;

const displayedValue = document.getElementById('displayed-value');
const buttonsContainer = document.getElementById('calc-container');

buttonsContainer.addEventListener('click', (event) => {
  const button = event.target;

  if (button.hasAttribute('data-number')) {
    updateValue(button.getAttribute('data-number'));
  } else if (button.hasAttribute('data-operation')) {
    handleOperation(button, button.getAttribute('data-operation'));
  } else if (button.hasAttribute('data-arithmetic-operation')) {
    handleArithmeticOperation(button, button.getAttribute('data-arithmetic-operation'))
  };
});

function updateValue(number) {
  removeActiveArithmeticButton();

  if (findAmountOfDigits(currentValue) === 9) {
    return;
  } else if (currentValue === '0' && number === '.') {
    currentValue += number;
    displayedValue.innerHTML = currentValue;
  } else if (currentValue === '0') {
    currentValue = number;
    displayedValue.innerHTML = currentValue;
  } else {
    formatValueWithDecimalAndCommas(number, currentValue);
  };
};

function addCommas(value, length) {
  if (length < 4) {
    return value;
  } else if (length >= 4 && length < 7) {
    return value.slice(0, length - 3) + ',' + value.slice(length - 3);
  } else {
    return value.slice(0, length - 6) + ',' + value.slice(length - 6, length - 3) + ',' + value.slice(length - 3);
  };
};

function findAmountOfDigits(value) {
  let index = value.search('\\.');
  if (index === -1) {
    return value.length;
  } else {
    return value.length - 1;
  };
};

function formatValueWithDecimalAndCommas(numberClicked, value) {
  const valueAlreadyHasDecimal = value.search('\\.') != -1;
  const buttonClickedIsDecimal = numberClicked === '.';

  if (valueAlreadyHasDecimal && buttonClickedIsDecimal) {
    return;
  } else if (!valueAlreadyHasDecimal && buttonClickedIsDecimal) {
    displayedValue.innerHTML = addCommas(value, value.length) + '.';
    currentValue += numberClicked;
  } else if (!valueAlreadyHasDecimal && !buttonClickedIsDecimal) {
    currentValue += numberClicked;
    displayedValue.innerHTML = addCommas(currentValue, currentValue.length);
  } else if (valueAlreadyHasDecimal && !buttonClickedIsDecimal) {
    let decimalIndex = value.search('\\.');
    let digitsBeforeDecimal = value.slice(0, decimalIndex);
    let digitsWithCommas = addCommas(digitsBeforeDecimal, digitsBeforeDecimal.length);
    currentValue += numberClicked;
    displayedValue.innerHTML = digitsWithCommas + currentValue.slice(decimalIndex);
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
  switch (operation) {
    case 'divide': 
      divide();
      break;
    case 'multiply':
      multiply();
      break;
    case 'subtract':
      subtract();
      break;
    case 'add':
      add();
      break;
  };
};

function clear() {
  currentValue = '0';
  displayedValue.innerHTML = currentValue;
};

function updateOperation(currentOperation) {
  if (!previousOperation) {
    previousValue = currentValue;
    previousOperation = currentOperation;
    console.log('previousOperation', previousOperation)
  } else if (previousOperation && (previousValue != currentValue)) {
    calculateNewCurrentValue();
  };
};

function setActiveArithmeticButton(clickedButton) {
  removeActiveArithmeticButton();
  clickedButton.classList.add('active-button');
};

function removeActiveArithmeticButton() {
  let arithmeticButtons = document.querySelectorAll('.arithmetic-operation');

  arithmeticButtons.forEach(button => button.classList.remove('active-button'));
};

function changeSign() {
  
};

function percent() {
  
};

function divide() {
  
};

function multiply() {
  updateOperation('multiply');
};

function subtract() {
  
};

function add() {
  
};

function equals() {

};

function calculateNewCurrentValue() {
  
};














