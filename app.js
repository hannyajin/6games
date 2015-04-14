
var url = "spritesheet.png";


var img = new Image();
img.src = url;

function Sprite(src,x,y,w,h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.src = src;

  this.img = new Image();
  this.img.src = src;

  this.render = function (ctx, x, y) {
    ctx.drawImage(src, this.x, this.y, this.w, this.h, x, y, this.w, this.h);
  };

};

// dom elements
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');


var appEl = document.getElementById('app');

img.onload = function() {
  canvas.width = img.width;
  canvas.height = img.height;

  // init game after sprite sheet has laoded
  console.log("Gfx loaded");

  var w = 256;
  var h = 256;

  var i = 8;
  var j = 8;

  var ww = w / i;
  var hh = h / j;

  var sprites = [];

  //console.log(sprites);

  //var spr = sprites[0];
  //appEl.appendChild(canvas);

  ctx.drawImage(img, 0, 0);
  // load individual sprites from sprite sheet
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      var sx = x * ww;
      var sy = y * hh;
      var spr = ctx.getImageData(sx, sy, ww, hh);
      sprites.push(spr);
    }
  };

  canvas.width = ww;
  canvas.height = hh;

  ctx.clearRect(0,0, ww, hh);

  for (spr in sprites) {
    var s = sprites[spr];

    ctx.putImageData(s, 0, 0);
    s.dataURL = canvas.toDataURL();

    var i = new Image();
    i.src = s.dataURL;

    s.img = i;

    //appEl.appendChild(i);
  };

  //appEl.appendChild(sprites[0].img);
  //appEl.appendChild(sprites[0].img);

  // now actual logic of the game

  var width = 5; // 5 card horizonally
  var height = 4; // 4 vertically

  var cards = [];

  var size = (width * height) / 2;

  var back = sprites.splice(sprites.length - 1, 1)[0];

  var first = null;
  var second = null;
  var flipped = 0;

  window.f = first;
  window.s = second;

  var _types = 0;
  for (var i = 0; i < size; i++) {
    // pick random cards from the spritesheet
    var n = (Math.random() * (sprites.length - 1)) | 0;
    var s = sprites.splice(n, 1)[0];

    //console.log("sprite: %s", s);

    function Card(s, type) {
      var t = new Image();
      t.id = cards.length;
      t.type = type;
      t._src = s.dataURL;
      t.src = s.dataURL;

      t.shown = false;
      t.front = new Image();
      t.front.src = back.dataURL;

      t.src = t.front.src;

      t.done = false; // has found twin card

      t.toggle = function () {
        var self = t;
        self.shown = !self.shown;
        if (self.shown)
          self.src = self._src; // card "face up"
        else
          self.src = self.front.src; // back of card
      };

      t.onclick = function() {
        var self = t;
        console.log("%s clicked", t.id);

        if (self.done || t.shown) return; // skip finished or flipped cards

        if (first == null) {
          //self.toggle();
          first = self;
          self.shown = true;
          self.src = self._src;
          console.log(first);
          console.log(second);
        } else if (second == null) {
          //self.toggle();
          second = self;
          self.shown = true;
          self.src = self._src;

          // check to see if we've flipped the twin also
          if (first.type == second.type) {
            // match
            console.log("found matching cards!");
            first.done = true;
            second.done = true;
            flipped++;

            // reset the active chosen card variables
            first = null;
            second = null;

            // check win condition
            for (var i = 0; i < cards.length; i++) {
              var c = cards[i];
              if (!c.done)
                return;
            };
            // if we reach down here we've won
            console.log("victory!");
          } else {
            // no match 
            console.log("no match found :/");
            //
            // aahhh... too fast reset...
            // reset the cards
            setTimeout(function () {
              first.shown = false;
              first.src = first.front.src;
              second.shown = false;
              second.src = second.front.src;
              first = null;
              second = null;
            }, 2000);
          }
        } else {
          console.log("error ljsd");
        }
      }; // eof onclick
      return t;
    };

    // double of each card
    cards.push( new Card(s, _types) );
    cards.push( new Card(s, _types++) );
  };

  console.log("cards len: %s, size: %s", cards.length, size);

  // shuffle the cards (insert replace - I think)
  for (var i = 0; i < cards.length; i++) {
    var t = cards[i];
    var r = (Math.random() * cards.length) | 0;
    cards[i] = cards[r];
    cards[r] = t;
  };

  // append them into lists for better dom structure
  var ul = document.createElement('ul');
  for (var y = 0; y < height; y++) {
    var li = document.createElement('li');
    for (var x = 0; x < width; x++) {
      li.appendChild(cards[y * width + x]);
    }
    ul.appendChild(li);
  }

  appEl.appendChild(ul);
  //for (var i = 0; i < cards.length; i++) {
  //  appEl.appendChild(cards[i]);
  //}
};

