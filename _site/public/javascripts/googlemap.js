var map;
var bounds = new google.maps.LatLngBounds();
var infoWindow = new google.maps.InfoWindow;

function googlemap() {
  var geocoder, active_marker;

  var myOptions = {
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 2
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
  geocoder = new google.maps.Geocoder();
  


  geocoder.geocode({'address': "Myanmar"}, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var location = results[0];
      var latlng = location.geometry.location;
      var active_marker = (country == 'Myanmar')? true : false;

      map.addMarker(createMarker(location.formatted_address, latlng, active_marker));
    }
  });


  geocoder.geocode({'address': "Thaïlande"}, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var location = results[0];
      var latlng = location.geometry.location;
      var active_marker = (country == 'Thaïlande')? true : false;

      map.addMarker(createMarker(location.formatted_address, latlng, active_marker));
    }
  });


  geocoder.geocode({'address': "France"}, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var location = results[0];
      var latlng = location.geometry.location;
      var active_marker = (country == 'France')? true : false;

      map.addMarker(createMarker(location.formatted_address, latlng, active_marker));
    }
  });

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
    map: map, 
    position: latlng});

  if (active)
    marker.setIcon ('/public/images/blue-marker.png');
  
  google.maps.event.addListener(marker, "click", function() {
    if (infoWindow) infoWindow.close();

    clone = document.getElementById("excursion-"+name).cloneNode(true);
    infoWindow.setContent (clone);
    clone.style.display = "inherit";
    infoWindow.open(map, marker);
  });

  bounds.extend(latlng);
  map.fitBounds(bounds);

  return marker;
}

addLoadEvent(googlemap);
