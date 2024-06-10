// imported variables
import { createMyChart } from "./modules/myChart.js"; //impotying the createMyChart function

//importing the variables.
import {
  patientContainerClass,
  months,
  systolicValue,
  systolicStatus,
  diastolicValue,
  diastolicStatus,
  respRate,
  respLevels,
  tempRate,
  tempLevels,
  heartRate,
  heartLevels,
  diagnosisList,
  patientProImage,
  patientProName,
  patientProDob,
  patientProGender,
  patientProTel,
  patientProEmerg,
  patientProInsur,
  labResult,
} from "./modules/variables.js";

// creating the clearMarkup function to clear a parent container before new markup is fed into it.
const clearMarkup = function (parentElement) {
  parentElement.innerHTML = "";
};

// markup to feed in the patient list detail from the API
const generatePatientsListMarkupPreview = function (patientListData) {
  return `<a href="#" class="link patients__list">
    <img
      src="${patientListData.profile_picture}"
      alt="a patient"
      class="icon--medium patients__list--img"
    />
    <div class="patients__list--detail font--reg">
      <p class="patients__list--name">${patientListData.name}</p>
      <div>
        <p class="patients__list--gender">${patientListData.gender}</p>
        <p class="patients__list--age">${patientListData.age}</p>
      </div>
    </div>
    <img
      src="img/more_horizontal (1).svg"
      alt="More Icon"
      class="icon--small patients__list--icon"
    />
  </a>`;
};

// calling the renderPatientsList function to display the patients list on the UI.
const generatePatientsListMarkup = function (patientList) {
  const patientHTMLString = patientList.map(function (patient) {
    return (patientContainerClass.innerHTML =
      generatePatientsListMarkupPreview(patient));
  });

  return patientHTMLString.join("");
};

// A function to display the vital rates on the UI
const vitalRatesDisplay = function (vitalRates) {
  const dataFiltered = vitalRates.diagnosis_history[0];

  const { systolic, diastolic } = dataFiltered.blood_pressure;
  systolicValue.innerHTML = systolic.value;
  systolicStatus.innerHTML = systolic.levels;
  diastolicValue.innerHTML = diastolic.value;
  diastolicStatus.innerHTML = diastolic.levels;

  const { value: heartValue, levels: heartLevel } = dataFiltered.heart_rate;
  heartRate.innerHTML = heartValue;
  heartLevels.innerHTML = heartLevel;

  const { value: respValue, levels: respLevel } = dataFiltered.respiratory_rate;
  respRate.innerHTML = respValue;
  respLevels.innerHTML = respLevel;

  const { value: tempValue, levels: tempLevel } = dataFiltered.temperature;
  tempRate.innerHTML = tempValue;
  tempLevels.innerHTML = tempLevel;
};

// this function diaplays the markup to Diagnosis list to the UI
const generateDiagnosisListMarkup = function (diagnosisListData) {
  const markup = diagnosisListData.diagnostic_list
    .map(function (data) {
      return `<p class="problem">${data.name}</p>
          <p class="description">${data.description}</p>
          <p class="status">${data.status}</p>`;
    })
    .join("");

  diagnosisList.insertAdjacentHTML("afterbegin", markup);
};

// formatDate function to convert the date string fromt the API to the design format
function formatDate(dateStr) {
  // Creating a Date object from the input
  const date = new Date(dateStr);

  // Extracting the month, day, and year components
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  // Formating the date string to the specified desired format
  return `${month} ${day}, ${year}`;
}

// renderPatientProfileView function to feed API data into the UI
const renderPatientProfileView = function (patientProfile) {
  // destructuring object to prevent repititon
  const {
    profile_picture,
    name,
    date_of_birth,
    gender,
    phone_number,
    emergency_contact,
    insurance_type,
  } = patientProfile;

  patientProImage.src = profile_picture;
  patientProName.innerHTML = name;
  patientProDob.innerHTML = formatDate(date_of_birth); //calling the formatDate function with the data to produce the formatted date.
  patientProGender.innerHTML = gender;
  patientProTel.innerHTML = phone_number;
  patientProEmerg.innerHTML = emergency_contact;
  patientProInsur.innerHTML = insurance_type;
};

// Function to generate Lab Result to be displayed on the UI.
const generatelabResultsMarkup = function (labResults) {
  return labResults
    .map((labResult) => {
      return `<div class="flex space-between">
          <p class="font--reg labResults__content--item">${labResult}</p>
          <img
            src="img/downloadIcon.svg"
            class="icon--small"
            alt="Download Icon"
          />
        </div>`;
    })
    .join("");
};

// A function to retrieve Jessica's data from the API.
const fetchJessData = function (rawDataArr) {
  return rawDataArr.find((rawData) => rawData.name === "Jessica Taylor");
};

// an async function is used here because the event listener needs to await the arrival of the Data from the API before running this function.
document.addEventListener("DOMContentLoaded", async function () {
  const ctx = document.getElementById("myChart").getContext("2d");

  const rawData = await fetchData();
  const jessicaData = fetchJessData(rawData);

  const { diagnosis_history } = jessicaData; //destructuring to get Jessica's diagnosis history

  createMyChart(ctx, diagnosis_history); //calling the createMyChart function
});

// an async function to load the API data from the Server.js file to the client side
async function fetchData() {
  try {
    const resp = await fetch("http://localhost:3000/api/data");

    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    // Getting the raw data and storing it in the data variable
    const data = await resp.json();

    //calling the function to fetch jessica's data from the data variable above.
    const jessicaData = fetchJessData(data);

    // function to clear the patient container class before inserting new markup
    clearMarkup(patientContainerClass);
    // loading the markup with API data.
    const patientsListMarkup = generatePatientsListMarkup(data);
    patientContainerClass.insertAdjacentHTML("afterbegin", patientsListMarkup);

    // calling the vitalRatesDisplay function with API data.
    vitalRatesDisplay(jessicaData);

    // clear the disgnosisList container class before inserting new markup
    clearMarkup(diagnosisList);
    // calling the generateDiagnosisListMarkup to feed in the API data
    generateDiagnosisListMarkup(jessicaData);

    // calling the renderPatientProfileView function with the API DATA
    renderPatientProfileView(jessicaData);

    // function to clear the patient container class before inserting new markup
    clearMarkup(labResult);
    const labResultMarkup = generatelabResultsMarkup(jessicaData.lab_results);
    labResult.insertAdjacentHTML("afterbegin", labResultMarkup);

    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

fetchData();
