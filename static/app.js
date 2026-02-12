// (function () {
const zmanimDisplay = document.getElementById("zmanimDisplay");
const locationTitle = document.getElementById("locationTitle");
const errorDisplay = document.getElementById("errorDisplay");
const datePicker = document.getElementById('date')

setDatePicker();

function setDatePicker() {
    const today = new Date();
    datePicker.value = today.toISOString().split('T')[0];
}


async function fetchZmanim() {
  const location_identifier = document.getElementById("location_identifier").value;
  const date = document.getElementById("date").value;

  try {
    const res = await fetch(`/api/zmanim/?location_identifier=${encodeURIComponent(location_identifier)}&date=${date}`);
    if (!res.ok) {
      const errorData = await res.json();
      displayErrorMessage(errorData);
    } else {
      const data = await res.json();
      updateZmanim(data);
    }
  }
  catch (e) {
    displayErrorMessage({
      detail: `Sorry, there was an error fetching the data. \n Please contact the site administrator. \n ${e}`,
      dont_try_again: "True",
    });
  }
}

function updateZmanim(data) {
  clearData();
  const date = datePicker.value;
  locationTitle.textContent = `Zmanim for: ${data["location"]["title"]}, for ${date}`;

  for (let zman in data.times) {
    const zmanIsoString = data["times"][zman];
    const timeDisplayString = new Date(zmanIsoString).toLocaleTimeString();
    const p = document.createElement("p");
    p.textContent = `${zman} : ${timeDisplayString}`;
    zmanimDisplay.append(p);
  }
}

function displayErrorMessage(errorData) {
  clearData();
  errorDisplay.innerText = `${errorData.detail} ${errorData.dont_try_again? '': '\n Please try again.'} `;
}

function clearData() {
  locationTitle.innerText = "";
  zmanimDisplay.innerText = "";
  errorDisplay.innerText = "";
}
// })();
