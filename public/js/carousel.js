function createButton(direction) {
  var button = document.createElement('a');
  button.setAttribute('class', `carousel-control-${direction}`);
  button.setAttribute('href', '#introCarousel');
  button.setAttribute('role', 'button');
  button.setAttribute('data-slide', direction);

  var buttonIcon = document.createElement('span');
  buttonIcon.setAttribute('class', `carousel-control-${direction}-icon`);
  buttonIcon.setAttribute('aria-hidden', 'true');
  button.appendChild(buttonIcon);

  var buttonAltText = document.createElement('span');
  buttonAltText.setAttribute('class', 'sr-only');
  if (direction == 'prev') {
    buttonAltText.textContent = 'Previous';
  } else if (direction == 'next') {
    buttonAltText.textContent = 'Next';
  }
  button.appendChild(buttonAltText);

  return button;
}

function createCarousel() {
  var carouselContainer = document.createElement('div');

  var carousel = document.createElement('div');
  carousel.setAttribute('id', 'introCarousel');
  carousel.setAttribute('class', 'carousel slide');
  carousel.setAttribute('data-ride', 'carousel');
  // Add indicators to the bottom of the carousel to display the number of
  // images and the order of the currently displayed image
  var carouselIndicators = document.createElement('ol');
  carouselIndicators.setAttribute('class', 'carousel-indicators');
  for (var i = 0; i < 4; i++) {
    var indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#introCarousel');
    indicator.setAttribute('data-slide-to', i);
    if (i == 0) {
      // Set the first indicator as the active indicator when the carousel loads
      indicator.setAttribute('class', 'active');
    }
    carouselIndicators.appendChild(indicator);
  }

  carousel.appendChild(carouselIndicators);


  /*<div class="carousel-inner">
    <div class="carousel-item active">
      <img src="..." class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5>First slide label</h5>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </div>
    </div>*/
  var innerCarousel = document.createElement('div');
  innerCarousel.setAttribute('class', 'carousel-inner');

  for (var i = 1; i < 5; i++) {
    var item = document.createElement('div');
    item.setAttribute('class', 'carousel-item');
    if (i == 1) {
      item.setAttribute('class', item.getAttribute('class') + ' active');
    }
    var itemImg = document.createElement('img');
    itemImg.setAttribute('src', `images/${i}.jpg`);
    itemImg.setAttribute('class', 'd-block w-100');
    item.appendChild(itemImg);

    innerCarousel.appendChild(item);
  }

  carousel.appendChild(innerCarousel);

  carousel.appendChild(createButton('prev'));
  carousel.appendChild(createButton('next'));

  carouselContainer.appendChild(carousel);

  return carouselContainer;
}

export default createCarousel;
