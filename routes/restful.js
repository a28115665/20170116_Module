var express = require('express');
var router = express.Router();
var dbCommand = require('../until/dbCommand.js');
var dbCommandByTask = require('../until/dbCommandByTask.js');
var async = require('async');

/**
 * Restful 查詢
 */
router.get('/crud', function(req, res) {
    
    dbCommand.SelectMethod(req.query["querymain"], req.query["queryname"], req.query["params"], function(err, recordset) {
        if (err) {
            console.log(err);
            // Do something with your error...
            res.status(500).send('查詢失敗');
        } else {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            .status(200)
            .json({
                "returnData": recordset
            });
        }
    })
    
    // connection.close();
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});

/**
 * Restful 新增
 */
router.post('/crud', function(req, res) {

    // console.log("POST: ", req.query);
    dbCommand.InsertMethod(req.query["insertname"], req.query["table"], req.query["params"], function(err, affected) {
        if (err) {
            console.log(err);
            // Do something with your error...
            res.status(500).send('新增失敗');
        } else {
            res.json({
                "returnData": affected
            });
        }
    })
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});

/**
 * Restful 更新
 */
router.put('/crud', function(req, res) {

    // console.log("PUT: ", req.query);
    dbCommand.UpdateMethod(req.query["updatename"], req.query["table"], req.query["params"], req.query["condition"], function(err, affected) {
        if (err) {
            console.log(err);
            // Do something with your error...
            res.status(500).send('更新失敗');
        } else {
            res.json({
                "returnData": affected
            });
        }
    })
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});

/**
 * Restful 刪除
 */
router.delete('/crud', function(req, res) {

    // console.log("DELETE: ", req.query);
    dbCommand.DeleteMethod(req.query["deletename"], req.query["table"], req.query["params"], function(err, affected) {
        if (err) {
            console.log(err);
            // Do something with your error...
            res.status(500).send('刪除失敗');
        } else {
            res.json({
                "returnData": affected
            });
        }
    })
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});


/**
 * Restful By Task 查詢
 * 參考 http://qiita.com/mima_ita/items/dc867fa4f316d85533b1
 */
router.get('/crudByTask', function(req, res) {
    
    // console.log(req.query);

    var tasks = [];
    tasks.push(dbCommandByTask.Connect);
    tasks.push(dbCommandByTask.TransactionBegin);

    for(var i in req.query){
        var _task = JSON.parse(req.query[i]);
        switch(_task.crudType){
            case "Select":
                tasks.push(async.apply(dbCommandByTask.SelectRequestWithTransaction, _task));
                break;
            case "Insert":
                tasks.push(async.apply(dbCommandByTask.InsertRequestWithTransaction, _task));
                break;
            case "Update":
                tasks.push(async.apply(dbCommandByTask.UpdateRequestWithTransaction, _task));
                break;
            case "Delete":
                tasks.push(async.apply(dbCommandByTask.DeleteRequestWithTransaction, _task));
                break;
            default:
                break;
        }
    }

    tasks.push(dbCommandByTask.TransactionCommit);
    tasks.push(dbCommandByTask.DisConnect);

    async.waterfall(tasks, function (err, args) {
        if (err) {
            dbCommandByTask.TransactionRollback(args, function (err, result){
                
            });
            // res.json({
            //     err : err
            // });

            res.status(500).send('任務失敗');
            // process.exit();
        }else{
            // console.log("args:", args);
            res.json({
                "returnData": args.result
            });
        }
    });

});

module.exports = router;
