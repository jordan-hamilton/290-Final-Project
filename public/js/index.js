import NavBar from './navBar.js';
import Carousel from './carousel.js';

var nav = NavBar;
var carousel = Carousel;

document.getElementById('app').insertAdjacentElement('beforebegin', nav());
document.getElementById('app').appendChild(carousel());

document.addEventListener('DOMContentLoaded', function(event) {

});
