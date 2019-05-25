function navBar() {

  var header = document.createElement('header');
  header.setAttribute('id', 'nav');

  var nav = [];
  var home = document.createElement('a');
  home.setAttribute('href', '/');
  var homeImg = document.createElement('img');
  homeImg.setAttribute('src', './icons/home.svg');
  home.appendChild(homeImg);
  nav.push(home);

  var locate = document.createElement('a');
  locate.setAttribute('href', '/locate');
  var locateImg = document.createElement('img');
  locateImg.setAttribute('src', './icons/locate.svg');
  locate.appendChild(locateImg);
  nav.push(locate);

  var list = document.createElement('a');
  list.setAttribute('href', '/list');
  var listImg = document.createElement('img');
  listImg.setAttribute('src', './icons/list.svg');
  list.appendChild(listImg);
  nav.push(list);

  var add = document.createElement('a');
  add.setAttribute('href', '/add');
  var addImg = document.createElement('img');
  addImg.setAttribute('src', './icons/add.svg');
  add.appendChild(addImg);
  nav.push(add);

  for (var i = 0; i < nav.length; i++) {
    header.appendChild(nav[i]);
  }

  document.getElementById('app').insertAdjacentElement('beforebegin', header);

}

export default navBar;
