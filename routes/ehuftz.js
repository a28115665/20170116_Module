const {Builder, By, Key, WebDriver, error} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

const dbCommand = require('../until/dbCommand.js');
const dbCommandByTask = require('../until/dbCommandByTask.js');
const moment = require('moment');
const async = require('async');
const setting = require('../app.setting.json');
const logger = require('../until/log4js.js').logger('ehuftz');

const TIMEOUT = 30000;
 
class Ehuftz {

	constructor() {
		this.chromeOptions = new chrome.Options();
		this.chromeOptions.addArguments("--start-maximized");
		this.chromeOptions.addArguments("disable-infobars");
		this.chromeOptions.addArguments("headless");
		// this.chromeOptions.addArguments("--window-size=1920x1280");
		this.chromeOptions.addArguments("--detach");
		this.chromeOptions.addArguments("--disable-extensions");
	}

	async Start() {

		// 檢查是否要啟動
		if(!setting.EHUFTZ.active) return;

		await this.Do().then(_ => console.log('Ehuftz執行完畢，結束程式'), err => console.error('ERROR: ' + err));

	}

	async Do() {

        let recordset = await this.SelectUnfinishedMaster();

		let driver,
			seq,
			// 0233(0A4),0254(0G5)
			eid,
			mawbNo;

		try {
			driver = await new Builder()
			    .forBrowser("chrome")
			    .setChromeOptions(this.chromeOptions)
			    .build();
		    await driver.manage().setTimeouts( { implicit: TIMEOUT, pageLoad: TIMEOUT, script: TIMEOUT } )

	        let num = {
	        		success : 0,
	        		fail : 0
	        	};

	        for(let data of recordset){

				// 預備寫入資料
	        	let tasks = [],
	        		eid = null,
	        		mawbNo = data.OL_MASTER,
	        		bagno = data.IL_BAGNO;
        		seq = data.OL_SEQ

	        	if(!bagno){
	        		continue;
	        	}else{
	        		// let subStrBagno = bagno.substr(0, 3);
	        		// 給予袋號所需的帳號
	        		switch(bagno){
	        			case "0A4":
	        				eid = "0233";
	        				break;
	        			case "0G5":
	        				eid = "0254";
	        				break;
	        			default:
	        				continue;
	        				break;
	        		}
	        	}

	        	if(eid == null){
	        		continue;
	        	}

				await driver.get('http://ehu.ftz.com.tw/FTZEHU/MWBSTQUERY_01.do?mwb='+mawbNo+'&eid='+eid+'&ieType=I&_search=false&nd=1581056758710&rows=all&page=1&sidx=&sord=asc');

				//取得所有行數
				let pageSource = JSON.parse(await driver.findElement(By.xpath("/html/body")).getText());
				// console.log('遠雄快遞('+mawbNo+'-'+eid+') : ', pageSource.rows.length);

				if(pageSource.rows.length == 0){
					num.fail += 1;
					continue;
				}

		        tasks.push(dbCommandByTask.Connect);
		        tasks.push(dbCommandByTask.TransactionBegin);

				// 先刪除此單的所有貨態
				tasks.push(async.apply(dbCommandByTask.DeleteRequestWithTransaction, {
	                crudType : 'Delete',
					table : 49,
	                params : {
						EML_SEQ : seq,
						EML_ACCOUNT: eid
	                }
        		}));

				let keepValue = {},
					keepGroup = 0;

				let newPageSource = pageSource.rows.map(function(value, index, fullArray){
			       if(value.declNo && !value.declType && value.expBagNo && !value.hwb){
						keepValue = value;
						keepGroup = 1;
						return;
					}

					if(value.declNo && value.declType && value.expBagNo && value.hwb){
						keepValue = {};
						keepGroup = 0;
					}

					if(keepGroup && (keepValue.sortKey != value.sortKey)){
						// console.log(keepValue, value.sortKey);
						value.declNo = keepValue.declNo;
						value.expBagNo = keepValue.expBagNo;
						value.hwb = value.hwb.split(" ")[1];
						value.bagWeight = keepValue.bagWeight;
						value.bagFee = keepValue.bagFee;
					}

					// 把文字轉成系統代碼
					value["trueClearance"] = value.clearanceType == '未見貨' ? 'X' : value.clearanceType;
					value["bagnoClearance"] = value.clearanceType == '未見貨' ? 'X' : value.clearanceType;
					value["diffPieceNotC1"] = 0;
					value["diffPieceC1"] = 0;

					// 判斷貨態
					// 未進貨 : 如果沒有進倉時間
					if(!value.gciDate1){
						value["trueClearance"] = 'X';
						value["bagnoClearance"] = 'X';
						value["diffPieceNotC1"] = value.piece - value.gciPiece;
					}else{
						// 清出 : 如果有出倉時間 和 放行時間 和 申報件數等於進倉件數
						if(value.gcoDate1 && value.releaseTime && (value.piece == value.gciPiece)){
							value["trueClearance"] = 'C1';
							value["bagnoClearance"] = 'C1';
							value["diffPieceC1"] = value.piece;
						}
						// 非清出
						else{
							value["trueClearance"] = 'C3';
							value["bagnoClearance"] = 'C3';
							// 如果有出倉時間(G1或併X3)
							if(value.gcoDate1){
								value["diffPieceNotC1"] = value.piece - value.gciPiece;
								value["diffPieceC1"] = value.gciPiece;
							}else{
								value["diffPieceNotC1"] = value.piece;
							}
						}
					}

					return value;
			    }).filter(x => x !== undefined);

				// 篩選狀態為C3的袋號
				let c3Bagno = newPageSource.filter(x => x.bagnoClearance === 'C3').map((value, index, fullArray) => { return value.expBagNo });

				newPageSource.forEach(function(value, index, fullArray){

					if(c3Bagno.indexOf(value.expBagNo) != -1){
						value.bagnoClearance = 'C3';
					}

					tasks.push(async.apply(dbCommandByTask.InsertRequestWithTransaction, {
		                crudType : 'Insert',
						table : 49,
		                params : {
							EML_SEQ            : seq,
							EML_SORT_KEY       : value.sortKey,
		                	EML_DECL_NO        : value.declNo,
							EML_DECL_TYPE      : value.declType,
							EML_EXP_BAGNO      : value.expBagNo,
							EML_HWB            : value.hwb,
							EML_CLEARANCE_TYPE : value.clearanceType,
							EML_PIECE          : value.piece,
							EML_GCI_PIECE      : value.gciPiece,
							EML_GCO_PIECE      : value.gcopiece,
							EML_WEIGHT         : value.weight,
							EML_GCI_WEIGHT     : value.gciWeight,
							EML_BAG_WEIGHT     : value.bagWeight,
							EML_BAG_FEE        : value.bagFee,
							EML_FLIGHT_NO      : value.flightNo,
							EML_FLIGHT_DATE    : moment(value.flightDate, "YYYY/MM/DD").isValid() ? moment(value.flightDate, "YYYY/MM/DD").format('YYYY-MM-DD') : null,
							EML_GCI_DATE1      : moment(value.gciDate1, "YYYY/MM/DD").isValid() ? moment(value.gciDate1, "YYYY/MM/DD").format('YYYY-MM-DD') : null,
							EML_GCO_DATE1      : moment(value.gcoDate1, "YYYY/MM/DD").isValid() ? moment(value.gcoDate1, "YYYY/MM/DD").format('YYYY-MM-DD') : null,
							EML_RELEASE_TIME   : moment(value.releaseTime, "YYYY/MM/DD HH:mm:ss.SS").isValid() ? moment(value.releaseTime, "YYYY/MM/DD HH:mm:ss.SS").format('YYYY-MM-DD HH:mm:ss.SSS') : null,
							EML_ACCOUNT        : eid,
							EML_UP_DATETIME    : moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS'),
							EML_BAGNO_CLEARANCE : value.bagnoClearance,
							EML_TRUE_CLEARANCE : value.trueClearance,
							EML_DIFF_PIECE_NOTC1 : value.diffPieceNotC1,
							EML_DIFF_PIECE_C1    : value.diffPieceC1
		                }
            		}));
				})

	    		tasks.push(dbCommandByTask.TransactionCommit);

	    		let isSuccess = await this.AsyncWaterfall(seq, tasks);

	    		if(isSuccess){
					num.success += 1;
				}else{
					num.fail += 1;
				}

	        }

	        logger.info("遠雄快遞更新成功筆數:", num.success, ", 查無資料筆數:", num.fail);

		    // async.waterfall(tasks, function (err, args) {

		    //     if (err) {
		    //         // 如果連線失敗就不做Rollback
		    //         if(Object.keys(args).length !== 0){
		    //             dbCommandByTask.TransactionRollback(args, function (err, result){
		                    
		    //             });
		    //         }

	     //    		logger.error(args);
		    //         console.error("遠雄快遞更新失敗訊息:", err);
		    //         // process.exit();
		    //     }else{
    		// 		console.log("遠雄快遞更新成功筆數:", num.success, ", 查無資料筆數:", num.fail);
		    //     }
		    // });

			// await sleep(2000);
		} catch(e) {
    		logger.error("遠雄快遞錯誤訊息("+seq+"):", e);
		} finally {
			// await driver && driver.quit();
			if(driver){
				await driver.close();
			}
		}

		// // 每隔一段時間之後就撈一次
		// setTimeout(async () => {
		// 	await this.Do().then(_ => console.log('Ehuftz執行完畢，結束程式'), err => console.error('ERROR: ' + err));
		// }, setting.EHUFTZ.timer);
	}

	SelectUnfinishedMaster() {

		let querymain = "ehuftz",
            queryname = "SelectUnfinishedMaster",
            params = {};
		return new Promise((resolve, reject) => {
			dbCommand.SelectMethod(querymain, queryname, params, function(err, recordset, sql) {

				if (err) {
	        		logger.error(err);
			        reject(err);
	            } else {
	        		resolve(recordset);
	            }

			})
		})

	}

	async AsyncWaterfall(pk, tasks) {

		return new Promise((resolve, reject) => {
			async.waterfall(tasks, function (err, args) {

		        if (err) {
		            // 如果連線失敗就不做Rollback
		            if(Object.keys(args).length !== 0){
		                dbCommandByTask.TransactionRollback(args, function (err, result){
		                    
		                });
		            }

	        		logger.error("遠雄快遞更新失敗訊息("+pk+"):", args, " 錯誤訊息:", err);
			        reject(false);
		        }else{
		        	resolve(true);
		        }

		    });
		})

	}

	async IsElementPresent(driver, by) {
	    await driver.manage().setTimeouts( { implicit: 0 } )

		return await driver.findElement(by).then(function(webElement) {
		    return true;//it was found
		}, function(err) {
		    if (err instanceof error.NoSuchElementError) {
		        return false;//element did not exist
		    } else {
		        WebDriver.promise.rejected(err);//some other error...
		    }
		});
	}

}

module.exports.Ehuftz = Ehuftz;