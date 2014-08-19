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
      var img = document.createElement('img');
      img.src = photo.url_sq;
      img.alt = photo.title;

      var a = document.createElement('a');
      a.href = photo.url_m;
      a.title = photo.title;
      a.id = photo.id;
      a.appendChild(img);
      
      docfrag.appendChild(a);
    });

    document.getElementById('photoset').getElementsByTagName('p')[0].appendChild( docfrag );
    document.getElementById('photoset').onclick = function() {
      this.style.display = 'inherit';
    };

    var g = new Gallery({'id': 'photoset', 'frame': 'frame'});
  }
}


function Gallery(params) {
  this.container = document.getElementById(params.id);
  this.frame = document.getElementById(params.frame);
  this.photos = [];
  var links = this.container.getElementsByTagName('a');
  var previous_photo = null;

  for (var i=0; i < links.length; i++) {
    var photoNode = links[i];
    var current_photo = new Photo(photoNode);
    photoNode.addEventListener('click', this.add_photo_to_frame.bind(this), false);
    current_photo.previous = previous_photo;
    current_photo.next = null
    this.photos[parseInt(current_photo.id)] = current_photo;

    if(previous_photo !== null)
      this.photos[previous_photo].next = current_photo.id;

    previous_photo = current_photo.id;
  }

  this.overlay = document.createElement('div');
  this.overlay.id = 'overlay';
  this.overlay.addEventListener('click', this.close_frame);
  document.body.appendChild(this.overlay);

  this.link_to_previous_photo = document.createElement('a');
  this.link_to_previous_photo.alt = "Photo précédente";
  this.link_to_previous_photo.className += " fa fa-arrow-left";
  this.link_to_previous_photo.rel = "prev";
  this.link_to_previous_photo.addEventListener('click', this.add_photo_to_frame.bind(this), false);
  this.frame.appendChild( this.link_to_previous_photo );
  
  this.link_to_next_photo = document.createElement('a');
  this.link_to_next_photo.alt = "Photo suivante";
  this.link_to_next_photo.className += " fa fa-arrow-right";
  this.link_to_next_photo.rel = "next";
  this.link_to_next_photo.addEventListener('click', this.add_photo_to_frame.bind(this), false);
  this.frame.appendChild( this.link_to_next_photo );

};

Gallery.prototype = {
  add_photo_to_frame: function (event) {
    event.preventDefault();
    var target = event.target;
    if (typeof target.href === 'undefined')
      target = event.target.parentNode;

    this.set_current_photo(this.photos[target.id]);

    if( this.is_the_first_photo() )
      this.set_link_to_previous_photo( null )
    else
      this.set_link_to_previous_photo( this.previous_photo() );

    if( this.is_the_last_photo() )
      this.set_link_to_next_photo( null )
    else
      this.set_link_to_next_photo( this.next_photo() );

    this.display_frame();
  },
  set_current_photo: function (photo) {
    this.current_photo = photo;

    this.frame_title(this.current_photo.title);
    this.frame_image(this.current_photo.href);
  },
  set_link_to_previous_photo: function (photo) {
    if (photo === null)
      return this.link_to_previous_photo.style.display = 'none';

    this.link_to_previous_photo.href = photo.href;
    this.link_to_previous_photo.id = photo.id;
    this.link_to_previous_photo.style.display = 'initial';
  },
  set_link_to_next_photo: function (photo) {
    if (photo === null)
      return this.link_to_next_photo.style.display = 'none';

    this.link_to_next_photo.href = photo.href;
    this.link_to_next_photo.id = photo.id;
    this.link_to_next_photo.style.display = 'initial';
  },
  previous_photo: function () {
    return this.photos[this.current_photo.previous];
  },
  next_photo: function () {
    return this.photos[this.current_photo.next];
  },
  frame_title: function(title) {
    if(typeof title === 'undefined')
      return this.frame.getElementsByTagName('figcaption')[0].innerText;

    this.frame.getElementsByTagName('figcaption')[0].innerText = title;
  },  
  frame_image: function(href) {
    if(typeof href === 'undefined')
      return this.frame.getElementsByTagName('img')[0].src;

    this.frame.getElementsByTagName('img')[0].src = href;
  },
  is_the_first_photo: function () {
    return this.current_photo.previous === null;
  },
  is_the_last_photo: function () {
    return this.current_photo.next === null;
  },
  display_frame: function () {
    this.display_overlay();
    this.frame.style.display = 'initial';
  },
  display_overlay: function () {
    this.overlay.style.display = 'initial';
  },
  close_frame: function () {
    document.getElementById('frame').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }
};

function Photo(node) {
  this.node = node;
  this.id = node.id;
  this.href = node.href;
  this.title = node.title;
}

addLoadEvent(flickr);