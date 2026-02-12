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
    } else {
        const data = await res.json();
        updateZmanim(data);
    }
}

function updateZmanim(data) {
    clearData();
    const formattedDate = getFormattedDate(datePicker.value);
    locationTitle.textContent = `Zmanim for: ${data["location"]["title"]}, for ${formattedDate}`;

    for (let zman in data.times) {
        // only include the specified zmanim
        if (ZMANIM_LABELS[zman]) {
            const zmanLabel = ZMANIM_LABELS[zman];
            const timeZoneId = data["location"]["tzid"];
            const formattedTime = getFormattedTime(data["times"][zman], timeZoneId);

            const p = document.createElement("p");
            p.textContent = `${zmanLabel} : ${formattedTime}`;
            zmanimDisplay.append(p);
        }
    }
}

// helper functions
const ZMANIM_LABELS = {
    chatzotNight: "Chatzos Layla",
    alotHaShachar: "Alos HaShachar 16.1°",
    misheyakir: "Misheyakir 11.5°",
    misheyakirMachmir: "Misheyakir 10.2°",
    sunrise: "Sunrise",
    sofZmanShmaMGA19Point8: "Sof Zman Krias Shema (Magen Avraham 19.8°)",
    sofZmanShmaMGA16Point1: "Sof Zman Krias Shema (Magen Avraham 16.1°)",
    sofZmanShmaMGA: "Sof Zman Krias Shema (Magen Avraham)",
    sofZmanShma: "Sof Zman Krias Shema (Gra)",
    sofZmanTfillaMGA19Point8: "Sof Zman Tefilla (Magen Avraham 19.8°)",
    sofZmanTfillaMGA16Point1: "Sof Zman Tefilla (Magen Avraham 16.1°)",
    sofZmanTfillaMGA: "Sof Zman Tefilla (Magen Avraham)",
    sofZmanTfilla: "Sof Zman Tefilla (Gra)",
    chatzot: "Chatzos",
    minchaGedola: "Mincha Gedola (Gra)",
    minchaGedolaMGA: "Mincha Gedola (Magen Avraham)",
    minchaKetana: "Mincha Ketana (Gra)",
    minchaKetanaMGA: "Mincha Ketana (Magen Avraham)",
    plagHaMincha: "Plag HaMincha",
    sunset: "Sunset",
    tzeit85deg: "Tzais HaKochavim (8.5°)",
    tzeit42min: "Tzais HaKochavim (42 min after sunset)",
    tzeit50min: "Tzais HaKochavim (50 min after sunset)",
    tzeit72min: "Tzais HaKochavim (72 min after sunset)",
};

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
