//Warnings should be less generic and more contextual (date is formatted correctly but 
//in the past, CCV isn't three digits, etc.)

//generally happy with this, but need to refactor just a bit and make a generic
//checker function that takes an id, a validation-node, and a tester function so
//that all of the validate**** functions can be turned into more concise tests
//that are all passed into a master verify function so there's a lot less of:
/*
if (nameInput.value) {
        removeWarning("name")
        return validate(nameInput.parentElement)
    } else {
        addWarning("name", nameInput.parentElement)
        return invalidate(nameInput.parentElement)
    }


EXAMPLE VERIFIER
function verifier(id, warningNode, testFunction) {
    run testFunction on element with id
    if true:
        call validation to add is-valid, etc. to warningNode
    else: 
        call invalidation to add not-valid, etc. to warningNode
}
*/

let lengthOfStay = 0
let startDate = null
const TODAY = new Date()
const CURRENT_YEAR = TODAY.getFullYear()
const CURRENT_YEAR_SHORT = CURRENT_YEAR % 100
const CURRENT_MONTH = TODAY.getMonth()
const WEEKDAY_PRICE = 5
const WEEKEND_PRICE = 7


document.getElementById("parking-form").addEventListener("submit", validateForm)


function validateForm(event) {
    event.preventDefault()
    if (validateAll()) {
        addPrice()
        //submit form here if live
    } else {
        removePrice()
    }
}

function validateAll() { 
    let nameValid = validateName()
    let carValid = validateCarDetails()
    let dateValid = validateDates()
    let cardValid = validateCard()
    return nameValid && carValid && dateValid && cardValid
}

//This validates the name field only.  
function validateName() {
    let nameInput = document.getElementById("name")
    if (nameInput.value) {
        removeWarning("name")
        return validate(nameInput.parentElement)
    } else {
        addWarning("name", nameInput.parentElement)
        return invalidate(nameInput.parentElement)
    }
}

//the next four functions are a parent and 3 child functions that check all three
//car boxes and validates them individually and then as a group.  This is because
//the HTML for each field doesn't pass to a single parent, so the JS mirrors that.
function validateCarDetails() {
    let carField = document.getElementById("car-field")
    let validYear = validateYear()
    let validMake = validateMake()
    let validModel = validateModel()
    if (validYear && validMake && validModel) {
        return validate(carField)
    } else {
        return invalidate(carField)
    }
}

function validateYear() {
    let input = document.getElementById("car-year")
    if (input.value > 1900 && input.value <= CURRENT_YEAR) {
        removeWarning("car-year")
        return true
    } else {
        addWarning("car-year", input.parentElement.parentElement)
        return false
    }
}

function validateMake() {
    let input = document.getElementById("car-make")
    if (input.value) {
        removeWarning("car-make", input.parentElement.parentElement)
        return true
    } else {
        addWarning("car-make", input.parentElement.parentElement)
        return false
    }
}

function validateModel() {
    let input = document.getElementById("car-model")
    if (input.value) {
        removeWarning("car-model", input.parentElement.parentElement)
        return true
    } else {
        addWarning("car-model", input.parentElement.parentElement)
        return false
    }
}
//end block of car functions


//start block of date functions
function validateDates() {
    let validStartDate = validateStartDate()
    let validLength = validateLength() 
    if (validStartDate && validLength) {
        return true
    } else {
        return false
    }
}

function validateStartDate() {
    let dateTest = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")
    let input = document.getElementById("start-date")
    if (dateTest.test(input.value)) {
        let month = Number(input.value.slice(5, 7)) - 1
        let day = input.value.slice(8, 10)
        let year = input.value.slice(0,4)
        let thisStartDate = new Date(year, month, day)
        startDate = thisStartDate
        if (thisStartDate > TODAY) {
            removeWarning("start-date", input.parentElement)
            return validate(input.parentElement)
        } else {
            addWarning("start-date", input.parentElement)
            return invalidate(input.parentElement)
        }
    } else {
        addWarning("start-date", input.parentElement)
        return invalidate(input.parentElement)
    }
}

function validateLength() {
    let input = document.getElementById("days")
    if (0 < input.value && input.value <= 30) {
        lengthOfStay = input.value
        removeWarning("days", input.parentElement)
        return validate(input.parentElement)
    } else {
        addWarning("days", input.parentElement)
        return invalidate(input.parentElement)
    }
}
//end block of date functions


//card verification master and secondary functions start here
function validateCard() {
    let validNumber = validateCardNumberCaller()
    let validCVV = validateCVV()
    let validEXP = validateExpiration()
    if (validNumber && validCVV && validEXP) {
        return true
    } else {
        return false
    }
}

function validateCardNumberCaller() {
    let ccField = document.getElementById("credit-card")
    if (validateCardNumber(ccField.value)) {
        removeWarning("credit-card", ccField.parentElement)
        return validate(ccField.parentElement)
    } else {
        addWarning("credit-card", ccField.parentElement)
        return invalidate(ccField.parentElement)
    }
}

function validateCVV() {
    let ccCVVField = document.getElementById("cvv")
    if (!isNaN(ccCVVField.value) && ccCVVField.value.length === 3) {
        removeWarning("cvv", ccCVVField.parentElement)
        return validate(ccCVVField.parentElement)
    } else {
        addWarning("cvv", ccCVVField.parentElement)
        return invalidate(ccCVVField.parentElement)
    }
}

function validateExpiration() {
    let regExpire = new RegExp("^[0-9]{2}\/[0-9]{2}$")
    let expField = document.getElementById("expiration")
    let expValue = expField.value
    let expYear = Number(expValue.slice(3, 5))
    let expMonth = Number(expValue.slice(0, 2))
    let expDate = new Date(2000 + expYear, expMonth)
    if (regExpire.test(expValue) && expDate > TODAY && expMonth <= 12 && expMonth !== 0) {
        removeWarning("expiration", expField.parentElement)
        return validate(expField.parentElement)
    } else {
        addWarning("expiration", expField.parentElement)
        return invalidate(expField.parentElement)
    }
}
//end of card verification functions


//assist functions that tag things as valid/invalid, post and unpost warnings to
//the DOM, and calculate the price on a valid form
function validate(node) {
    node.classList.remove("input-invalid")
    node.classList.add("input-valid")
    return true
}

function invalidate(node) {
    node.classList.remove("input-valid")
    node.classList.add("input-invalid")
    return false
}

function addWarning(address, node) {
    removeWarning(address)
    let newEl = document.createElement("div")
    let text = document.createTextNode(address + " is required")
    newEl.appendChild(text)
    newEl.setAttribute("id", address + "-warning")
    node.appendChild(newEl)
}

function removeWarning(address) {
    let oldWarning = document.getElementById(address + "-warning")
    if (oldWarning != null) {
        oldWarning.remove()
    }
}

function addPrice() {
    removePrice()
    let price = calculatePrice()
    let newEl = document.createElement("div")
    let text = document.createTextNode(`Your price will be $${price}.`)
    let node = document.getElementById("total")
    newEl.appendChild(text)
    newEl.setAttribute("id", "price")
    node.appendChild(newEl)
}

function removePrice() {
    let oldPrice = document.getElementById("price")
    if (oldPrice != null) {
        oldPrice.remove()
    }
}

function calculatePrice() {
    let day = startDate.getDay()
    let dayList = []
    for (i = 0; i < lengthOfStay; i++) {
        dayList.push(day)
        day += 1
    }
    dayList = dayList.map(item => item % 7)
    dayList = dayList.map(function (item) {
        if (item === 0 || item === 6) {
            return WEEKEND_PRICE
        } else {
            return WEEKDAY_PRICE
        }
    })
    let price = dayList.reduce((a, b) => a + b)
    return price
}
//end of assist functions


//Given code that deals with credit card input:
function validateCardNumber(number) {
    var regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(number))
        return false;

    return luhnCheck(number);
}

function luhnCheck(val) {
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
        var intVal = parseInt(val.substr(i, 1));
        if (i % 2 == 0) {
            intVal *= 2;
            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }
        sum += intVal;
    }
    return (sum % 10) == 0;
}