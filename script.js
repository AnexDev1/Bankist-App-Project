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

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
const updateUI = function (acc) {
  displayMovements(acc.movements);
  // display Balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

createUserNames(accounts);

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  labelBalance.textContent = '';
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

let currAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

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

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputLoginPin.blur();
  if (
    amount > 0 &&
    reciverAcc &&
    currAccount.balance >= amount &&
    reciverAcc?.username !== currAccount.username
  ) {
    reciverAcc.movements.push(amount);
    currAccount.movements.push(-amount);

    updateUI(currAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currAccount.movements.some(mov => mov >= amount * 0.1)) {
    inputLoanAmount.value = '';
    currAccount.movements.push(amount);
    updateUI(currAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currAccount.pin === Number(inputClosePin.value) &&
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
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd'];
// arr.slice(1, 3);
// console.log(arr);
// //slice does not affect the original array
// console.log(arr.slice(1, 3));
// //splice affect the original array
// // console.log(arr.splice(1, 3));
// //.slice creates a copy of the array if u store it in a variable or just log it to the console
// const newArr = arr.slice();
// console.log(newArr);

// console.log(newArr.reverse());
// let arr2 = ['e', 'f', 'g', 'h', 'i', 'j'];
// console.log(arr2);
// let all = [...arr, ...arr2];
// console.log(all);
// let joined = arr.concat(arr2);
// console.log(joined);
// console.log(joined.join('-'));
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You Deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You Withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log(`------------FOR EACH-------`);
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You Deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You Withdrew ${Math.abs(mov)}`);
//   }
// });
//CODING CHALLENGE 1
// const julia = [3, 5, 2, 12, 7];
// const kate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogJulia, dogKate) {
//   const copy = dogJulia.slice().splice(1, 2);
//   console.log(copy);
//   console.log(dogJulia);
//   const allAges = [...copy, ...dogKate];
//   console.log(allAges);
//   allAges.forEach(function (age, i, ages) {
//     console.log(
//       `Dog number ${i + 1} is ${
//         age >= 3 ? 'an adult🐕' : 'still a puppy🐶'
//       } and is ${age} years old`
//     );
//   });
// };

// // checkDogs(julia, kate);
// const euroToUsd = 1.1;

// const movementsUSD = movements.map(mov => Math.floor(mov * euroToUsd));
// console.log(movements);
// console.log(movementsUSD);

// const movements1 = movements.map(
//   (mov, i, arr) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'Deposited' : 'Withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movements1);
//FILTER
const deposits = movements.filter(mov => mov > 0);
const withdrawal = movements.filter(mov => mov < 0);
// console.log(deposits);
// console.log(withdrawal);

const balance = movements.reduce((acc, curr) => acc + curr, 0);
// console.log(balance);

//maxvalue
const maxValue = movements.reduce(
  (acc, curr) => (acc > curr ? acc : curr),
  movements[0]
);
// console.log(maxValue);
const calcAverageHumanAge = function (ages) {
  const humanAges = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  return humanAges;
};
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log(avg1);
