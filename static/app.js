// (function () {
const zmanimDisplay = document.getElementById("zmanimDisplay");
const locationTitle = document.getElementById("locationTitle");
const errorDisplay = document.getElementById("errorDisplay");
const datePicker = document.getElementById("date");

setDatePicker();

async function fetchZmanim() {
    const location_identifier = document.getElementById("location_identifier").value.trim();
    const date = document.getElementById("date").value;
    let errorData;
    const res = await fetch(`/api/zmanim/?location_identifier=${encodeURIComponent(location_identifier)}&date=${date}`);
    if (!res.ok) {
        try {
            errorData = await res.json();
        } catch (e) {
            errorData = { detail: "Error processing error message from the server" };
        }
        displayErrorMessage(errorData);
    }
    else {
        const data = await res.json();
        updateZmanim(data);
    }
}

function updateZmanim(data) {
    clearData();
    const formattedDate = getFormattedDate(datePicker.value);
    locationTitle.textContent = `Zmanim for: ${data["location"]["title"]}, for ${formattedDate}`;

    for (let zman in data.times) {
        const timeZoneId = data["location"]["tzid"];
        const formattedTime = getFormattedTime(data["times"][zman], timeZoneId);

        const p = document.createElement("p");
        p.textContent = `${zman} : ${formattedTime}`;
        zmanimDisplay.append(p);
    }
}

// helper functions

function displayErrorMessage(errorData) {
    clearData();
    errorDisplay.innerText = errorData.detail;
}

function getFormattedTime(timeString, timeZoneId) {
    const formattedTime = Intl.DateTimeFormat("en-US", {
        timeZone: timeZoneId,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date(timeString));

    return formattedTime;
}

function getFormattedDate(dateString) {
    const dateObj = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(dateObj);

    return formattedDate;
}

function setDatePicker() {
    const today = new Date();
    datePicker.value = today.toISOString().split("T")[0];
}

function clearData() {
    locationTitle.innerText = "";
    zmanimDisplay.innerText = "";
    errorDisplay.innerText = "";
}
// })();
