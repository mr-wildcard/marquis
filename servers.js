'use strict';

let koa = require('koa'),
    router = require('koa-router'),
    serve = require('koa-static'),
    views = require('koa-views'),
    compress = require('koa-compress'),
    marko = require('marko');

let app = koa();
let render = views( __dirname + '/views/' );

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
    this.body = marko.load('./views/pages/gimme/gimme.marko').renderSync({});
    this.type = "text/html";
});

let server = app.listen(3000);