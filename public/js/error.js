import NavBar from "./navBar.js";

const nav = NavBar;

// Display the navigation bar
document.getElementById("app").insertAdjacentElement("beforebegin", nav());
