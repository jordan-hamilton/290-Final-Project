import NavBar from './navBar.js';

var nav = NavBar;

// Display the navigation bar
document.getElementById('app').insertAdjacentElement('beforebegin', nav());

function bindSubmitButton() {
  document.getElementById('devSubmit').addEventListener('click', function(event) {
    event.preventDefault();
    var request = new XMLHttpRequest();
    var payload = {};
    payload.devName = document.getElementById('devName').value;
    payload.devType = document.getElementById('devType').value;
    payload.techName = document.getElementById('techName').value;
    payload.devLoc = document.getElementById('devLoc').value;
    payload.devDest = document.getElementById('devDest').value;

    request.open('POST', '/add', true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.addEventListener('load', function() {
      if (request.status >= 200 && request.status < 400) {
        console.log(request.responseText);
        document.getElementById('result').textContent = 'This device was added successfully. You can view it in the '
        var listLink = document.createElement('a');
        listLink.setAttribute('href', '/list');
        listLink.textContent = 'list of devices.';
        document.getElementById('result').insertAdjacentElement('beforeend', listLink);
      } else {
        console.error(`An error occurred: ${request.statusText}`)
        document.getElementById('result').textContent = 'An error occurred when attempting to add this device. Please ensure all values in the form above have been filled, then try again.'
      }
    });

    request.send(JSON.stringify(payload));
  });
}

document.addEventListener('DOMContentLoaded', function(event) {
  bindSubmitButton();
});
