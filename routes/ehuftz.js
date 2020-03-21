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
			// 0233(0A4),0254(0G5)
			eid,
			mawbNo;

		try {
			driver = await new Builder()
			    .forBrowser("chrome")
			    .setChromeOptions(this.chromeOptions)
			    .build();
		    await driver.manage().setTimeouts( { implicit: TIMEOUT, pageLoad: TIMEOUT, script: TIMEOUT } )

			// 預備寫入資料
	        let tasks = [],
	        	num = {
	        		success : 0,
	        		fail : 0
	        	};
	        tasks.push(dbCommandByTask.Connect);
	        tasks.push(dbCommandByTask.TransactionBegin);

	        for(let data of recordset){

	        	let eid = null,
	        		seq = data.OL_SEQ,
	        		mawbNo = data.OL_MASTER,
	        		bagno = data.IL_BAGNO;

	        	if(!bagno){
	        		continue;
	        	}else{
	        		let subStrBagno = bagno.substr(0, 3);
	        		// 給予袋號所需的帳號
	        		switch(subStrBagno){
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
				num.success += 1;

				let keepValue = {},
					keepGroup = 0;
				pageSource.rows.forEach(function(value, index, fullArray){

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
					// else{
					// 	console.log('=>', keepValue, value.sortKey);
					// }

					value.clearanceType = value.clearanceType == '未見貨' ? 'X' : value.clearanceType

					tasks.push(async.apply(dbCommandByTask.UpsertRequestWithTransaction, {
		                crudType : 'Upsert',
						table : 49,
		                params : {
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
							EML_UP_DATETIME    : moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')
		                },
						condition : {
							EML_SEQ : seq,
							EML_SORT_KEY  : value.sortKey
						}
            		}));
				})

	        }

			tasks.push(dbCommandByTask.TransactionCommit);

		    async.waterfall(tasks, function (err, args) {

		        if (err) {
		            // 如果連線失敗就不做Rollback
		            if(Object.keys(args).length !== 0){
		                dbCommandByTask.TransactionRollback(args, function (err, result){
		                    
		                });
		            }

		            console.error("遠雄快遞更新失敗訊息:", err);
		            // process.exit();
		        }else{
    				console.log("遠雄快遞更新成功筆數:", num.success, ", 查無資料筆數:", num.fail);
		        }
		    });

			// await sleep(2000);
		} finally {
			// await driver && driver.quit();
			await driver.close();
		}

		// 每隔一段時間之後就撈一次
		setTimeout(async () => {
			await this.Do().then(_ => console.log('Ehuftz執行完畢，結束程式'), err => console.error('ERROR: ' + err));
		}, setting.APACCS.timer);
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