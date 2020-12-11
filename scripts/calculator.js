// set constants
const $display = document.querySelector('.calc-display-inner');
const $calcContainer = document.querySelector('.calc-container');
const $clearButton = document.querySelector('.button--clear');

// set variables
let firstNum = 0;
let firstNumWithZero = "";
let secondNum = 0;
let sumOperator = "";
let displayLength;
let buttonValue;

/************************************************
                 ** main calc function
                 ************************************************/
function myCalcFunction(kbdKey) {
  // pass keydown 'key' value or button value via mouse click to buttonValue
  if (kbdKey.type != 'click') {
    buttonValue = kbdKey; // pass keydown key value
  } else {
    buttonValue = this.dataset.key; // get clicked button value
    changeButtonState(this); // toggle background colour
  }
  let buttonValueInt = parseInt(buttonValue); // get integer of button value for check further down
  let preClickDisplayValue = $display.textContent; // get number in $display pre click

  // for clicked numbers
  if (Number.isInteger(buttonValueInt) || buttonValue === '.') {
    // very first button clicked
    // reset $display if zero and ensure only 1 decimal place can be input
    if (preClickDisplayValue === "0" || buttonValue === ".") {
      if (buttonValue === "." && firstNum === "0.") {
        firstNum = "0."; // ensures '0..' can never be entered
      } else if (buttonValue === ".") {
        let regEx = /^[0-9]*$/; // regex to check if string is number
        // if firstNum doesn't already have a decimal point, add it in
        if (regEx.test(firstNum) === true) {
          firstNum = preClickDisplayValue + buttonValue; // ensure number and decimal after can be entered
        }
      } else {
        firstNum = buttonValue; // set firstNum to clicked number
      }
      resetDisplay(""); // remove zero from $display
      replaceHtmlText($display, firstNum); // add clicked value to $display
    } else {// second button clicked
      if ($calcContainer.classList.contains('js-action-clicked')) {
        if (secondNum != 0) {// setting secondNum if action clicked
          removePercClass($display); // reset font size for second number in sum
          secondNum = preClickDisplayValue += buttonValue; // set number clicked to secondNum
          replaceHtmlText($display, secondNum);
        } else {
          resetDisplay(""); // remove firstNum from display
          removePercClass($display); // reset font size
          secondNum = buttonValue; // set secondNum
          replaceHtmlText($display, secondNum);
        }
      } else if (!$display.classList.contains('js-zeros-added')) {//
        firstNum = preClickDisplayValue += buttonValue; // set number in display to firstNum
        firstNumWithZero = preClickDisplayValue += buttonValue; // still need to set this here
        replaceHtmlText($display, firstNum); // append clicked value to $display
      } else {
        firstNum = firstNum += buttonValue; // preClickDisplayValue has zeros here so we can't use it
        firstNumWithZero = preClickDisplayValue += buttonValue; // we need to know what firstNum is with zeros.
      }
    }
    // change clear text from AC to C
    replaceHtmlText($clearButton, "C");

  } else {
    // for all non number buttons (actions)
    // if button value was sum operator
    if (buttonValue != "=" && buttonValue != "Escape" && buttonValue != "Enter") {
      addClassToDOM($calcContainer, 'js-action-clicked'); // set flag to show sum operator clicked
      sumOperator = buttonValue; // get sum operator data-key value
    }

    if (buttonValue === "=" || buttonValue === "Enter") {
      // checking all values are present after = click
      if (firstNum && sumOperator && secondNum) {
        resetDisplay(""); // remove previous numbers from display

        // convert keyed numbers to integers
        firstNum = parseFloat(firstNum);
        secondNum = parseFloat(secondNum);

        let calcResult = doSum(firstNum, sumOperator, secondNum); // do calculation
        replaceHtmlText($display, calcResult); // add result to display
        removeClassFromDOM($calcContainer, 'js-action-clicked'); // remove flag as sum has ocurred
        firstNum = calcResult.toString(); // store result as firstNum incase of new sum off this number
        secondNum = 0; // reset secondNum ready for another calculation
      }
    }

    // set number in display to negative/positive version of value in display
    if (buttonValue === "+/-") {
      let displayedInteger = parseFloat(preClickDisplayValue); // set displayed number to integer
      let newValue = displayedInteger * -1; // get negated value ie 8 would be -8 etc
      let newValueString = newValue.toString(); // set new number to a string
      resetDisplay(""); // remove previous number from display
      replaceHtmlText($display, newValueString); // add new number to display
      firstNum = newValueString; // set new number to firstNum for further calculations if needed
    }

    // percentage action
    if (buttonValue === "%") {
      let displayedInteger = parseFloat(preClickDisplayValue); // set displayed number to integer
      let newValue = displayedInteger / 100; // get percentage value of displayed number
      let newValueString = newValue.toString(); // set new number to a string
      resetDisplay(""); // remove previous number from display
      replaceHtmlText($display, newValueString); // add new number to display
      firstNum = newValueString; // set new number to firstNum for further calculations if needed
    }

    // fn+backspace keydown to delete last entered number
    if (buttonValue === "Delete") {
      deleteLastNo();
    }

    // clear action
    if (buttonValue === "Escape") {
      resetCalculator($calcContainer, $clearButton, "AC", $display);
    }
  }

  // get number currently in display (not including current clicked value)
  let postClickDisplayValue = $display.textContent;

  // get length of entered number to reuse below
  displayLength = postClickDisplayValue.length;

  // get length of entered firstNum to reuse below
  let enteredNoLength = firstNum.length;

  // reduce font size only when firstNum is over 7
  if (enteredNoLength > 7) {
    // change font-size of display for larger entered numbers
    changeDisplayFontSize($display, enteredNoLength);
  }

  if (enteredNoLength > 38) {
    // change entered digits at end of display number to zeros
    addZerosAndtrimLargeDigits($display, enteredNoLength, firstNumWithZero, displayLength);
  }
}

/************************************************
  ** our listeners
  ************************************************/

// loop through buttons & add event listener to run main calc function
let buttons = Array.from(document.querySelectorAll('.button'));
buttons.forEach(key => key.addEventListener('click', myCalcFunction)); // ES6 schiz

// handle keyboard actions
document.addEventListener('keydown', keyActions);

/************************************************
                                                  ** helper functions
                                                  ************************************************/

/**
                                                                                                    * calculate the sum entered
                                                                                                    **/
function doSum(n1, op, n2) {
  if (op === "add" || op === "+") {
    return n1 + n2;
  } else if (op === "subtract" || op === "-") {
    return n1 - n2;
  } else if (op === "divide" || op === "/") {
    return n1 / n2;
  } else if (op === "multiply" || op === "*") {
    return n1 * n2;
  }
}

/**
  * reset calculator:
  * reset display to '0'
  * reset stored entered numbers
  * replace clear button value
  * remove js- classes
  **/
function resetCalculator(calcEl, clearButtonEl, clearButtonValue, displayEl) {
  resetDisplay('0');
  firstNum = 0;
  secondNum = 0;
  calcEl.classList.remove('js-action-clicked');
  replaceHtmlText(clearButtonEl, clearButtonValue);
  removePercClass(displayEl);
  removeZeroClass(displayEl);
  removeJsClass(displayEl, 'js-zeros-added');
}

/**
  * reset display number
  **/
function resetDisplay(value) {
  $display.textContent = value;
}

/**
  * replace html text in el
  **/
function replaceHtmlText(el, value) {
  el.textContent = value;
}

/**
  * add class to DOM
  **/
function addClassToDOM(el, cl) {
  el.classList.add(cl);
}

/**
  * remove class from DOM
  **/
function removeClassFromDOM(el, cl) {
  el.classList.remove(cl);
}

/**
  * remove any existing js-font-size class from el
  */
function removePercClass(el) {
  // get classes on el. Eg: "calc-display-inner js-font-size-90"
  let clLi = el.classList;

  // loop through all classes on el
  for (let i = 0; i < clLi.length; i++) {
    // if class in classList starts with 'js-font-size-' remove class from el
    if (clLi[i].match(/^js-font-size-/)) {
      removeClassFromDOM(el, clLi[i]);
    }
  }
}

/**
  * remove any existing js-classes from el
  */
function removeJsClass(el, cl) {
  // get list of classes on el
  let clLi = el.classList;

  // loop through all classes on el
  for (let i = 0; i < clLi.length; i++) {
    // if class in classList contains cl remove it from el
    if (clLi[i] === cl) {
      removeClassFromDOM(el, clLi[i]);
    }
  }
}

/**
  * remove any existing js class flags for zero additions from el
  */
function removeZeroClass(el) {
  // get classes on el. Eg: "calc-display-inner js-font-size-90 js-zeros-added js-end-zero-4"
  let clLi = el.classList;

  // loop through all classes on el
  for (let i = 0; i < clLi.length; i++) {
    // if class in classList starts with 'js-font-size-' remove class from el
    if (clLi[i].match(/^js-end-zero/)) {
      removeClassFromDOM(el, clLi[i]);
    }
  }
}

/**
  * remove any existing js-font-size class
  * and add new js-font-size class to el
  */
function togglePercClass(el, cl) {
  removePercClass(el);
  addClassToDOM(el, cl);
}

/**
  * remove any existing js zero classes
  * and add new js-end-zero-?? class to el
  */
function toggleZeroClass(el, cl) {
  removeZeroClass(el);
  addClassToDOM(el, cl);
}

/**
  * change displayed font size for large numbers
  */
function changeDisplayFontSize(el, dl) {
  switch (dl) {
    case 8:
      togglePercClass(el, 'js-font-size-90');
      break;
    case 9:
      togglePercClass(el, 'js-font-size-81');
      break;
    case 10:
      togglePercClass(el, 'js-font-size-72');
      break;
    case 11:
      togglePercClass(el, 'js-font-size-64');
      break;
    case 12:
      togglePercClass(el, 'js-font-size-60');
      break;
    case 13:
      togglePercClass(el, 'js-font-size-55');
      break;
    case 14:
      togglePercClass(el, 'js-font-size-52');
      break;
    case 15:
      togglePercClass(el, 'js-font-size-48');
      break;
    case 16:
      togglePercClass(el, 'js-font-size-45');
      break;
    case 17:
      togglePercClass(el, 'js-font-size-42');
      break;
    case 18:
      togglePercClass(el, 'js-font-size-40');
      break;
    case 19:
      togglePercClass(el, 'js-font-size-38');
      break;
    case 20:
      togglePercClass(el, 'js-font-size-36');
      break;
    case 21:
      togglePercClass(el, 'js-font-size-34');
      break;
    case 22:
      togglePercClass(el, 'js-font-size-32');
      break;
    case 23:
    case 24:
      togglePercClass(el, 'js-font-size-28');
      break;
    case 25:
    case 26:
      togglePercClass(el, 'js-font-size-26');
      break;
    case 27:
    case 28:
      togglePercClass(el, 'js-font-size-22');
      break;
    case 29:
    case 30:
      togglePercClass(el, 'js-font-size-21');}


  // using if statements for gt/lt as faster than in switch statement
  if (dl > 30 && dl < 34) {
    togglePercClass(el, 'js-font-size-19');
  } else if (dl > 33 && dl < 37) {
    togglePercClass(el, 'js-font-size-17');
  } else if (dl > 36) {
    togglePercClass(el, 'js-font-size-14');
  }
}

/**
  * trims display number down with appended zeros on end
  */
function addZerosAndtrimLargeDigits(el, enl, fnwz) {
  // dl length 39-42 add zeros on end
  let firstNumWithZero2;
  if (enl > 38 && enl < 43) {
    if (enl === 39) {
      firstNumWithZero2 = fnwz.slice(0, -2) + '0'; // remove last 2 digits and replace with one zero as no zeros on end first time in this statement at 39 digits length
    } else {
      firstNumWithZero2 = fnwz.slice(0, -1) + '0'; // remove last digit and replace with zero
    }
    if (enl === 42) {
      addClassToDOM(el, 'js-end-zero-4'); // flag to show amount of zeros needed on end at 42 digit length
    }
    addClassToDOM(el, 'js-zeros-added'); // flag to show zeros have been appended to end
    replaceHtmlText(el, firstNumWithZero2); // add new value with zero to $display
  }
  // fix length of displayed number to 42 digits but replace last digit before zeros with a zero
  if (el.classList.contains('js-zeros-added') && enl > 42) {
    // list of classes on el
    let zClass = el.classList;
    let paddedSlicedNumber;
    for (let i = 0; i < zClass.length; i++) {
      // find 'js-end-zero-' class
      if (zClass[i].match(/^js-end-zero-/)) {
        let classSplit = zClass[i].split('-'); // split class
        let zeroNoStr = classSplit[3]; // get number as string from class (4th class in index)
        let zeroNoInt = parseInt(zeroNoStr) + 1;
        // use number to slice off end and set correct number of zeros on end
        let newSlicedNo = fnwz.slice(0, -zeroNoInt - 1);
        paddedSlicedNumber = newSlicedNo.padEnd(42, '0');
        let newZeroClass = 'js-end-zero-' + zeroNoInt;
        toggleZeroClass(el, newZeroClass); // remove old class and add new one with new zero number ie. js-end-zero-5 (for 43 digits entered)
        break;
      }
    }
    replaceHtmlText(el, paddedSlicedNumber); // add new display number with zeros to $display
  }
}

/**
  * only return true on the keys we specify should be used
  **/
function checkKey(n) {
  // if string isn't a number
  if (isNaN(parseFloat(n))) {
    // if string is one of the below
    if (n === "Escape" ||
    n === "Delete" ||
    n === "Enter" ||
    n === "/" ||
    n === "*" ||
    n === "=" ||
    n === "-" ||
    n === "+" ||
    n === "." ||
    n === "%") {
      // return true only for specific keys
      return true;
    }
  } else {
    // return true for numbers
    return true;
  }
}

/**
  * add flash of style on button click
  **/
function changeButtonState(el) {
  // only run if el isn't null (delete has no button el in calc so we cannot add class)
  if (el) {
    addClassToDOM(el, 'js-active');
    setTimeout(function () {
      removeClassFromDOM(el, 'js-active');
    }, 50);
  }
}

/**
  * handling keyboard buttons
  **/
function keyActions(e) {
  // get our key value
  let k = e.key;
  // run our checkKey function to make sure the key value is a key we can use
  if (checkKey(k)) {
    // run main calc function pass the key as argument
    myCalcFunction(k);
    // get calc button element for key pressed
    const calcKey = document.querySelector(`div[data-key="${k}"]`); // ES6 shiz using backticks & ES6 template strings ${}
    // toggle background colour
    changeButtonState(calcKey);
  }
}

/**
  * delete last number from display
  **/
function deleteLastNo() {
  let displayedNo = $display.textContent;
  let displayLength = displayedNo.length;
  let deleteLastNo;
  if (displayLength > 1) {
    deleteLastNo = displayedNo.slice(0, -1);
    replaceHtmlText($display, deleteLastNo);
  } else {
    resetCalculator($calcContainer, $clearButton, "AC", $display);
  }
}