---
---

{% if include.latitude and include.longitude %}
  {% assign longitude = include.longitude %}
  {% assign latitude = include.latitude %}
{% else %}
  {% assign longitude = false %}
  {% assign latitude = false %}
{% endif %}

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
  
function initialize() {
  var myOptions = {
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 2
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
  
{% for excursion in site.data.excursions %}
  var excursion =  new Object();
  excursion.name = "{{ excursion.country }}"
  excursion.lat =  {{ excursion.latitude }}
  excursion.lng =  {{ excursion.longitude }}
  excursions.push(excursion);
{% endfor %}

  excursions.forEach( function (excursion) {
    var latlng = new google.maps.LatLng(excursion.lat, excursion.lng);

    active_marker = (excursion.lat == {{latitude}} && excursion.long == {{longitude}})? true : false;
    map.addMarker(createMarker(excursion.name,latlng, active_marker));
    bounds.extend(latlng);
  })

  map.fitBounds(bounds);
}

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

