import { months } from "./variables.js";

// function to format the date to the desired format
const formatDate = function (dates) {
  const formattedDate = [];

  dates.forEach(function (date, i) {
    if (i < 6) {
      const { month, year } = date;
      const abbreviatedMonth = month.slice(0, 3); //this gets the first three letters in the month

      return formattedDate.push(`${abbreviatedMonth} ${year}`);
    }
  });

  return formattedDate.reverse(); //Reversing the date to meet template specification
};

// function to map the Systolic Values for the desired time frame into an array
const collateSysValue = function (rawData) {
  return rawData
    .slice(0, 6)
    .map(function (data) {
      const { value: sysValue } = data.blood_pressure.systolic;
      return sysValue;
    })
    .reverse();
  //   return valueCollator(rawData);
};

// function to map the Diastolic Values for the desired time frame into an array
const collateDiaValue = function (rawData) {
  return rawData
    .slice(0, 6)
    .map(function (data) {
      const { value: diaValue } = data.blood_pressure.diastolic;
      return diaValue;
    })
    .reverse();
};

export function createMyChart(ctx, myChartData) {
  const formattedDate = formatDate(myChartData);
  const sysValue = collateSysValue(myChartData);
  const diaValue = collateDiaValue(myChartData);

  //Input value for the number of months on the chart
  months.innerHTML = formattedDate.length;

  new Chart(ctx, {
    type: "line", // Specifying the chart type
    data: {
      labels: formattedDate, // X-axis labels
      datasets: [
        {
          //first data
          label: " ",
          data: sysValue, // Y-axis Systolic value
          borderColor: "#E66FD2", // Line color for first dataset
          backgroundColor: "#E66FD2", // Fill color under the line for first dataset
          borderWidth: 1,
          tension: 0.4, // Bezier curve tension for first data
        },
        {
          //second data
          label: " ",
          data: diaValue,
          borderColor: "#8C6FE6",
          backgroundColor: "#8C6FE6",
          borderWidth: 1,
          tension: 0.4,
        },
      ],
    },
    options: {
      scales: {
        x: {
          beginAtZero: true, // setting the base value on the xaxis to start at 0
        },
        y: {
          ticks: {
            callback: function (value, i, v) {
              return value;
            },
            // Specifing the preset values on the y axis to match the template
            stepSize: 20, // setting the interval
            min: 60, // Minimum value on the y-axis
            max: 180, // Maximum value on the y-axis
          },
        },
      },
    },
  });
}
