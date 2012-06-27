/**
 * Module dependencies.
 */

var express = require( 'express' );
var everyauth = require('everyauth');

var app = module.exports = express.createServer();

// mongoose setup
require( './db' );

// autoentication setup
var auth = require( './auth' );

// add everyauth view helpers to express
everyauth.helpExpress( app );

var routes = require( './routes' );

// Configuration
app.configure( 'development', function (){
  app.set( 'views', __dirname + '/views' );
  app.set( 'view engine', 'ejs' );
  app.use( express.favicon());
  app.use( express.static( __dirname + '/public' ));
  app.use( express.logger());
  app.use( express.cookieParser());
  app.use( express.bodyParser());
  //app.use( routes.current_user );
  app.use( express.session({secret: 'nodeTWParty'}) );
  app.use( everyauth.middleware() );
  app.use( app.router );
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});

app.configure( 'production', function (){
  app.set( 'views', __dirname + '/views' );
  app.set( 'view engine', 'ejs' );
  app.use( express.cookieParser());
  app.use( express.bodyParser());
  //app.use( routes.current_user );
  app.use( express.session({secret: 'nodeTWParty'}) );
  app.use( everyauth.middleware() );
  app.use( app.router );
  app.use( express.errorHandler());
});

// Routes
app.get( '/', routes.index );
app.post( '/create', auth.requireLogin, routes.create );
app.get( '/destroy/:id', auth.requireLogin, routes.destroy );
app.get( '/edit/:id', auth.requireLogin, routes.edit );
app.post( '/update/:id', auth.requireLogin, routes.update );

app.listen( 3001, '127.0.0.1', function (){
  console.log( 'Express server listening on port %d in %s mode', app.address().port, app.settings.env );
});
