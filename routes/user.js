var mongo = require('mongoose');
var chalk = require('chalk')

var User = mongo.model('User')
var Story = mongo.model('Story')

exports.doCreate = function (req, res) {
    var newUser = new User(); //creating instance of user model

    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    newUser.save(function (err, savedUser) {
        if (err) {
            var msg = 'A user already exists with that username or email';
            console.log(chalk.red(msg));
            console.log(chalk.red('For checking', err));
            res.render('register', { errorMessage: msg });
            return;
        } else {
            req.session.newuser = savedUser.username;
            res.render('new-user', { session: req.session });
        }
    })

}

exports.authenticate = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email }, function (err, user) {
        if (err) {
            var msg = 'Error fetching the data.';
            console.log(chalk.red(msg));
            console.log(chalk.red('For checking', err));
            res.render('login', { errorMessage: msg });
            return;
        }
        if (user == null) {
            var msg = 'Invalid Email ID or Password';
            console.log(chalk.red('For checking', err));
            res.render('login', { errorMessage: msg });
            return;
        }
        console.log(chalk.blue('Print user', user));

        user.comparePassword(password, function (err, isMatch) {
            if (isMatch && isMatch == true) {
                var msg = 'Authentication Sucessfull';
                console.log(chalk.green(msg));
                req.session.username = user.username;
                req.session.loggedIn = true;
                res.render('new-story', { session: req.session });
                return;
            } else {
                var msg = 'Error fetching the data.';
                console.log(chalk.red(msg));
                console.log(chalk.red('For checking', err));
                res.render('login', { errorMessage: msg });
                return;
            }
        })
    })
}

exports.addStory = function (req, res) {
    var newStory = new Story();

    newStory.author = req.session.username;
    newStory.title = req.body.title;
    newStory.content = req.body.content;
    newStory.summary = req.body.summary;
    newStory.imageLink = req.body.imageLink;

    var lowercaseTitle = newStory.title.toLowerCase();
    var slug = lowercaseTitle.replace(/[^a-zA-Z0-9 ]/g, "");
    var addingHyphen = slug.replace(/\s+/g, '-');

    newStory.slug = addingHyphen;

    newStory.save(function (err, savedStory) {
        if (err) {
            console.log("Error : While saving the story");
            console.log("Error : ", + err);
            return res.status(500).send();
        } else {
            res.redirect("/stories");
        }
    });
}

exports.getStory = function(req, res){
    var storyTitle = req.params.story;
    Story.findOne({slug:storyTitle}, function(err, gotStory){
        if(err || gotStory == undefined){
            console.log("Error : While getting the story");
            return res.status(500).send();
        }else{
            res.render('story',{story:gotStory,session:req.session});
        }
        
    })
}
exports.getStories = function(req, res){
    //console.log(chalk.blue('isnide getstories'))
    Story.find({},function(err, gotStory){
        if(err){
            console.log("Error : While getting the stories");
            return res.status(500).send();
        }else{
            //console.log(chalk.blue(gotStory))
            res.render('home',{stories:gotStory,session:req.session});
        }
        
    })
}

exports.saveComments = function(req, res){
    console.log(chalk.blue('isnide saveComments'))

    var storySlug = req.params.slug;
    var comment = req.body.comment;
    var postedDate = new Date();
    
    Story.findOne({slug: storySlug}, function(err, story){
        if(err){
            console.log("Error : While getting the story");
            return res.status(500).send();
        }
        story.comments.push({body:comment,commented_by:req.session.username,date:postedDate});
        story.save(function(err, savedStory){
            if(err){
                console.log("Error : While getting the story");
                return res.status(500).send();
            }
            res.render('story',{story:savedStory,session:req.session});
        })
    })
}