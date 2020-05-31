console.log('Add validation!');
let lengthOfStay = 0
let startDate = null
const TODAY = new Date()
const CURRENT_YEAR = TODAY.getFullYear()
const CURRENT_YEAR_SHORT = CURRENT_YEAR % 100
const CURRENT_MONTH = TODAY.getMonth()


document.getElementById("parking-form").addEventListener("submit", validateForm)


function validateForm(event) {
    event.preventDefault()
    validateAll()
}

function validateAll() { //needs to test whether all are true and pass back
    validateName()
    validateCarDetails()
    validateDates()
    validateCard()

    return null//value indicating whether all other tests are true
}

//This validates the name field only.  
function validateName() {
    let nameInput = document.getElementById("name")
    if (nameInput.value) {
        validate(nameInput.parentElement)
        return true
    } else {
        invalidate(nameInput.parentElement)
        return false
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
        validate(carField)
        return true
    } else {
        invalidate(carField)
        return false
    }
}

function validateYear() {
    let input = document.getElementById("car-year")
    if (input.value > 1900 && input.value <= CURRENT_YEAR) {
        return true
    } else {
        return false
    }
}

function validateMake() {
    let input = document.getElementById("car-make")
    if (input.value) {
        return true
    } else {
        return false
    }
}

function validateModel() {
    let input = document.getElementById("car-model")
    if (input.value) {
        return true
    } else {
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
        let startDate = new Date(year, month, day)
        if (startDate > TODAY) {
            validate(input.parentElement)
            return true 
        } else {
            invalidate(input.parentElement)
            return false
        }
    } else {
        return false
    }
}

function validateLength() {
    let input = document.getElementById("days")
    if (0 < input.value && input.value <= 30) {
        validate(input.parentElement)
        return true
    } else {
        invalidate(input.parentElement)
        return false
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

//Not sure this is right yet
function validateCardNumberCaller() {
    let ccField = document.getElementById("credit-card")
    if (validateCardNumber(ccField.value)) {
        validate(ccField.parentElement)
        return true
    } else {
        invalidate(ccField.parentElement)
        return false
    }
}

//Use isNAN() to see if number?
function validateCVV() {
    let ccCVVField = document.getElementById("cvv")
    if (!isNaN(ccCVVField.value) && ccCVVField.value.length === 3) {
        validate(ccCVVField.parentElement)
        return true
    } else {
        invalidate(ccCVVField.parentElement)
        return false
    }
}

//get new date as above...move out to variable.  Check year and month against value.
//use regex easier?  If/else flow with Check year > now, else check year === now 
// if so check month > now also works.
//wanted to play with Date objects, so did it this way
//quick regex check on initial input would require fewer other checks in place below

//var regExpire = new RegExp("^[0-9]{2}\/[0-9]{2}$")
function validateExpiration() {
    let expField = document.getElementById("expiration")
    let expValue = expField.value
    let expYear = Number(expValue.slice(3, 5))
    let expMonth = Number(expValue.slice(0, 2))
    let expDate = new Date(2000 + expYear, expMonth)
    if (expValue.length === 5 && expValue[2] === "/" && 
            !(isNaN(expDate)) && expDate > TODAY) {
        validate(expField.parentElement)
        return true
    } else {
        invalidate(expField.parentElement)
        return false
    }
}
//end of card verification functions




function validate(node) {
    node.classList.remove("input-invalid")
    node.classList.add("input-valid")
}

function invalidate(node) {
    node.classList.remove("input-valid")
    node.classList.add("input-invalid")
}


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