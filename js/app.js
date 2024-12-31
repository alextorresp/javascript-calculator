let currentValue = '0';
let previousValue = null;
let currentOperation = null;
let previousOperation = null;
let buttonsClicked = [];

const displayedValue = document.getElementById('displayed-value');
const buttonsContainer = document.getElementById('calc-container');

buttonsContainer.addEventListener('click', (event) => {
  const button = event.target;

  if (button.hasAttribute('data-number')) {
    updateValue(button.getAttribute('data-number'));
    buttonsClicked.push('number');
  } else if (button.hasAttribute('data-operation')) {
    handleOperation(button, button.getAttribute('data-operation'));
    buttonsClicked.push('operation');
  } else if (button.hasAttribute('data-arithmetic-operation')) {
    handleArithmeticOperation(button, button.getAttribute('data-arithmetic-operation'));
    buttonsClicked.push('arithmetic-operation');
  };
});

function updateValue(number) {
  removeActiveArithmeticButton();

  if (buttonsClicked[buttonsClicked.length - 1] === 'arithmetic-operation') {
    number === '.' ? currentValue = '0.' : currentValue = number;
    displayedValue.innerHTML = currentValue;
    return;
  };

  if (findAmountOfDigits(currentValue) === 9) {
    return;
  } else if (currentValue === '0' && number === '.') {
    currentValue += number;
    displayedValue.innerHTML = currentValue;
  } else if (currentValue === '0') {
    currentValue = number;
    displayedValue.innerHTML = currentValue;
  } else {
    let formattedValues = formatValueWithDecimalAndCommas(number, currentValue);
    if (formattedValues) {
      currentValue = formattedValues[0];
      displayedValue.innerHTML = formattedValues[1];
    };
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
    return null;
  } else if (!valueAlreadyHasDecimal && buttonClickedIsDecimal) {
    let updatedValue = currentValue + numberClicked;
    return [updatedValue, addCommas(value, value.length) + '.']
  } else if (!valueAlreadyHasDecimal && !buttonClickedIsDecimal) {
    let updatedValue = currentValue + numberClicked;
    return [updatedValue, addCommas(updatedValue, updatedValue.length)]
  } else if (valueAlreadyHasDecimal && !buttonClickedIsDecimal) {
    let decimalIndex = value.search('\\.');
    let digitsBeforeDecimal = value.slice(0, decimalIndex);
    let digitsWithCommas = addCommas(digitsBeforeDecimal, digitsBeforeDecimal.length);
    let updatedValue = currentValue + numberClicked;
    return [updatedValue, digitsWithCommas + updatedValue.slice(decimalIndex)];
  };
};

function formatCalculatedValue(number) {
  const numberAlreadyHasDecimal = number.search('\\.') != -1;

  if (numberAlreadyHasDecimal) {
    let decimalIndex = number.search('\\.');
    let digitsBeforeDecimal = number.slice(0, decimalIndex);
    let digitsWithCommas = addCommas(digitsBeforeDecimal, digitsBeforeDecimal.length);
    currentValue = number;
    displayedValue.innerHTML = digitsWithCommas + currentValue.slice(decimalIndex);
  } else if (!numberAlreadyHasDecimal) {
    displayedValue.innerHTML = addCommas(number, number.length);
    currentValue = number;
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
      updateArithmeticOperation('divide');
      break;
    case 'multiply':
      updateArithmeticOperation('multiply');
      break;
    case 'subtract':
      updateArithmeticOperation('subtract');
      break;
    case 'add':
      updateArithmeticOperation('add');
      break;
  };
};

function clear() {
  currentValue = '0';
  previousValue = null;
  currentOperation = null;
  previousOperation = null;
  displayedValue.innerHTML = currentValue;
};

function updateArithmeticOperation(operation) {
  currentOperation = operation; 

  if (!previousOperation || (buttonsClicked[buttonsClicked.length - 1] === 'arithmetic-operation')) {
    previousValue = currentValue;
    previousOperation = operation;
  } else if (previousOperation) {
    calculateCurrentValue(currentValue, previousValue, previousOperation);
    previousValue = currentValue;
    previousOperation = operation;
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

function calculateCurrentValue(currVal, prevVal, prevOper) {
  let calculatedValue = null;

  switch(prevOper) {
    case 'multiply': 
      calculatedValue = prevVal * currVal;
      formatCalculatedValue(calculatedValue.toString());
      break;
    case 'divide': 
      calculatedValue = prevVal / currVal;
      formatCalculatedValue(calculatedValue.toString());
      break;
    case 'add':
      calculatedValue = Number(prevVal) + Number(currVal);
      formatCalculatedValue(calculatedValue.toString());
      break;
    case 'subtract': 
      calculatedValue = prevVal - currVal;
      formatCalculatedValue(calculatedValue.toString());
      break;
  };

  return;
};

function changeSign() {
  
};

function percent() {
  
};

function divide() {
  
};

function multiply() {
  
};

function subtract() {
  
};

function add() {
  
};

function equals() {

};














