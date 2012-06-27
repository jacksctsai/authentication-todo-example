var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Todo = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});

var User = new Schema({
    id    : { type : String, unique : true },
    name  : String,
    profile    : String,
    password   : String
});

mongoose.model( 'Todo', Todo );
mongoose.model( 'User', User );

mongoose.connect( 'mongodb://localhost/express-todo' );
