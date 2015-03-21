'use strict';

let koa = require('koa'),
    logger = require('koa-logger'),
    router = require('koa-router'),
    serve = require('koa-static'),
    views = require('koa-views'),
    compress = require('koa-compress'),
    parse = require('co-busboy'),
    bodyParse = require('co-body'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    redis = require("redis"),
    session = require('koa-session-redis'),
    marko = require('marko'),
    thunkify = require('co-thunkify'),
    Caman = require('caman').Caman;

let app = koa();
let render = views( __dirname + '/views/' );
let db  = redis.createClient();

app.use(session({
        store: {
            host: process.env.SESSION_PORT_6379_TCP_ADDR || '127.0.0.1',
            port: process.env.SESSION_PORT_6379_TCP_PORT || 6379,
            ttl: 3600
        }
    }
));

app.keys = ['6783E4929FD41511D9CF1B9C6DEF4'];
//app.use(logger());

app.use(compress({
    flush: require('zlib').Z_SYNC_FLUSH
}));

app.use(serve( __dirname + '/public'));
app.use(router(app));

app.get('/', function *() {

    if (this.session !== null) {
      this.session = null;
    }

    this.body = marko.load('./views/pages/home/home.marko').renderSync({});
    this.type = "text/html";
});

app.get('/pickup', function *() {

    this.body = marko.load('./views/pages/pickup/pickup.marko').renderSync({});
    this.type = "text/html";
});

app.get('/gimme', function *() {

    this.body = marko.load('./views/pages/gimme/gimme.marko').renderSync({
      gmImage: this.session.originalImage,
      gmImageId: this.session.gmImageId,
      gmNewColor: "#ff0000",
      colorStrength: 50
    });

    this.type = "text/html";
});

app.post('/gimme', function *(next) {

  var modifiedImageParts = yield bodyParse(this);

  // if this.session.gmImageId === modifiedImageParts.imageId

  var imgCamanedBase64 = yield camanExportImage(
      'public/' + this.session.originalImage,
      'public/gm/' + this.session.gmImageId + ".png",
      modifiedImageParts.newColor,
      modifiedImageParts.colorStrength
  );

  this.body = marko.load('./views/pages/gimme/gimme.marko').renderSync({
    gmImage: 'gm/' + this.session.gmImageId + ".png",
    gmImageId: this.session.gmImageId,
    gmNewColor: modifiedImageParts.newColor,
    colorStrength: modifiedImageParts.colorStrength,
    dataURI: imgCamanedBase64
  });

  this.type = "text/html";

});

app.post('/', function *(next) {

    var uploadParts = parse(this);
    var uploadPart;
    var stream;

    var randomImageId = Math.round(1 + Math.random() * 10000);
    var randomImagePath = randomImageId + '.png';

    while (uploadPart = yield uploadParts) {
        stream = fs.createWriteStream(path.join('public/uploads/', randomImagePath));
        uploadPart.pipe(stream);
        console.log('uploading %s -> %s', uploadPart.filename, stream.path);
    };

    this.session.originalImage = 'uploads/' + randomImagePath;
    this.session.gmImageId = randomImageId;
    this.redirect('/gimme');

});

function camanExportImage(inputPath, outputPath, hexColor, colorStrength) {

    return function(done) {
      Caman(inputPath, function () {
        this.vibrance(0)
        this.colorize(hexColor, colorStrength)
        this.render(function () {
          done(null, this.toBase64());
        });
      });
    };
}

let server = app.listen(3000);