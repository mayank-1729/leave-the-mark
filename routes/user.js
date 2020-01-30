var mongo = require('mongoose');
var chalk = require('chalk')

var User = mongo.model('User')

exports.doCreate = function(req, res){
    var newUser = new User(); //creating instance of user model
    
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    newUser.save(function(err, savedUser){
        if(err){
            var msg = 'A user already exists with that username or email';
            console.log(chalk.red(msg));
            console.log(chalk.red('For checking',err));
            res.render('register',{errorMessage: msg});
            return;
        }else{
            req.session.newuser=savedUser.username;
            res.render('new-user', {session: req.session});
        }
    })

}

exports.authenticate = function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email:email}, function(err, user){
        if(err){
            var msg = 'Error fetching the data.';
            console.log(chalk.red(msg));
            console.log(chalk.red('For checking',err));
            res.render('login',{errorMessage: msg});
            return;
        }
        if(user == null){
            var msg = 'Invalid Email ID or Password';
            console.log(chalk.red('For checking',err));
            res.render('login',{errorMessage: msg});
            return;
        }
        console.log(chalk.blue('Print user',user));
        
        user.comparePassword(password, function(err,isMatch){
            if(isMatch && isMatch == true){
                var msg = 'Authentication Sucessfull';
                console.log(chalk.green(msg));
                req.session.username=user.username;
                req.session.loggedIn=true;
                res.render('new-story', {session: req.session});
                return;
            }else{
                var msg = 'Error fetching the data.';
                console.log(chalk.red(msg));
                console.log(chalk.red('For checking',err));
                res.render('login',{errorMessage: msg});
                return;
            }
        })
    })
}