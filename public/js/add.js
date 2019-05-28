import NavBar from './navBar.js';

var nav = NavBar;

document.getElementById('app').insertAdjacentElement('beforebegin', nav());

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
      var response = JSON.parse(request.responseText);
      console.log(response);
    } else {
      console.log(`An error occurred: ${request.statusText}`)
    }
  });
  request.send(JSON.stringify(payload));
});

document.addEventListener('DOMContentLoaded', function(event) {});
