var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var dbCommand = require('../until/dbCommand.js');
var tmpXlsObj = require('../until/tmpXlsObj.js');
var setting = require('../app.setting.json');
var templates = require('../templates/templates.json');
var archiver = require('archiver');
var http = require('http');
const querystring = require('querystring');

var dateFormat = require('dateformat');

const path = require('path');
const fs = require('fs');
var fsExtra = require('fs-extra');
var busboy = require('connect-busboy');

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
 * ExportExcelBySql 經由Sql匯出Excel
 */
router.get('/exportExcelBySql', function(req, res) {

    // console.log(req.query);
    if(req.query["templates"] == undefined){
        res.status(post_res.statusCode).send('匯出失敗');
    }

    var post_data = querystring.stringify(req.query);
    
    var post_options = {
        host: '127.0.0.1',
        port: setting.NodeJs.port,
        path: '/restful/crud?' + post_data,
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
                // console.log(content);

                const _params = typeof req.query["params"] == "string" ? JSON.parse(req.query["params"]) : req.query["params"];

                _params["data"] = JSON.parse(content).returnData;

                // console.log(_params.data.length);

                tmpXlsObj.GetXls({
                    JsonXls : _params,
                    TmpXlsFilePath : path.join(path.dirname(module.parent.filename), 'templates', templates[req.query["templates"]]), //template xls 路徑(含檔名)
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
        }else{
            res.status(post_res.statusCode).send('匯出失敗');
        }
    });

    post_req.on('error', function(err) {
        // Handle error
        res.status(500).send('匯出失敗');
    });

    post_req.end(); 
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

/**
 * ChangeNature 改單
 */
router.get('/changeNature', function(req, res) {

    try{        
        // console.log(res.statusCode, req.query);

        // Build the post string from an object
        var post_data = querystring.stringify({
            'strJson' : JSON.stringify([
                {
                    "UserId": req.query.ID,
                    "UserPW": req.query.PW,
                    "Nature": req.query.NATURE
                }
            ])
        });

        // An object of options to indicate where to post to
        var post_options = {
            host: setting.WebService.changeNature.host,
            port: setting.WebService.changeNature.port,
            path: setting.WebService.changeNature.url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
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
                    // console.log(content);

                    res.json({
                        "returnData": content
                    });
                });
            }else{
                res.status(post_res.statusCode).send('改單失敗');
            }
        });

        // console.log(post_data);
        // post the data
        post_req.write(post_data);

        post_req.on('error', function(err) {
            // Handle error
            res.status(500).send('改單失敗');
        });

        post_req.end(); 

    } catch(err) {
        res.status(500).send('改單失敗');
    }

});

/*
 * 組成menu
 * 當有U_ID時會產生該ID的menu，如果沒有就產生所有menu
 */
router.get('/composeMenu', function(req, res) {
    
    try{
        var conditions = [
            JSON.stringify({
                crudType : 'Select',
                querymain : 'composeMenu',
                queryname : 'SelectMaxLvl'
            }),
            JSON.stringify({
                crudType : 'Select',
                querymain : 'composeMenu',
                queryname : 'SelectSubsys'
            }),
            JSON.stringify({
                crudType : 'Select',
                querymain : 'composeMenu',
                queryname : 'SelectProgm'
            })
        ];

        if(req.query["U_ID"] != undefined){
            conditions.push(JSON.stringify({
                crudType : 'Select',
                querymain : 'composeMenu',
                queryname : 'GetUserRight',
                params : {
                    U_ID : req.query["U_ID"]
                }
            }));
        }

        var post_data = querystring.stringify(conditions);
        
        var post_options = {
            host: '127.0.0.1',
            port: setting.NodeJs.port,
            path: '/restful/crudByTask?' + post_data,
            method: 'GET',
            
        };

        var post_req = http.request(post_options, function (post_res){
            if(post_res.statusCode == 200){
                var content = '';

                post_res.setEncoding('utf8');

                post_res.on('data', function (chunk){
                    content += chunk;
                });

                post_res.on('end', function(){
                    var sqlData = JSON.parse(content)["returnData"];
                    var maxLvlObj = sqlData[0];
                    var subsysObj = sqlData[1];
                    var progmObj = sqlData[2];
                    var gRight = req.query["U_ID"] != undefined ? sqlData[3] : null;

                    var finalObj;

                    if(maxLvlObj != undefined){
                        //取得menu目前最深的階層
                        var iMaxLvl = parseInt(maxLvlObj[0].MAXLVL);
                        //有幾個子系統
                        var sysCount = subsysObj.length;
                        var progmCount = progmObj.length;

                        //程式與系統物件
                        var progItem = { items:[] };
                        var sysItem = { items:[] };
                        var tempItem ;
                        //權限
                        var gRightItem = {};

                        //權限轉換物件
                        for(var igRight in gRight){
                            gRightItem[gRight[igRight].PROG_PATH] = (gRight[igRight].USER_RIGHT == 'true');
                        }

                        //是否有包含權限功能    
                        if(req.query["U_ID"] != undefined){
                            var tempProgmObj = [];
                            for(var iProgmObj in progmObj){
                                // 如果有就新增到temp
                                if(gRightItem[progmObj[iProgmObj].PROG_PATH]){
                                    tempProgmObj.push(progmObj[iProgmObj]);
                                }
                            }
                            progmObj = tempProgmObj
                            progmCount = progmObj.length;
                        }
                        
                        //1.取得程式Array
                        for(var iProgm = 0 ; iProgm < progmCount; iProgm++){
                            tempItem = {};
                            tempItem = {
                                            "title": progmObj[iProgm].SP_PNAME,
                                            "sref": progmObj[iProgm].PROG_PATH.toLowerCase(),
                                            "icon": progmObj[iProgm].SP_ICON,
                                            "lvl": progmObj[iProgm].SP_LVL,
                                            "exsysId": progmObj[iProgm].SS_SYSID,
                                            "sort": progmObj[iProgm].SP_SEQ //將順序納入判斷
                                        };
                            progItem.items.push(tempItem);
                        }
                        
                        //2.取得系統Array(資料夾的概念)
                        var tmpExSubsys = '';
                        for(var iSys = 0 ; iSys < sysCount; iSys++){
                            //找出上一層的子系統
                            tmpExSubsys = '';
                            var lvl = parseInt(subsysObj[iSys].SS_LVL);
                            var tmpSplitObj = subsysObj[iSys].SS_PATH.split('.');
                            //若split後的長度與lvl相等，且長度大於1，取得前一層的子系統
                            if(tmpSplitObj.length == lvl && tmpSplitObj.length > 1){
                                tmpExSubsys = tmpSplitObj[lvl-2];
                            }

                            tempItem = {};
                            tempItem = {
                                            "title": subsysObj[iSys].SS_NAME,
                                            "href": "#",
                                            "icon": subsysObj[iSys].SS_ICON,
                                            "lvl": subsysObj[iSys].SS_LVL,
                                            "sysId": subsysObj[iSys].SS_SYSID,
                                            "exsysId": tmpExSubsys,
                                            "sort": subsysObj[iSys].SS_SEQ, //將順序納入判斷
                                            "items":[]
                                        };
                            sysItem.items.push(tempItem);
                        }

                        //3.將程式塞入對應的子系統(資料夾)
                        var outputObj;
                        //最大層級往回推(含最深之子層級或程式)
                        for(var iLvl = iMaxLvl + 1 ; iLvl >= 1 ; iLvl--){
                            for(var iProg = 0; iProg < progmCount ; iProg++){
                                for(var iSys = 0 ; iSys < sysCount; iSys++){
                                    //找出最小的lvl 往上加，找出該層的prog
                                    if(progItem.items[iProg].lvl == iLvl){
                                        //若lvl-1等於前一子系統之lvl，且程式附屬的系統ID=系統ID，則將程式加入該系統
                                        if((progItem.items[iProg].lvl - 1) == sysItem.items[iSys].lvl && 
                                            progItem.items[iProg].exsysId == sysItem.items[iSys].sysId){
                                                var tmpObj = {
                                                        "title": progItem.items[iProg].title,
                                                        "sref": progItem.items[iProg].sref,
                                                        "icon": progItem.items[iProg].icon,
                                                        "sysId": progItem.items[iProg].exsysId                                                          
                                                    };
                                                sysItem.items[iSys].items.push(tmpObj);
                                            }
                                    }//if end
                                }//for iSys end
                            }//for iProg end
                        }

                        //4.將子系統塞入對應之item下，從最小的開始往上塞
                        for(var iLvl = iMaxLvl ; iLvl >= 1 ; iLvl--){
                            for(var iSys = 0 ; iSys < sysCount; iSys++){
                                for(var iSubsys = 0 ; iSubsys < sysCount; iSubsys++){
                                    //從最小的開始往上塞 和 此資料夾下要有資料
                                    if(sysItem.items[iSubsys].lvl == iLvl && sysItem.items[iSubsys].items.length > 0){
                                        if((sysItem.items[iSubsys].lvl - 1) == sysItem.items[iSys].lvl &&
                                            sysItem.items[iSubsys].exsysId == sysItem.items[iSys].sysId){
                                                var tmpObj = {
                                                        "title": sysItem.items[iSubsys].title,
                                                        "href": "#",
                                                        "icon": sysItem.items[iSubsys].icon,
                                                        "items": sysItem.items[iSubsys].items
                                                    };
                                                if(sysItem.items[iSubsys].sort > 0){
                                                    //因撈出的prog已經照順序放，只要照資料夾需擺放的位置插入陣列中即可。
                                                    sysItem.items[iSys].items.splice(sysItem.items[iSubsys].sort - 1,0,tmpObj);
                                                }
                                                else{
                                                    sysItem.items[iSys].items.splice(0,0,tmpObj);
                                                }
                                                
                                                //sysItem.items[iSys].items.push(tmpObj);
                                            }
                                    }

                                }//for iSubsys End
                            }//for iSys End
                        }//for lvl end

                        //5.最後output資料
                        finalObj = { "items":sysItem.items[0].items};
                     }

                     // //6.output 至 menu-items.js
                     // var path = require("path");
                     // var menuPath = path.resolve(__dirname, '../public/api/menu-items.json');
                     // //寫檔
                     // var fs = require('fs');
                     // fs.writeFile(menuPath, JSON.stringify(finalObj), function(err) {
                     //    if(err) {
                     //        console.log(err);
                     //    } else {
                     //        console.log("The file was saved!");
                     //    }
                     // });

                    res.json(finalObj);
                });
            }else{
                res.status(post_res.statusCode).send('Compose Menu error');
            }
        });

        post_req.end();

    } catch(err){
        res.status(500).send('Compose Menu error');
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