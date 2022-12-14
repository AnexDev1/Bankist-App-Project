'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-11-23T07:42:02.383Z',
    '2022-11-28T09:15:04.904Z',
    '2022-11-01T10:17:24.185Z',
    '2022-12-07T14:11:59.604Z',
    '2022-12-09T17:01:17.194Z',
    '2022-12-10T23:36:17.929Z',
    '2022-12-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
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

//functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};
//CREATES USERNAME FROM NAME STRING
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

//RELOADS THE UI TO THE UPDATED
const updateUI = function (acc) {
  displayMovements(acc);
  // display Balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

//DISPLAY DEPOSIT AND WITHDRAWALS
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//ACCOUNT BALANCE CALCULATE
const calcDisplayBalance = function (acc) {
  labelBalance.textContent = '';
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

//DISPLAY IN , OUT AND INTEREST
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income.toFixed(2)}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

let currAccount;

//FAKE LOGIN
currAccount = account1;
updateUI(currAccount);
containerApp.style.opacity = 100;

//LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currAccount?.pin === +inputLoginPin.value) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currAccount.locale,
      options
    ).format(now);
    ///////////////////////////////

    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    inputLoginPin.style.border = 'none';
    //display movements
    updateUI(currAccount);
  } else {
    containerApp.style.opacity = 0;
    window.alert(`🔴Wrong pin`);
    inputLoginPin.style.border = 'thin solid rgba(255,0,0,0.3)';
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
  }
});

//TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputLoginPin.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currAccount.balance >= amount &&
    receiverAcc?.username !== currAccount.username
  ) {
    receiverAcc.movements.push(amount);
    currAccount.movements.push(-amount);
    currAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currAccount);
  }
});

//REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);
  if (amount > 0 && currAccount.movements.some(mov => mov >= amount * 0.1)) {
    inputLoanAmount.value = '';
    currAccount.movements.push(amount);
    currAccount.movementsDates.push(new Date().toISOString());
    updateUI(currAccount);
  }
});

//CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currAccount.pin === +inputClosePin.value &&
    currAccount.username === inputCloseUsername.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

//SORT MOVEMENTS
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
