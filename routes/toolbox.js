var express = require('express');
var router = express.Router();
var dbcommand = require('../until/dbCommand.js');

/**
 * ExportExcelByVar 經由前端參數匯出Excel
 */
router.get('/exportExcelByVar', function(req, res) {

    // dbcommand.SelectMethod(req.query["queryname"], req.query["params"], function(err, recordset) {
    //     if (err) {
    //         console.log(err);
    //         // Do something with your error...
    //         res.status(500).send('查詢失敗');
    //     } else {
    //         res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    //         .status(200)
    //         .json({
    //             "returnData": recordset
    //         });
    //     }
    // })
    
    res.status(200).send('查詢成功');
});

module.exports = router;