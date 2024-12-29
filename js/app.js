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
  const currentValueLength = currentValue.toString().length;
  if (currentValueLength === 9) {
    return;
  } else if (currentValue === 0) {
    currentValue = number;
    displayedValue.innerHTML = currentValue;
  } else {
    currentValue += number;
    displayedValue.innerHTML = formatCurrentValue();
  };
};

function handleOperation(operation) {

};

function formatCurrentValue() {
  let displayValue = currentValue;
  const currentValueLength = currentValue.toString().length;

  if (currentValueLength === 4) {
    displayValue = currentValue.slice(0, 1) + ',' + currentValue.slice(1);
  } else if (currentValueLength === 5) {
    displayValue = currentValue.slice(0, 2) + ',' + currentValue.slice(2);
  } else if (currentValueLength === 6) {
    displayValue = currentValue.slice(0, 3) + ',' + currentValue.slice(3);
  } else if (currentValueLength === 7) {
    displayValue = currentValue.slice(0, 1) + ',' + currentValue.slice(1, 4) + ',' + currentValue.slice(4);
  } else if (currentValueLength === 8) {
    displayValue = currentValue.slice(0, 2) + ',' + currentValue.slice(2, 5) + ',' + currentValue.slice(5);
  } else if (currentValueLength === 9) {
    displayValue = currentValue.slice(0, 3) + ',' + currentValue.slice(3, 6) + ',' + currentValue.slice(6);
  }
  return displayValue;
};















