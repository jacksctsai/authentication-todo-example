var everyauth = require('everyauth');
var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );

everyauth.everymodule.findUserById( function (userId, callback) {
    User.
      findOne({ id : userId }).
      run( callback );
  });

everyauth.password
  .getLoginPath('/login') // Login page url
  .postLoginPath('/login') // Url that your login form POSTs to
  .loginView('login')
  .authenticate( function (login, password) {
    var promise = this.Promise();
    User.
      findOne({ id : login , password : password }).
      run( function ( err, user ){
        if ( !user ) {
          err = 'Invalid login';
        }

        if( err ) return promise.fulfill( [ err ] );

        promise.fulfill( user );
      });
    return promise;
  })
  .loginSuccessRedirect('/') // Where to redirect to after login
  .getRegisterPath('/signup') // Registration url
  .postRegisterPath('/signup') // Url that your registration form POSTs to
  .registerView('signup')
  .validateRegistration( function (newUser) {
    if (!newUser.login || !newUser.password) {
      return ['Either ID or Password is missing.'];
    }
    return null;
  })
  .registerUser( function (newUser) {
    var promise = this.Promise();
    new User({
        id : newUser.login,
        password : newUser.password
    }).save( function ( err, user, count ){
      if( err ) return promise.fulfill( [ err ] );

      promise.fulfill( user );
    });
    return promise;
  })
  .registerSuccessRedirect('/') // Url to redirect to after a successful registration
  .loginLocals( {title: 'Login'})
  .registerLocals( {title: 'Login'});

var everyauth = require('everyauth')
  , connect = require('connect');

everyauth.facebook
  .appId('731281890292714')
  .appSecret('d09cea8ea49210e31a6ad58c4237aaef')
  .handleAuthCallbackError( function (req, res) {
    res.redirect('/');
  })
  .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
    var promise = this.Promise();
    User.findOne({
      id : fbUserMetadata.id
    }).run( function( err, user ){
      if( err ) return promise.fulfill( [ err ] );
      if( user ) {
        promise.fulfill( user );
      } else {
        new User({
          id : fbUserMetadata.id,
          name : fbUserMetadata.name,
          profile : fbUserMetadata
        }).save( function ( err, user, count ){
          if( err ) return promise.fulfill( [ err ] );

          promise.fulfill( user );
        });
      }
    });
    return promise;
  })
  .redirectPath('/');


module.exports = {
  requireLogin: function( req, res, next ) {
    if (!req.loggedIn) {
      res.redirect( '/' );
      return;
    }
    next();
  }
};
