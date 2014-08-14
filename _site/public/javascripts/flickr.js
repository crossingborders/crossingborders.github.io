function flickr() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById('icon-loading').style.display = 'none';
      json_to_DOM( JSON.parse(xhr.responseText) );
    }
  };
  xhr.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=ea1f0ff4ce1b6df0d47a12e54e26f5af&photoset_id='+photoset_id+'&extras=url_sq,url_m,url_o&format=json&nojsoncallback=1', true);
  xhr.send(null)

  function json_to_DOM (json) {
    var docfrag = document.createDocumentFragment();

    json.photoset.photo.forEach( function( photo ) {
      var a = document.createElement('a');
      var img = document.createElement('img');
      var li = document.createElement('li');

      a.href = photo.url_m;
      a.title = photo.title;
      img.src = photo.url_sq;
      img.alt = photo.title;
      a.addEventListener('click', open_photo);
      
      a.appendChild(img);
      li.appendChild(a);
      docfrag.appendChild(li);
    });

    document.getElementById('photoset').getElementsByTagName('ul')[0].appendChild( docfrag );
  }
}

function open_photo () {
  event.preventDefault();
  var target = event.target;
  var fullsize_photo = target.parentNode.href;

  var frame = document.getElementById('frame');
  frame.getElementsByTagName('figcaption')[0].innerText = target.alt;
  frame.style.top = window.pageYOffset-200+'px';
  frame.style.opacity = 1;

  var img = frame.getElementsByTagName('img')[0];
  img.src = fullsize_photo;
  img.alt = target.alt;


  var overlay = document.createElement('div');
  overlay.id = "overlay";

  document.body.appendChild( overlay );
  frame.appendChild( img );
}(event)

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