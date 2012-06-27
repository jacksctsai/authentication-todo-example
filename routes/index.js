var mongoose = require( 'mongoose' );
var Todo     = mongoose.model( 'Todo' );
var utils    = require( 'connect' ).utils;
var everyauth= require( 'everyauth' );

exports.index = function ( req, res, next ){
  if (!req.loggedIn) {
      res.render( 'index', {
          title : 'Express Todo Example',
          todos : []
      });
      return;
  }
  Todo.
    //find({ user_id : req.cookies.user_id }).
    find({ user_id : req.user.id }).
    sort( 'updated_at', -1 ).
    run( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'index', {
          title : 'Express Todo Example',
          todos : todos
      });
    });
};

exports.create = function ( req, res, next ){
  new Todo({
      //user_id    : req.cookies.user_id,
      user_id    : req.user.id,
      content    : req.body.content,
      updated_at : Date.now()
  }).save( function ( err, todo, count ){
    if( err ) return next( err );

    res.redirect( '/' );
  });
};

exports.destroy = function ( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    //if( todo.user_id !== req.cookies.user_id ){
    if( todo.user_id !== req.user.id ){
      return utils.forbidden( res );
    }

    todo.remove( function ( err, todo ){
      if( err ) return next( err );

      res.redirect( '/' );
    });
  });
};

exports.edit = function( req, res, next ){
  Todo.
    //find({ user_id : req.cookies.user_id }).
    find({ user_id : req.user.id }).
    sort( 'updated_at', -1 ).
    run( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'edit', {
        title   : 'Express Todo Example',
        todos   : todos,
        current : req.params.id
      });
    });
};

exports.update = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    //if( todo.user_id !== req.cookies.user_id ){
    if( todo.user_id !== req.user.id ){
      return utils.forbidden( res );
    }

    todo.content    = req.body.content;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );

      res.redirect( '/' );
    });
  });
};

//exports.current_user = function ( req, res, next ){
//  if( !req.cookies.user_id ){
//    res.cookie( 'user_id', utils.uid( 32 ));
//  }
//
//  next();
//};
