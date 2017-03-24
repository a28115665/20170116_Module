var express = require('express');
var router = express.Router();
var dbCommand = require('../until/dbCommand.js');
var tmpXlsObj = require('../until/tmpXlsObj.js');

var dateFormat = require('dateformat');

const path = require('path');
const fs = require('fs');

/**
 * ExportExcelByVar 經由前端參數匯出Excel
 */
router.get('/exportExcelByVar', function(req, res) {

    var _params = typeof req.query["params"] == "string" ? JSON.parse(req.query["params"]) : req.query["params"]

    var testObj = {
        firstTitle: '人員檔案',
        secondTitle: '個人基本信息',
        thirdTitle: '工作基本信息',
        
        col: [
            {name: "登入名", value: _params["ID"]},
            {name: "部門", value: "門診部"},
            {name: "姓名", value: "王大明"},
            {name: "民族", value: "維吾爾族"},
            {name: "籍貫", value: "蒙古"},
            
        ],
        col2:[
            {name: "畢業學校", value: "清華大學"},
            {name: "職務", value: "主治醫生"},
            {name: "性別", value: "男"},
            {name: "生日", value: dateFormat(new Date('1980-08-09'),"yyyy-MM-dd")},
            {name: "文化程度", value: "博士後"}
        ],
        col3:[
            {name: "入伍時間", value: dateFormat(new Date('1980-08-09'),"yyyy-MM-dd")},
            {name: "現專業技術職務", value: "主治醫生"}                
        ],
        col4:[                    
            {name: "臨床/非臨床專業", value: "臨床"},
            {name: "參加工作時間", value: dateFormat(new Date('1988-07-01'),"yyyy-MM-dd")}                    
        ]
    };

    var testStr = JSON.stringify(testObj);

    tmpXlsObj.GetXls({
        JsonXlsStr : testStr,
        TmpXlsFilePath : path.join(path.dirname(module.parent.filename), 'templates', 'aa.xlsx'), //template xls 路徑(含檔名)
        // OutputXlsPath : path.join(path.dirname(module.parent.filename), 'templates', 'test2.xlsx'),
        SheetNumber : 1
    }, function (err, result){
        if (err) {
            console.log(err);
            // Do something with your error...
            res.status(500).send("匯出失敗");
        } else {
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Length', result.length);
            res.setHeader('Expires', '0');
            // res.setHeader('Content-Disposition', 'attachment; filename=test.xls');
            res.setHeader('Content-Encoding', 'UTF-8');
            res.status(200);

            var buffer = new Buffer(result, "binary");

            res.end(toArrayBuffer(buffer));
        }
    });
});

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

module.exports = router;