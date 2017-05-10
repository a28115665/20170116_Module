var express = require('express');
var router = express.Router();
var dbcommand = require('../until/dbCommand.js');
var setting = require('../app.setting.json');
var http = require('http');
var querystring = require('querystring');

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

    try{        
        // console.log(res.statusCode, req.query);

        // Build the post string from an object
        var post_data = querystring.stringify([
            JSON.stringify({
                crudType : 'Select',
                querymain : 'login',
                queryname : 'SelectAllUserInfo',
                params : {
                    U_ID : req.query.U_ID,
                    U_PW : req.query.U_PW
                }
            }),
            JSON.stringify({
                crudType : 'Select',
                querymain : 'login',
                queryname : 'SelectUserDept',
                params : {
                    UD_ID : req.query.U_ID
                }
            })
        ]);

        // An object of options to indicate where to post to
        var post_options = {
            host: '127.0.0.1',
            port: setting.NodeJs.port,
            path: '/restful/crudByTask?'+post_data,
            method: 'GET'
        };

        // Set up the request
        var post_req = http.request(post_options, function (post_res) {

            // console.log("statusCode: ", post_res.statusCode);
            //console.log("headers: ", post_res.headers);
            
            if(post_res.statusCode == 200){
                var content = '';

                post_res.setEncoding('utf8');

                post_res.on('data', function(chunk) {
                    content += chunk;
                });

                post_res.on('end', function() {
                    var _content = JSON.parse(content);
                    // console.log(_content.returnData[0]);
                    // console.log(_content.returnData[1]);

                    if(_content.returnData[0].length > 0){
                        // 塞入部門資訊
                        _content.returnData[0][0]["DEPTS"] = _content.returnData[1];

                        // 資料塞入Session
                        req.session.key = _content.returnData[0][0]

                        req.session.save(function(err) {
                            // session saved
                            if(err) console.log(err);
                        });

                    }

                    // res.redirect('/#/dashboard');
                    res.json({
                        "returnData": _content.returnData[0]
                    });
                });
            }else{
                res.status(500).send('登入失敗');
            }
        });

        post_req.end(); 

    } catch(err) {
        console.log(err);
        res.status(500).send('登入失敗');
    }
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