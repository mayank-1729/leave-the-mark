exports.index = function(req, res){
    res.render('index', {session:req.session});
}

exports.register = function(req, res){
    res.render('register')
}

exports.login = function(req, res){
    res.render('login')
}