var express = require('express');
var mongo = require('mongoose'); //For setting up mongo database
var session = require('express-session'); //To maintain the session
var chalk = require('chalk'); //For colour full output on console
var bodyParser = require('body-parser'); //For parsing the incoming request

var db = require('./models/db.js'); //For connecting to the database.
var routesHandler = require('./routes/routes');
var userHandler = require('./routes/user');
var app = express();

/* Setting template engine */
app.set('view engine', 'ejs')

/* Setting the directory for static file */
app.use(express.static(__dirname + '/public'));

/* Set body-parser as middleware to parse the incoming request into json*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/* Setting the session */
app.use(session({secret:'marketvalue',resave: true, saveUninitialized: true}));

/* Setting up routes */
app.get('/', routesHandler.index); //landing page
app.get('/register', routesHandler.register); //registration page
app.get('/login', routesHandler.login) //login page
app.get('/new-story', routesHandler.newStory) //for adding new stories
app.get('/techStack', routesHandler.techStack) //for displaying the technologies used.

app.post('/newUser', userHandler.doCreate); //on click of registe button
app.post('/authenticate', userHandler.authenticate) //on click of login button.
app.post('/add-story', userHandler.addStory) //on submit add story to database.
app.get('/stories', userHandler.getStories) //get all the stories.
app.get('/stories/:story', userHandler.getStory) //get stories
app.post('/stories/:slug/saveComment', userHandler.saveComments) //post comments

app.get('/logout', routesHandler.logout) //logout of session


app.use(function(req, res) {
    console.log(chalk.red("Error: 404"));
    res.status(404).render('404');
});

app.use(function(error, req, res, next) {
    console.log(chalk.red('Error : 500'+error))
    res.status(500).render('500');
});




/* Starting off the server */
var PORT = process.env.PORT || 3000;
app.listen(PORT, function(req, res){
    console.log('Server started on "http://localhost'+PORT+'"')
})