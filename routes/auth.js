var express = require('express');
var router = express.Router();
var dbcommand = require('../until/dbCommand.js');

/**
 * 重新讀取Session
 */
router.get('/reLoadSession', function(req, res) {
    res.json(req.session.key);
});


// router.get('/login', function (req, res) {
//    // res.send('respond with a resource');

//      // console.log(req.body.email);
//      // console.log(req.body.password);

//      req.session.key = {
//        username : 'Alan',
//        password : 'ret12et3'
//      }
//      req.session.save(function(err){
//       // session saved
//       console.log(err);
//     });

//      res.redirect('/restful/reLoadSession');
//     // res.sendfile('./public/404.html');
// });

/**
 * 登入
 */
router.get('/login', function(req, res) {
    // console.log(req.body);
    // req.session.key = {
    //     username: req.body.email,
    //     password: req.body.password
    // }

    // req.session.save(function(err) {
    //     // session saved
    //     console.log(err);
    // });

    // res.redirect('/#/dashboard');

    // var query = {
    //     queryname: "SelectAllUserInfo",
    //     params: {
    //         U_ID: req.body.userid,
    //         U_PW: req.body.password
    //     }
    // }

    dbcommand.SelectMethod(req.query["querymain"], req.query["queryname"], req.query["params"], function(err, recordset) {
        if (err) {
            console.log(err);
            // Do something with your error...
            res.status(500).send('查詢失敗');
        } else {
            console.log(recordset);
            if(recordset.length > 0){
                req.session.key = recordset[0]

                req.session.save(function(err) {
                    // session saved
                    if(err) console.log(err);
                });

            }

            // res.redirect('/#/dashboard');
            res.json({
                "returnData": recordset
            });
        }
    })
});



/**
 * 登出
 */
router.get('/logout', function(req, res) {

    req.session.destroy(function(err) {
        // session saved
        console.log(err);
    });

    res.redirect('/#/login');
});

module.exports = router;