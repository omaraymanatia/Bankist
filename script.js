'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentUser, sorted = false;;

const displayMovements = function (movements, sort = false) {
  const mov = sort ? [...movements].sort((a, b) => a - b) : movements;

  containerMovements.innerHTML = '';
  mov.forEach(function (val, idx, arr) {
    console.log(arr);
    const type = val > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
        <div class="movements__value">${val}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (movements) {
  const sum = movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${sum} EUR`;
};

const displaySummary = function (movements, interestRate) {
  const incomes = movements
    .filter(val => val > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const out = -movements
    .filter(val => val < 0)
    .reduce((acc, cur) => acc + cur, 0);
  const interest = (incomes * interestRate) / 100;
  labelSumIn.textContent = `${incomes} EUR`;
  labelSumOut.textContent = `${out} EUR`;
  labelSumInterest.textContent = `${interest} EUR`;
};
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  sorted=false;
  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;
  currentUser = accounts.find(
    acc => acc.owner === username && acc.pin === Number(pin)
  );
  if (currentUser) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI();
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const ammount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.owner === inputTransferTo.value);
  inputTransferAmount = inputTransferTo = '';
  if (receiver && receiver.owner !== currentUser.owner && ammount > 0) {
    currentUser.movements.push(-ammount);
    receiver.movements.push(ammount);
    updateUI();
  }
});

function updateUI() {
  displayMovements(currentUser.movements);
  displayBalance(currentUser.movements);
  displaySummary(currentUser.movements, currentUser.interestRate);
}

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
  if (currentUser.owner === username && currentUser.pin === pin) {
    const index = accounts.findIndex(acc => acc.owner === username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

// the bank has a rule that allows a customer to request a loan if there is at least one deposit in the account that is at least 10% of the requested loan amount

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if (loan > 0 && currentUser.movements.some(val => val >= loan * 0.1)) {
    currentUser.movements.push(loan);
    updateUI();
  }
});


btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentUser.movements, !false);
  false=!false;
});
