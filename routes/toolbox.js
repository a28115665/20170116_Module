var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var dbCommand = require('../until/dbCommand.js');
var tmpXlsObj = require('../until/tmpXlsObj.js');
var archiver = require('archiver');
const querystring = require('querystring');

var dateFormat = require('dateformat');

const path = require('path');
const fs = require('fs');
var fsExtra = require('fs-extra');
var busboy = require('connect-busboy');

/**
 * ChangeTest 改單測試
 */
router.get('/changeTest', function(req, res) {

    try{
        // request({
        //     url: "http://10.1.21.22/EWSWS/WebServiceImport.asmx",
        //     json: true,
        //     body:  {     
        //         "UserId": "Admin",     
        //         "UserPW": "Admin#1",  
        //         "Nature": "電熱毯,服飾"  
        //     }
        // }, function (error, response, body) {
        //     if (!error && response.statusCode === 200) {
        //         // body['SendDateFromServer'] = new Date();
        //         console.log(response, body);
        //         // socket.emit('plan arrival by server', body); 
        //     }
        // })
        
        // Build the post string from an object
        var post_data = querystring.stringify({
            'strJson' : '[{"UserId": "Admin","UserPW": "Admin#1","Nature": "電熱毯,服飾"}]'
        });

        // An object of options to indicate where to post to
        var post_options = {
          host: '10.1.21.20',
          port: '3000',
          path: '/restful/crud',
          method: 'POST',
          headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
          }
        };

        // Set up the request
        var http = require('http');
        var post_req = http.request(post_options, function(_res) {
            console.log("statusCode: ", _res.statusCode);
            //console.log("headers: ", _res.headers);
            var msg = '';

            _res.setEncoding('utf8');
            _res.on('data', function(chunk) {
                msg += chunk;
            });
            _res.on('end', function() {
                console.log(msg);
                // res.json({
                //     BODY: msg
                // });
                res.end(msg);
            });
        });
        console.log(post_data);
        // post the data
        post_req.write(post_data);
        post_req.end();

    } catch(err) {
        console.log(err);
        res.status(500).send('改單失敗');
    }

});

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

/**
 * Upload 檔案上傳
 */
router.post('/uploadFile', function(req, res) {

    try{
        req.pipe(req.busboy);
        req.busboy.on('file', function(fieldname, file, filename) {
            var _filepath =  '\\upload\\file\\' + req.query["filePath"],
                _dir = path.dirname(module.parent.filename) + _filepath;

            mkdirp(_dir, function(err) { 
                // path exists unless there was an error
                if(err) return;

                var _filename = filename;
                if(req.query["rFilename"]){
                    _filename = req.query["rFilename"];
                }
                var stream = fsExtra.createWriteStream(_dir + _filename);
                file.pipe(stream);
                var _filesize = file._readableState.length;
                stream.on('close', function() {
                    // console.log('File ' + filename + ' is uploaded');
                    res.json({
                        oFilename: filename,
                        rFilename: _filename,
                        Filepath: _dir,
                        Filesize: _filesize
                    });
                });
            });
        });
    } catch(err) {
        res.status(500).send('上傳失敗');
    }

});

/**
 * Download files and zip 壓縮並下載
 */
router.get('/downloadFiles', function(req, res) {

    try{
        var archive = archiver('zip');

        // 發生錯誤時
        archive.on('error', function(err) {
            throw err;
        });

        var _params = JSON.parse(req.query["params"]);
        // 塞入檔案
        for(var i in _params){

            var _param = null;
            // 判斷是不是json
            try {
                _param = JSON.parse(_params[i]);
            } catch (e) {
                _param = _params[i];
            }
            
            archive.append(fs.createReadStream(_param.Filepath + _param.rFilename), { name: _param.oFilename });
        }

        // finalize the archive
        archive.finalize();

        archive.pipe(res);
    } catch(err) {
        console.log(err);
        res.status(500).send('下載失敗');
    }

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