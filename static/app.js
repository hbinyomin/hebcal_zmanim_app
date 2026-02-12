// (function () {
const zmanimDisplay = document.getElementById("zmanimDisplay");
const locationTitle = document.getElementById("locationTitle");
const errorDisplay = document.getElementById("errorDisplay");
const BASE_URL = "https://zmanimapp-bjc9b7e3dcd9epgy.mexicocentral-01.azurewebsites.net/";
async function fetchZmanim() {
  const location_identifier = document.getElementById("location_identifier").value;
  const date = document.getElementById("date").value;


  const res = await fetch(`${BASE_URL}/api/zmanim/?location_identifier=${location_identifier}&date=${date}`);
  if (!res.ok) {
    const errorData = await res.json();
    displayErrorMessage(errorData);
    console.log("the error data is:", errorData);
  } else {
    const data = await res.json();
    updateZmanim(data);
    console.log(data);
  }
}

function updateZmanim(data) {
  clearData();
  const date = new Date(data["date"]);
  locationTitle.textContent = `Zmanim for: ${data["location"]["title"]}, for ${date.toLocaleDateString()}`;

  for (let zman in data.times) {
    const isoString = data["times"][zman];
    const timeDisplayString = new Date(isoString).toLocaleTimeString();
    const p = document.createElement("p");
    p.textContent = `${zman} : ${timeDisplayString}`;
    zmanimDisplay.append(p);
  }
}

function displayErrorMessage(errorData) {
  clearData();
  errorDisplay.innerText = `${errorData.detail} \n Please try again.`;
}

function clearData() {
  locationTitle.innerText = "";
  zmanimDisplay.innerText = "";
  errorDisplay.innerText = "";
}
// })();
