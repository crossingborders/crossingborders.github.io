function initialize() {
  /*
  * Flickr part
  */
  if (typeof photoset_id != 'undefined') {
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
        img.src = photo.url_sq;
        img.alt = photo.title;
        
        a.appendChild(img);
        li.appendChild(a);
        docfrag.appendChild(li);
      });

      document.getElementById('photoset').getElementsByTagName('ul')[0].appendChild( docfrag );
      }
  }


  /*
  * Google map part
  */
  var myOptions = {
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 2
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
  

  var excursion =  new Object();
  excursion.name = "Thaïlande"
  excursion.lat =  12.716667
  excursion.lng =  101.166667
  excursions.push(excursion);

  var excursion =  new Object();
  excursion.name = "Myanmar"
  excursion.lat =  19.75
  excursion.lng =  96.1
  excursions.push(excursion);

  var excursion =  new Object();
  excursion.name = "Hong Kong"
  excursion.lat =  22.28552
  excursion.lng =  114.15769
  excursions.push(excursion);


  excursions.forEach( function (excursion) {
    var latlng = new google.maps.LatLng(excursion.lat, excursion.lng);

    active_marker = (excursion.lat == latitude && excursion.lng == longitude)? true : false;
    map.addMarker(createMarker(excursion.name,latlng, active_marker));
    bounds.extend(latlng);
  })
  map.fitBounds(bounds);
}