module.exports = function ( app ) {
    app.get('/home', function (req, res) {
        if(req.session.user){
            var Commodity = global.dbHelper.getModel('commodity');
            Commodity.find({}, function (error, docs) {
                res.render('home',{Commoditys:docs});
            });
        }else{
            req.session.error = "請先登錄"
            res.redirect('/login');
        }
    });
    app.get('/addcommodity', function(req, res) {
        if(req.session.user["name"] == "admin"){
            res.render('addcommodity');
        }
        else{
            res.redirect("/home");
        }
    });
    app.post('/addcommodity', function (req, res) {

        if(req.session.user["name"] == "admin"){
            var Commodity = global.dbHelper.getModel('commodity');
            Commodity.create({
                name: req.body.name,
                score: req.body.score,
                imgSrc: req.body.imgSrc,
                amount: req.body.amount
            }, function (error, doc) {
                if (doc) {
                    res.send(200);
                }else{
                    res.send(404);
                }
            });
        }
        else{
            res.send(404);
        }
    });
    
    
    app.get('/deletecommodity', function(req, res) {
        if(req.session.user["name"] == "admin"){
            res.render('deletecommodity');
        }
        else{
            res.redirect('/home');
        }
    });
    app.post('/deletecommodity', function (req, res) {
        if(req.session.user["name"] == "admin"){
            var Commodity = global.dbHelper.getModel('commodity');
            Commodity.remove({
                name: req.body.name,
            }, function (error, doc) {
                if (doc) {
                    res.send(200);
                }else{
                    res.send(404);
                }
            });
        }
        else{
            res.send(404);
        }
    });
}
