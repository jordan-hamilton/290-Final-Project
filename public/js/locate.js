import NavBar from './navBar.js';

var nav = NavBar;

// Display the navigation bar
document.getElementById('app').insertAdjacentElement('beforebegin', nav());

function bindSubmitButtons() {
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('click', makeRequest);
    }
  }

function makeRequest(event) {
  event.preventDefault();
  var request = new XMLHttpRequest();
  var payload = {};
  payload.devId = this.id;

  request.open('POST', '/locate', true);
  request.setRequestHeader('Content-Type', 'application/json');

  request.addEventListener('load', function() {
    if (request.status >= 200 && request.status < 400) {
      var result = JSON.parse(request.responseText);
      var distance = result.rows[0].elements[0].distance.text;
      var time = result.rows[0].elements[0].duration.text;
      document.getElementById(`dev${payload.devId}`).textContent += ` is ${distance} (${time}) from its destination.`;
    } else {
      console.error(`An error occurred: ${request.statusText}`)
      document.getElementById(`dev${payload.devId}`).textContent += `: An error \
      occurred checking the location of this device. Please try again later.`;
    }
  });

  request.send(JSON.stringify(payload));
}

document.addEventListener('DOMContentLoaded', function(event) {
  bindSubmitButtons();
});
