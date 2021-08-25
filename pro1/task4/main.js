// render all the blur effect to the output
function blurEventStreet(e) {
    document.getElementById('text').value = "Please input a valid suburb";
}
function blurEventStreetInvalid(e) {
    document.getElementById('text').value = "Please input a valid street name";
}

function blurEventSuburb(e) {
    document.getElementById('text').value = "Please input a valid postcode";
}
function blurEventSuburbInvalid(e) {
    document.getElementById('text').value = "Please input a valid suburb";
}

function blurEventPost(e) {
    document.getElementById('text').value = "Please enter a valid date of birth";
}
function blurEventPostInvalid(e) {
    document.getElementById('text').value = "Please input a valid postcode";

}

function blurEventDob(e) {
    document.getElementById('text').value = getFormInfo();
}
function blurEventDobInvalid(e) {
    document.getElementById('text').value = "Please enter a valid date of birth";
}

// get age
function convertToTimestamp(strOfDate) {
    let date = strOfDate.split("/");
    let newTime = new Date(Date.UTC(date[2], date[1], date[0]));
    return newTime.getTime() / 1000;
}

// get check box value
function checkboxList () {
    let checklist = [];
    let checkboxes = document.getElementsByName('answer');
    for (let i = 0, n = checkboxes.length; i < n; i++) {
        if (checkboxes[i].checked == true) {
            checklist.push(checkboxes[i].value);
        }
    }
    return checklist;
}

// select all of unselect all button
function toggle() {
    if (document.getElementById('btn').value == "Select All") {
        document.getElementById('btn').value = "Deselect All"
        checkboxes = document.getElementsByName('answer');
        for (let i = 0, n = checkboxes.length; i < n; i++) {
            checkboxes[i].checked = true;
            document.getElementById('text').value = getFormInfo();
        }
    } else {
        for (let i = 0, n = checkboxes.length; i < n; i++) {
            checkboxes[i].checked = false;
            document.getElementById('btn').value = "Select All";
            document.getElementById('text').value = getFormInfo();
        }
    }
}

// get form information to output
function getFormInfo () {
    let output;
    let selection = document.getElementById('selection');
    let sel_text = selection.options[selection.selectedIndex].text;
    let outputAge;
    let age;
    let checkboxResult = checkboxList();
    let timestampNow = Date.now() / 1000;
    let timestampBirthDate = convertToTimestamp(dob.value);
    age = timestampNow - timestampBirthDate;
    outputAge = Math.floor(age / (365 * 24 * 3600)); // for roughly caculation
    output = `You are ${outputAge} years old, and your address is ${street.value} St, ${suburb.value}, ${post.value}, Australia.`;
    if (sel_text == 'Apartment') {
        sel_text = "an apartment";
    } else {
        sel_text = "a house"
    }
    if (checkboxResult.length == 0) {
        checkboxResult = ", and it has no features.";
    } else if (checkboxResult.length == 1) {
        checkboxResult = ", and it has just " + checkboxResult[0] + ".";
    } else if (checkboxResult.length == 2) {
        checkboxResult = ", and it has " + checkboxResult[0] + " and " + checkboxResult[1] + ".";
    } else if (checkboxResult.length == 3) {
        checkboxResult = ", and it has " + checkboxResult[0] + ", " + checkboxResult[1] + " and " + checkboxResult[2] + ".";
    } else {
        checkboxResult = ", and it has " + checkboxResult[0] + ", " + checkboxResult[1] + ", " + checkboxResult[2] + " and " + checkboxResult[3] + ".";
    }
    return output + " Your building is " + sel_text + checkboxResult;
}

// event listener for street
let street = document.querySelector("#street_input");
let Length;
if (document.getElementById('street').value == null) {
    document.getElementById('text').value = 
        "Please input a valid street name"
} 

street.addEventListener("input", function() {
    Length = street.value.length;
    if (Length < 3 || Length > 50) {
        document.getElementById('text').value = 
        "Please input a valid street name";
        street.removeEventListener("blur", blurEventStreetInvalid);
        street.addEventListener("blur", blurEventStreetInvalid);
    } else {
        // document.getElementById('text').value = "valid input";
        street.removeEventListener("blur", blurEventStreet);
        street.addEventListener("blur", blurEventStreet);
    }
});

// event listener for suburb
let suburb = document.querySelector("#suburb_input");
suburb.addEventListener("input", function() {
    Length = suburb.value.length;
    if (Length < 3 || Length > 50) {
        document.getElementById('text').value = "Please input a valid suburb";
        suburb.removeEventListener("blur", blurEventSuburbInvalid);
        suburb.addEventListener("blur", blurEventSuburbInvalid);
    } else {
        // document.getElementById('text').value = "valid input";
        suburb.removeEventListener("blur", blurEventSuburb);
        suburb.addEventListener("blur", blurEventSuburb);
    }
});

// event listener for postcode
let post = document.querySelector("#post_input");
post.addEventListener("input", function() {
    if (post.value.length == 4 && !isNaN(post.value)) {
        // document.getElementById('text').value = "valid input";
        post.removeEventListener("blur", blurEventPost); 
        post.addEventListener("blur", blurEventPost); 
    } else {
        document.getElementById('text').value = "Please input a valid postcode";
        post.removeEventListener("blur", blurEventPostInvalid);
        post.addEventListener("blur", blurEventPostInvalid);
    }
});

// event listener for date of birth
let dob = document.querySelector("#date_input");
dob.addEventListener("input", function() {
    const regExp = /^\d{2}[/]\d{2}[/][0-9]{4}/;
    let dateOfBirth = dob.value;
    let date = dateOfBirth.split("/");
    if (regExp.test(dateOfBirth) && 
    !isNaN(Date.parse(date[2] + "-" + date[1] + "-" + date[0])) && 
    dateOfBirth.length == 10) {
        // document.getElementById('text').value = "valid input";
        dob.removeEventListener("blur", blurEventDobInvalid);
        dob.addEventListener("blur", blurEventDob);
    } else {
        document.getElementById('text').value = "Please enter a valid date of birth";
        dob.removeEventListener("blur", blurEventDobInvalid);
        dob.addEventListener("blur", blurEventDobInvalid);
    }
});

// reset button is a default function, no need to write, 
// but need another function to change back to original
function afterReset() {
    document.getElementById('text').value = "Please input a valid street name";
}

// if building type changed
function buildingChange() {
    document.getElementById('text').value = getFormInfo();
}

// if features changed
function featuresChange() {
    document.getElementById('text').value = getFormInfo();
}          