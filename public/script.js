// imported variables
import {
  patientName,
  patientGender,
  patientAge,
  chart,
  months,
  systolicValue,
  systolicStatus,
  diastolicValue,
  sysStatus,
  respRate,
  respLevels,
  tempRate,
  tempLevels,
  heartRate,
  heartLevels,
  patientProName,
  patientProDob,
  patientProGender,
  patientProTel,
  patientProEmerg,
  patientProInsur,
} from "./modules/variables.js";

// putting data to the UI
// patientProInsur.innerHTML = "Feyisayo Lasisi";

// let data = {};

async function fetchData() {
  try {
    const resp = await fetch("http://localhost:3000/api/data");
    // console.log(resp);

    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await resp.json();

    // displaying data to patient profile interface
    const patientProfileView = function (data) {
      patientProName.innerHTML = data[3].name;
    };

    patientProfileView(data);
    // console.log(data[3]);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

fetchData();
