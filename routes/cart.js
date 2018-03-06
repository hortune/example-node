module.exports = function ( app ) {
    //查看购物车商品
    app.get('/cart', function(req, res) {
        var Cart = global.dbHelper.getModel('cart');
        if(!req.session.user){
            req.session.error = "用戶已過期，請重新登錄:"
            res.redirect('/login');
        }else{
            Cart.find({"uId":req.session.user._id,"cStatus":false}, function (error, docs) {
                res.render('cart',{carts:docs});
            });
        }
    });
    //添加购物车商品
    app.get("/addToCart/:id", function(req, res) {
       //req.params.id 获取商品ID号
        if(!req.session.user){
            req.session.error = "用戶已過期，請重新登錄:"
            res.redirect('/login');
        }else{
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart');
            Cart.findOne({"uId":req.session.user._id, "cId":req.params.id},function(error,doc){
                //商品已存在 +1
                if(doc){
                    Cart.update({"uId":req.session.user._id, "cId":req.params.id},{$set : { cQuantity : doc.cQuantity + 1 , cStatus : false}},function(error,doc){
                        //成功返回1  失败返回0
                        //if(doc > 0){
                        //    res.redirect('/home');
                        //}
                        res.redirect('/home');
                    });
                //商品未存在，添加
                }else{
                    Commodity.findOne({"_id": req.params.id}, function (error, doc) {
                        if (doc) {
                            Cart.create({
                                uId: req.session.user._id,
                                cId: req.params.id,
                                cName: doc.name,
                                cScore: doc.score,
                                cImgSrc: doc.imgSrc,
                                cQuantity : 1
                            },function(error,doc){
                                if(doc){
                                    res.redirect('/home');
                                }
                            });
                        } else {
                            res.redirect('/home');
                        }
                    });
                }
            });
        }
    });

    //删除购物车商品
    app.get("/delFromCart/:id", function(req, res) {
        //req.params.id 获取商品ID号
        var Cart = global.dbHelper.getModel('cart');
        Cart.remove({"_id":req.params.id},function(error,doc){
            //成功返回1  失败返回0
            if(doc > 0){
                res.redirect('/cart');
            }
        });
    });

    //购物车结算
    app.post("/cart/clearing",function(req,res){
        var Cart = global.dbHelper.getModel('cart');
        var Commodity = global.dbHelper.getModel('commodity');
        var User = global.dbHelper.getModel('user');
        // 邏輯錯誤
        // 有可能沒買成功@@
        // QQQQQQ
        Cart.update({"_id":req.body.cid},
            {$set : 
                { 
                    //cQuantity : req.body.cnum,
                    cStatus : true 
                }
            },
            function(error,doc){
                if(doc["ok"] > 0){
                    Cart.find({"_id":req.body.cid},
                        function(error,doc){
                            var cId = doc[0]["cId"];
                            var uId = doc[0]["uId"];
                            Commodity.update({"_id":cId, "cStatus" : false},
                                {$set :
                                    {
                                        cStatus : true
                                    }
                                }
                                ,function(error,doc){
                                    console.log(doc);
                                    if (doc['n']){
                                        console.log(doc['n']);
                                        Commodity.find({"_id":cId},function(err,doc){
                                            var name = doc[0]["name"];
                                            if(doc[0]["amount"] > 0){
                                                Commodity.update({"_id": doc[0]["_id"]},
                                                    {$inc : 
                                                        {
                                                            amount : -1,
                                                        },
                                                     $set :
                                                        {
                                                            cStatus : false
                                                        }
                                                    },function(error,doc){
                                                        //TODO Add to user list
                                                        console.log(uId);
                                                        console.log(name);
                                                        User.update({"_id":uId},
                                                            {$push:
                                                                {
                                                                    buyedItems : name
                                                                }
                                                            },function(error,doc){}) 
                                                        })
                                                res.send(200);
                                            }
                                            else{
                                                Commodity.update({"_id": req.body.cid},
                                                    {$set :
                                                        {
                                                            cStatus : false
                                                        }
                                                    },function(std,err){res.send(409)})
                                            }
                                        })
                                    }
                                    else{
                                        res.send(409);
                                    }
                                })
                            
                            })
                }
                else{
                    console.log("Failed");
                }
            });
    });
}

