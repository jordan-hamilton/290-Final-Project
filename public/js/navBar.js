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

function navBar() {

  var header = document.createElement('header');
  header.setAttribute('id', 'nav');

  header.appendChild(createLink('home'));
  header.appendChild(createLink('locate'));
  header.appendChild(createLink('list'));
  header.appendChild(createLink('add'));

  document.getElementById('app').insertAdjacentElement('beforebegin', header);

}

export default navBar;
