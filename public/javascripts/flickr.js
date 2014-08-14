---
---
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

// /*
// * Convertis le JSON récupéré via l'API de Flickr en noeuds (li > a > img) puis l'insère dans #photoset > ul
// */
// function json_to_DOM (json) {    
//   var docfrag = document.createDocumentFragment();

//   json.photoset.photo.forEach( function( photo ) {
//     var a = document.createElement('a');
//     var img = document.createElement('img');
//     var li = document.createElement('li');

//     a.href = photo.url_m;
//     img.src = photo.url_sq;
//     img.alt = photo.title;
    
//     a.appendChild(img);
//     li.appendChild(a);
//     docfrag.appendChild(li);
//   })

//   return docfrag;
// }
