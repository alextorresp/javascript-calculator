let currentValue = 0;

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
  if (currentValue.toString().length === 9) {
    return;
  } else if (currentValue === 0) {
    currentValue = number;
    displayedValue.innerHTML = currentValue;
  } else {
    currentValue += number;
    displayedValue.innerHTML = addCommas(currentValue, currentValue.toString().length);
  };
};

function handleOperation(operation) {

};

function formatCurrentValue(value, valueLength) {
  
};

function addCommas(value, length) {
  if (length < 4) {
    return value;
  } else if (length >= 4 && length < 7) {
    return value.slice(0, length - 3) + ',' + value.slice(length - 3);
  } else {
    return value.slice(0, length - 6) + ',' + value.slice(length - 6, length - 3) + ',' + value.slice(length - 3);
  }
};

function findDecimals() {

};














