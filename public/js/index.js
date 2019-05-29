import NavBar from './navBar.js';
import Carousel from './carousel.js';

var nav = NavBar;
var carousel = Carousel;

// Display the navigation bar
document.getElementById('app').insertAdjacentElement('beforebegin', nav());
// Add the carousel to the homepage
document.getElementById('app').appendChild(carousel());
