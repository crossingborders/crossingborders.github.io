---
---
var map;
var excursions = new Array();
var infoWindow = new google.maps.InfoWindow;
var bounds = new google.maps.LatLngBounds();

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

