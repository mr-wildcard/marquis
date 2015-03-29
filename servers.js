'use strict';

let koa       = require('koa'),
    logger    = require('koa-logger'),
    router    = require('koa-router'),
    serve     = require('koa-static'),
    views     = require('koa-views'),
    compress  = require('koa-compress'),
    parse     = require('co-busboy'),
    saveTo = require('save-to'),
    bodyParse = require('co-body'),
    fs        = require('fs'),
    os        = require('os'),
    path      = require('path'),
    redis     = require("redis"),
    session   = require('koa-session-redis'),
    marko     = require('marko'),
    thunkify  = require('co-thunkify'),
    Caman     = require('caman').Caman;

let appConfig   = require('./config/config'),
    imageConfig = appConfig.image;

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

app.use(compress({
    flush: require('zlib').Z_SYNC_FLUSH
}));

app.use(serve( __dirname + '/public'));
app.use(router(app));

app.keys = appConfig.local.keys;

app.get('/', function *() {
    this.body = marko.load('./views/pages/home/home.marko').renderSync({});
    this.type = "text/html";
});

app.post('/', function *(next) {

  var uploadParts = parse(this, {
    autoFields: true // saves the fields to parts.field(s)
  });

  var uploadPart;

  var randomImageId = Math.round(1 + Math.random() * 10000);
  var randomImagePath = randomImageId + '.png';

  while (uploadPart = yield uploadParts) {

    yield saveTo(uploadPart, path.join(
        imageConfig.publicFolder,
        imageConfig.tmpFolder,
        randomImagePath
    ));

  };

  this.session.originalImage = imageConfig.tmpFolder + randomImagePath;
  this.session.imageID = randomImageId;

  this.body = {
    redirect: 'gimme'
  };

});

app.get('/gimme', function *() {

  if (!this.session.originalImage) {
      //this.redirect('/');
  };

  this.body = marko.load('./views/pages/gimme/gimme.marko').renderSync({
    originalImage: this.session.originalImage,
    imageID: this.session.imageID,
    newColor: imageConfig.colorizeColor,
    newColorStrength: imageConfig.colorizeStrength
  });

  this.type = "text/html";
});

app.post('/gimme', function *(next) {

  var modifiedImageParts = yield bodyParse(this);

  // if this.session.imageID === modifiedImageParts.imageId

  var modifiedImageBase64 = yield camanExportImage(
          'public/' + this.session.originalImage,
          'public/gm/' + this.session.imageID + ".png",
      modifiedImageParts.newColor,
      modifiedImageParts.colorStrength
  );

  this.body = marko.load('./views/pages/gimme/gimme.marko').renderSync({
    originalImage: 'gm/' + this.session.imageID + ".png",
    imageID: this.session.imageID,
    newColor: modifiedImageParts.newColor,
    newColorStrength: modifiedImageParts.newColorStrength,
    dataURI: modifiedImageBase64
  });

  this.type = "text/html";

});

app.get('/pickup', function *() {
    this.body = marko.load('./views/pages/pickup/pickup.marko').renderSync({});
    this.type = "text/html";
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