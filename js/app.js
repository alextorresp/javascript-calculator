let currentValue = 0;

const displayedNumber = document.getElementById('displayed-number');
const buttonsContainer = document.getElementById('calc-container');

buttonsContainer.addEventListener('click', (event) => {
  const button = event.target;

  if (button.hasAttribute('data-number')) {
    displayNumber(button.getAttribute('data-number'));
  } else if (button.hasAttribute('data-operation')) {
    handleOperation(button.getAttribute('data-operation'));
  };
});

function displayNumber(number) {
  if (currentValue === 0) {
    currentValue = number;
  } else {
    currentValue += number;
  }
  displayedNumber.innerHTML = currentValue;
};

function handleOperation(operation) {

};














