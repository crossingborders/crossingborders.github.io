---
---
/*
* flickr() : Requête ajax qui récupère le photoset indiqué dans l'entete du post
* Les photos récupérées sont ensuite transformé en a > img puis ajouté à aside#photoset > p
*/
function flickr() {
  var extras = ['url_t', 'url_m', 'url_o'],
      xhr = new XMLHttpRequest();

  xhr.addEventListener('readystatechange', photoset_downloaded);
  xhr.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key={{site.flickr.api_key}}&photoset_id='+photoset_id+'&extras='+extras.join(',')+'&format=json&nojsoncallback=1', true);
  xhr.send(null)

}

function photoset_downloaded () {
  if (this.readyState != 4 || this.status != 200)
    return false;

  var featured_image,
      photos = [],
      photoset = JSON.parse(this.responseText).photoset;

  for (var i=0; i<photoset.photo.length; i++) {
    var photo = photoset.photo[i];

    photos.push({ thumb: photo.url_t, 
                  image: photo.url_m,
                  big: photo.url_o,
                  original: photo.url_o,
                  title: photo.title,
                  link: photo.url_o});

    if (photo.isprimary === '1')
      featured_image = photos[i];
  }

  if (typeof featured_image === 'undefined')
    featured_image = photos[0];
    
  var img = document.querySelector('#featured_image > img')
  img.src = featured_image.original;
  img.title = featured_image.title;
  document.querySelector('article > header h1').style.position = 'absolute';

  document.querySelector('#featured_image').addEventListener('click', function() {
    event.preventDefault();

    document.querySelector('.galleria').style.display = 'initial';
    Galleria.run('.galleria', {
      dataSource: photos
    });

    var close = document.createElement('span');
    close.id = 'close_galleria';
    close.innerHTML = '<i class="fa fa-times"></i>';
    close.style.display = 'initial';
    close.addEventListener('click', function() {
      document.querySelector('.galleria').style.display = 'none';
    });

    document.querySelector('.galleria').appendChild(close);

    $(document).keyup(function(e) {
      if (e.keyCode == 27) { document.querySelector('#close_galleria').click(); }   // esc
    });
  });
}

addLoadEvent(flickr);
