---
---
/*
* flickr() : Requête ajax qui récupère le photoset indiqué dans l'entete du post
* Les photos récupérées sont ensuite transformé en a > img puis ajouté à aside#photoset > p
*/
function flickr() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById('icon-loading').style.display = 'none';
      json_to_DOM( JSON.parse(xhr.responseText) );
    }
  };
  xhr.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key={{ site.flickr.api_key }}&photoset_id='+photoset_id+'&extras=url_sq,url_m,url_o&format=json&nojsoncallback=1', true);
  xhr.send(null)

  function json_to_DOM (json) {
    var docfrag = document.createDocumentFragment();

    json.photoset.photo.forEach( function( photo ) {
      var a = document.createElement('a');
      var img = document.createElement('img');

      a.href = photo.url_m;
      a.title = photo.title;
      img.src = photo.url_sq;
      img.alt = photo.title;
      a.addEventListener('click', open_frame);
      
      a.appendChild(img);
      docfrag.appendChild(a);
    });

    document.getElementById('photoset').getElementsByTagName('p')[0].appendChild( docfrag );
  }
}

/*
* open_frame() : Quand on clique sur une photo, elle s'ouvre dans un popup au lieu de s'ouvrir dans flickr
*/
function open_frame () {
  event.preventDefault();
  var target = event.target;
  var fullsize_photo = target.parentNode.href;

  var frame = document.getElementById('frame');
  frame.getElementsByTagName('figcaption')[0].innerText = target.alt;
  frame.style.display = 'block';


  var img = frame.getElementsByTagName('img')[0];
  img.src = fullsize_photo;
  img.alt = target.alt;


  var overlay = document.createElement('div');
  overlay.id = "overlay";

  document.body.appendChild( overlay );
  frame.appendChild( img );
}(event)

function close_frame() {
  document.getElementById('frame').style.display = 'none';
}

addLoadEvent(flickr);
// /*
// * Mini classe (pour se la péter…) qui récupère un photoset (beaucoup de bruit pour pas grand chose donc)
// */
// function Flickr (api_key) {
//   this.api_key = api_key;

//   this.photoset = function (photoset_id) {
//     var xhr = new XMLHttpRequest();

//     return xhr.onreadystatechange = function() {
//       if (xhr.readyState == 4 && xhr.status == 200) {
//         document.getElementById('icon-loading').style.display = 'none';
//         return json_to_DOM( JSON.parse(xhr.responseText) );
//       }
//     };

//     xhr.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key='+this.api_key+'&photoset_id='+photoset_id+'&extras=url_sq,url_m,url_o&format=json&nojsoncallback=1', true);
//     xhr.send(null)
//   };
// }