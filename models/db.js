var mongo = require('mongoose');
var chalk = require('chalk');
var crypto = require('crypto');

var SALT_WORK_FACTOR = 10; //no of iteration to create for creating the hash.

var dbUrl = 'mongodb://localhost/test'; //using Database credentials, create an url

//var dbUrl = 'mongodb+srv://mayank:root@cluster0-quivo.mongodb.net/test?retryWrites=true&w=majority'

mongo.connect(dbUrl); //connect to database

mongo.connection.on('connected', function(){
    console.log(chalk.green('Mongoose connected to: '+ dbUrl));
});

mongo.connection.on('error', function(error){
    console.log(chalk.red('Error while connecting to MongoDB. Error: ', error));
});

mongo.connection.on('disconnected', function(){
    console.log(chalk.yellow('Mongo has been disconnected.'));
});


/* Creating user schema */
var userSchema = mongo.Schema({
    username: {type:String, unique:true},
    email:{type:String, unique:true},
    password:String
});

/* Creating the hook */
userSchema.pre('save', function(next){
    var user = this;
    console.log(chalk.blue('Before registering the user.'));

    if(!user.isModified('password')) return next();

    //genrate salt
    const key = crypto.pbkdf2Sync(user.password, 'P@@$WORD'/* Salt */, SALT_WORK_FACTOR, 512, 'sha512');
    console.log(chalk.blue('password after encrytion =>', key.toString('hex')));

    user.password  = key.toString('hex');
    next();
});

/* Creating  utlity method to compare password */
userSchema.methods.comparePassword = function(candidatePasswd, cb){
    const key = crypto.pbkdf2Sync(candidatePasswd, 'P@@$WORD'/* Salt */, SALT_WORK_FACTOR, 512, 'sha512');

    if(key.toString('hex') == this.password){
        cb(null, true)
    }else {
        cb(new Error('Invalid Password'));
    }

}

/* build the user model */
mongo.model('User', userSchema);

/* Creating story schema */
var storySchema = mongo.Schema({
    author: {type:String},
    title:{type:String, unique:true},
    created_at:{type: Date, default:Date.now},
    summary:{type:String},
    content:{type:String},
    imageLink:{type:String},
    comments:[{body:String, commented_by:String, date:Date}],
    slug:String
});

/* build the user model */
mongo.model('Story', storySchema, 'stories');