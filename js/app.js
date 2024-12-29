let currentValue = '0';

const displayedValue = document.getElementById('displayed-value');
const buttonsContainer = document.getElementById('calc-container');

buttonsContainer.addEventListener('click', (event) => {
  const button = event.target;

  if (button.hasAttribute('data-number')) {
    updateValue(button.getAttribute('data-number'));
  } else if (button.hasAttribute('data-operation')) {
    handleOperation(button.getAttribute('data-operation'));
  };
});

function updateValue(number) {
  if ((number === '.') && (currentValue.toString().search('\\.') != -1 )) {
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
  } 
    // if you don't click . and there is not a period already there
    else if (number != '.' && currentValue.toString().search('\\.') === -1) {
    currentValue += number;
    displayedValue.innerHTML = addCommas(currentValue, currentValue.length);
  } 
    // if you click . and there is not a period already there
    else if ((number === '.') && (currentValue.search('\\.') === -1 )) {
    displayedValue.innerHTML = addCommas(currentValue, currentValue.length) + '.';
    currentValue += number;
  }
    // if you don't click . and there is a . already there
    if (number != '.' && currentValue.search('\\.') != -1 ) {
      let index = currentValue.search('\\.');
      let digitsBeforeDecimal = currentValue.slice(0, index);
      let digitsWithCommas = addCommas(digitsBeforeDecimal, digitsBeforeDecimal.length);
      currentValue += number;
      displayedValue.innerHTML = digitsWithCommas + currentValue.slice(index);
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
  let index = value.toString().search('\\.');
  if (index === -1) {
    return value.toString().length;
  } else {
    return value.toString().length - 1;
  };
};

function handleOperation(operation) {

};

function formatCurrentValueToDisplay(numberClicked, currentValue) {
  
};












