// Create a header element and navigation icons to include on every page using
// JavaScript to manipulate the DOM.
// All navigation icons are under the MIT license and provided by the Ionic Framework team
// (https://ionicons.com/)

function createLink(page) {
  var link = document.createElement('a');

  if (page == 'home') {
    link.setAttribute('href', '/');
  } else {
    link.setAttribute('href', `/${page}`);
  }

  var linkImg = document.createElement('img');
  linkImg.setAttribute('src', `./icons/${page}.svg`);
  link.appendChild(linkImg);

  return link;
}

function createNavBar() {

  var header = document.createElement('header');
  header.setAttribute('id', 'nav');

  header.appendChild(createLink('home'));
  header.appendChild(createLink('locate'));
  header.appendChild(createLink('list'));
  header.appendChild(createLink('add'));

  return header;
}

export default createNavBar;
