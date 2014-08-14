var map;
var excursions = new Array();
var infoWindow = new google.maps.InfoWindow;
var bounds = new google.maps.LatLngBounds();

function googlemap() {

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

(function () {

  google.maps.Map.prototype.markers = new Array();
    
  google.maps.Map.prototype.addMarker = function(marker) {
    this.markers[this.markers.length] = marker;
  };
    
  google.maps.Map.prototype.getMarkers = function() {
    return this.markers
  };
    
  google.maps.Map.prototype.clearMarkers = function() {
    if(infoWindow) {
      infoWindow.close();
    }
    
    for(var i=0; i<this.markers.length; i++){
      this.markers[i].set_map(null);
    }
  };
})();

function createMarker(name, latlng, active) {
  var marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    // icon: '/public/images/star.png',
    map: map, 
    position: latlng});

  if (active)
    marker.setIcon ('/public/images/blue-marker.png');
  
  google.maps.event.addListener(marker, "click", function() {
    if (infoWindow) infoWindow.close();

    // infoWindow = new infoWindow({boxClass: 'infoWindow'});
    clone = document.getElementById("excursion-"+name).cloneNode(true);
    infoWindow.setContent (clone);
    clone.style.display = "inherit";
    infoWindow.open(map, marker);
  });
  return marker;
}

addLoadEvent(googlemap);
