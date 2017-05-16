var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var dbCommand = require('../until/dbCommand.js');
var tmpXlsObj = require('../until/tmpXlsObj.js');

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
                stream.on('close', function() {
                    // console.log('File ' + filename + ' is uploaded');
                    res.json({
                        oFilename: filename,
                        rFilename: _filename,
                        Filepath: _dir
                    });
                });
            });
        });
    } catch(err) {
        res.status(500).send('上傳失敗');
    }

});

/*
 * 組成menu
 */
router.get('/ComposeMenuFile', function(req, res) {
    
    try{
        var http = require('http');
        var querystring = require('querystring');


        var post_data = querystring.stringify([
            JSON.stringify({
                crudType : 'Select',
                querymain : 'ComposeMenu',
                queryname : 'SelectMaxLvl'
            }),
            JSON.stringify({
                crudType : 'Select',
                querymain : 'ComposeMenu',
                queryname : 'SelectSubsys'
            }),
            JSON.stringify({
                crudType : 'Select',
                querymain : 'ComposeMenu',
                queryname : 'SelectProgm'
            })
        ]);
        

        var post_options = {
            host: '127.0.0.1',
            port: '3000',
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
                        
                        //1.取得程式Array
                        for(var iProgm = 0 ; iProgm < progmCount; iProgm++){
                            tempItem = {};
                            tempItem = {
                                            "title": progmObj[iProgm].SP_PNAME,
                                            "sref": progmObj[iProgm].PROG_PATH.toLowerCase(),
                                            "icon": progmObj[iProgm].SP_ICON,
                                            "lvl": progmObj[iProgm].SP_LVL,
                                            "exsysId": progmObj[iProgm].SS_SYSID
                                        };
                            
                            progItem.items.push(tempItem);
                        }
                        //2.取得系統Array
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
                                            "items":[]
                                        };
                            sysItem.items.push(tempItem);
                        }

                        //3.將程式塞入對應的子系統
                        var outputObj;
                        for(var iLvl = iMaxLvl + 1 ; iLvl >= 1 ; iLvl--){
                            for(var iProg = 0; iProg < progmCount ; iProg++){
                                for(var iSys = 0 ; iSys < sysCount; iSys++){
                                    //找出最小的lvl 往上加
                                    if(progItem.items[iProg].lvl == iLvl){
                                        //若lvl-1等於前一子系統之lvl，且程式附屬的系統ID=系統ID，則將程式加入該系統
                                        if((progItem.items[iProg].lvl - 1) == sysItem.items[iSys].lvl && 
                                            progItem.items[iProg].exsysId == sysItem.items[iSys].sysId){
                                                var tmpObj = {
                                                        "title": progItem.items[iProg].title,
                                                        "sref": progItem.items[iProg].sref,
                                                        "icon": progItem.items[iProg].icon                                                            
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
                                    //從最小的開始往上塞
                                    if(sysItem.items[iSubsys].lvl == iLvl){
                                        if((sysItem.items[iSubsys].lvl - 1) == sysItem.items[iSys].lvl &&
                                            sysItem.items[iSubsys].exsysId == sysItem.items[iSys].sysId){
                                                var tmpObj = {
                                                        "title": sysItem.items[iSubsys].title,
                                                        "href": "#",
                                                        "icon": sysItem.items[iSubsys].icon,
                                                        "items": sysItem.items[iSubsys].items
                                                    };
                                                sysItem.items[iSys].items.push(tmpObj);
                                            }
                                    }

                                }//for iSubsys End
                            }//for iSys End
                        }//for lvl end

                        //5.最後output資料
                        finalObj = { "items":sysItem.items[0].items};
                     }

                     //6.output 至 menu-items.js
                     var path = require("path");
                     var menuPath = path.resolve(__dirname, '../public/api/menu-items.json');
                     //寫檔
                     var fs = require('fs');
                     fs.writeFile(menuPath, JSON.stringify(finalObj), function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("The file was saved!");
                        }
                     });

                    res.json(finalObj);
                });
            }else{
                res.status(post_res.statusCode).send('error');
            }
        });

        post_req.end();

    } catch(err){
        res.status(500).send('err');
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