import navBar from './navBar.js';
import carousel from './carousel.js';

var nav = navBar();
var intro = carousel();

// When the user scrolls the page, execute myFunction
window.onscroll = function() {
  makeStick()
};

// Get the header
var header = document.getElementById("nav");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function makeStick() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

document.addEventListener('DOMContentLoaded', function(event) {

});
