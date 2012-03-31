#!/usr/bin/env node

var Hook = require('hook.io').Hook;
var express = require('express');


var hook = new Hook( {
  name: 'express-websvr',
  debug: true
});

var routes = require('./expr/routes')(hook);

hook.on('hook::ready', function(){
  hook.emit('hello', 'hello poobear');

  var app = module.exports = express.createServer();

  app.configure(function(){
    app.set('views', __dirname + '/expr/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/expr/public'));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
  });

  app.get('/', routes.index);

  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

  hook.on('*::hello', function(data){
    console.log('ive got commander data', data);
  });
});

hook.start();
