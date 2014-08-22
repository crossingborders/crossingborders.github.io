---
---
/*
* flickr() : Requête ajax qui récupère le photoset indiqué dans l'entete du post
* Les photos récupérées sont ensuite transformé en a > img puis ajouté à aside#photoset > p
*/
function flickr() {
  var flickr = new Flickr({
    'api_key': '{{ site.flickr.api_key }}', 
    'photoset': photoset_id,
    'container': 'photoset',
    'extras': ['url_sq', 'url_m', 'url_o']
  });
  flickr.load();
}

function Flickr(params) {
  this.api_key = params.api_key;
  this.photoset = params.photoset;
  this.container = document.getElementById(params.container);
  this.extras = params.extras;

  this.icon_loading = document.getElementById('icon-loading');
  this.xhr = new XMLHttpRequest();
  this.xhr.addEventListener('readystatechange', this.downloaded.bind(this));
}

Flickr.prototype = {
  load: function () {
    this.xhr.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key='+this.api_key+'&photoset_id='+this.photoset+'&extras='+this.extras.join(',')+'&format=json&nojsoncallback=1', true);
    this.xhr.send(null)
  },

  downloaded: function () {
    if (this.xhr.readyState == 4 && this.xhr.status == 200) {
      this.icon_loading.style.display = 'none';
      var json_response = JSON.parse(this.xhr.responseText);
      this.json_to_DOM( json_response );      
    }
  },

  json_to_DOM: function (json) {
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

    this.container.getElementsByTagName('p')[0].appendChild( docfrag );
    this.container.onclick = function() {
      this.style.display = 'inherit';
    };

var g = new Gallery({'id': 'photoset', 'frame': 'frame'});
/**
* j'aimerais utiliser le code de dessous dans la classe Gallery au lieu de créer une galerie dans la class Flickr :
*    var observer = new MutationObserver(this.mutated);
*    observer.observe (this.container, {childList: true, subtree: true});
**/

  }
};



function Gallery(params) {
  this.container = document.getElementById(params.id);

  this.create_frame(params.frame);
  this.create_overlay();

  this.photos = [];
  this.dom_changed();

  var observer = new MutationObserver(this.mutated);
  observer.observe (this.container, {childList: true, subtree: true});
};

Gallery.prototype = {
  mutated: function(mutations, observer) {
    // alert(observer);
  },

  dom_changed: function (mutations) {
    // if ( typeof mutations === 'undefined' ) return;

    // mutations.forEach(function (mutation) {
    //   console.log (mutation);
    // });

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
  },

  add_photo_to_frame: function (event) {
    event.preventDefault();
    var target = event.target;
    if (typeof target.href === 'undefined')
      target = event.target.parentNode;

    this.start_loading();
    this.set_current_photo(this.photos[target.id]);

    this.set_navigation_link( this.link_to_previous_photo, this.previous_photo() );
    this.set_navigation_link( this.link_to_next_photo, this.next_photo() );

    this.display_frame();
  },

  set_current_photo: function (photo) {
    this.current_photo = photo;

    this.frame_image(this.current_photo.href);
  },
  /*
  *  Crée figure#frame et dedans figcaption + img + a.next + a.previous
  *  puis l'ajoute à body
  */
  create_frame: function(frame_name) {
    this.frame = document.createElement('figure');
    this.frame.id = frame_name;

    this.frame_title = document.createElement('figcaption');
    this.frame.appendChild( this.frame_title );
    this.displayed_photo = document.createElement('img');
    this.frame.appendChild( this.displayed_photo );
    this.displayed_photo.addEventListener('load', this.photo_downloaded.bind(this), false);

    this.link_to_previous_photo = this.create_navigation_link('Photo précédente', 'fa fa-arrow-left', 'prev');
    this.link_to_next_photo = this.create_navigation_link('Photo suivante', 'fa fa-arrow-right', 'next');
    document.body.appendChild( this.frame );
  },

  create_navigation_link: function(title, className, rel) {
    var link = document.createElement('a');
    link.title = title;
    link.alt = title;
    link.className += ' '+className;
    link.rel = rel;
    link.addEventListener('click', this.add_photo_to_frame.bind(this), false);
    this.frame.appendChild( link );

    return link;
  },

  /*
  *  Crée div#overlay pour le fond noir
  */
  create_overlay: function () {
    this.overlay = document.createElement('div');
    this.overlay.id = 'overlay';
    this.overlay.addEventListener('click', this.close_frame.bind(this), false);
    document.body.appendChild(this.overlay);
  },

  set_navigation_link: function (link, photo) {
    if (typeof photo === 'undefined')
      return link.style.display = 'none';

    link.href = photo.href;
    link.id = photo.id;
    link.style.display = 'initial';
  },

  previous_photo: function () {
    return this.photos[this.current_photo.previous];
  },

  next_photo: function () {
    return this.photos[this.current_photo.next];
  },

  frame_image: function(href) {
    if(typeof href === 'undefined')
      return this.frame.getElementsByTagName('img')[0].src;

    this.displayed_photo.src = href;
  },

  display_frame: function () {
    this.display_overlay();
    this.frame.style.display = 'initial';
  },

  display_overlay: function () {
    this.overlay.style.display = 'initial';
  },

  close_frame: function () {
    this.frame.style.display = 'none';
    this.overlay.style.display = 'none';
  },

  photo_downloaded: function () {
    this.frame_title.textContent = this.current_photo.title;
    this.displayed_photo.parentNode.style.margin = '-'+this.displayed_photo.height/2+'px 0 0 -'+this.displayed_photo.width/2+'px';
  },

  start_loading: function() {
    this.frame_title.textContent = 'Loading…';
  }
};

function Photo(node) {
  this.node = node;
  this.id = node.id;
  this.href = node.href;
  this.title = node.title;
}

addLoadEvent(flickr);