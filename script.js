console.log('Add validation!');

document.getElementById("parking-form").addEventListener("submit", validateForm)


function validateForm(event) {
    event.preventDefault()
    validateAll()
}

function validateAll() { //needs to test whether all are true and pass back
    validateName()
    validateCarDetails()

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
    if (validateYear() && validateMake() && validateModel()) {
        validate(carField)
        return true
    } else {
        invalidate(carField)
        return false
    }
}

function validateYear() {
    let input = document.getElementById("car-year")
    let today = new Date()
    let currentYear = today.getFullYear()
    if (input.value > 1900 && input.value <= currentYear) {
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


function validateCard() {
    if (validateCardNumber() && validateCVV() && validateExpiration()) {
        return true
    } else {
        return false
    }
}

//Not sure this is right yet
function validateCardNumber() {
    let CCfield = document.getElementById("credit-card")
    if (validateCardNumber(CCfield.value)) {
        return true
    } else {
        return false
    }
}

function validateCVV() {

}

function validateExpiration() {
    
}





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