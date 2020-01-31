exports.index = function(req, res){
    res.render('index', {session:req.session});
}

exports.register = function(req, res){
    res.render('register')
}

exports.login = function(req, res){
    res.render('login')
}

exports.newStory = function(req, res){
    if(req.session.loggedIn != true){
        console.log("Logged In :"+req.session.loggedIn);
        res.redirect('/login');
    }else{
        res.render('new-story', {session:req.session})
    }
}

exports.techStack = function(req,res){
    res.render('techStack', {session: req.session})
}

exports.logout = function(req,res){
    var logoutUser = req.session.username;
    req.session.destroy();
    console.log('dbvkjsdabgkjdsgkjheeeeeeee')
    res.render('logout', {loggedOutUser:logoutUser})
}