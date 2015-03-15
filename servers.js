'use strict';

let koa = require('koa'),
    logger = require('koa-logger'),
    router = require('koa-router'),
    serve = require('koa-static'),
    views = require('koa-views'),
    compress = require('koa-compress'),
    parse = require('co-busboy'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    redis = require("redis"),
    session = require('koa-session-redis'),
    marko = require('marko'),
    thunkify = require('co-thunkify'),
    gm = require('gm').subClass({ imageMagick: true });

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

    this.body = marko.load('./views/pages/home/home.marko').renderSync({});
    this.type = "text/html";
});

app.get('/pickup', function *() {

    this.body = marko.load('./views/pages/pickup/pickup.marko').renderSync({});
    this.type = "text/html";
});

app.get('/gimme', function *() {

    this.body = marko.load('./views/pages/gimme/gimme.marko').renderSync({
        gmImagePath: this.session.finalImage
    });

    this.type = "text/html";
});

app.post('/', function *(next) {

    var uploadParts = parse(this);
    var uploadPart;
    var stream;

    var randomImagePath = Math.round(1 + Math.random() * 10000) + '.png';

    while (uploadPart = yield uploadParts) {
        stream = fs.createWriteStream(path.join('uploads/', randomImagePath));
        uploadPart.pipe(stream);
        console.log('uploading %s -> %s', uploadPart.filename, stream.path);
    }

    yield exportImage('uploads/' + randomImagePath, 'public/gm/' + randomImagePath);

    this.session.finalImage = 'gm/' + randomImagePath;
    this.redirect('/gimme');

});

function exportImage(inputPath, outputPath) {

    return function(done) {
        gm(inputPath)
            .flip()
            .write(outputPath, done);
    };

}

let server = app.listen(3000);