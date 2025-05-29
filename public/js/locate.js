import NavBar from "./navBar.js";

const nav = NavBar;

// Display the navigation bar
document.getElementById("app").insertAdjacentElement("beforebegin", nav());

const bindSubmitButtons = () => {
  const inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("click", makeRequest);
  }
};

const makeRequest = (e) => {
  e.preventDefault();
  const request = new XMLHttpRequest();
  const payload = {};
  payload.devId = this.id;

  request.open("POST", "/locate", true);
  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function () {
    if (request.status >= 200 && request.status < 400) {
      const result = JSON.parse(request.responseText);
      const distance = result.rows[0].elements[0].distance.text;
      const time = result.rows[0].elements[0].duration.text;
      document.getElementById(
        `dev${payload.devId}`
      ).textContent += ` is ${distance} (${time}) from its destination.`;
    } else {
      console.error(`An error occurred: ${request.statusText}`);
      document.getElementById(
        `dev${payload.devId}`
      ).textContent += `: An error \
      occurred checking the location of this device. Please try again later.`;
    }
  });

  request.send(JSON.stringify(payload));
};

document.addEventListener("DOMContentLoaded", (e) => {
  bindSubmitButtons();
});
