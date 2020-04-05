const {Builder, By, Key, WebDriver, error} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

const dbCommand = require('../until/dbCommand.js');
const dbCommandByTask = require('../until/dbCommandByTask.js');
const moment = require('moment');
const async = require('async');
const setting = require('../app.setting.json');
const logger = require('../until/log4js.js').logger('apaccs');

const TIMEOUT = 30000;
 
class Apaccs {

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
		if(!setting.APACCS.active) return;

		await this.Do().then(_ => console.log('Apaccs執行完畢，結束程式'), err => console.error('ERROR: ' + err));

	}

	async Do() {

        let recordset = await this.SelectUnfinishedMaster();
    	// console.log(recordset);

        let driver;
		try {
		 	driver = await new Builder()
			    .forBrowser("chrome")
			    .setChromeOptions(this.chromeOptions)
			    .build();
		    await driver.manage().setTimeouts( { implicit: TIMEOUT, pageLoad: TIMEOUT, script: TIMEOUT } )
			await driver.get('https://accs.tradevan.com.tw/accsw-bin/APACCS/userLoginAction.do?userid=GUEST&password=GUEST');

			// 預備寫入資料
	        let tasks = [],
	        	num = {
	        		success : 0,
	        		fail : 0
	        	};
	        tasks.push(dbCommandByTask.Connect);
	        tasks.push(dbCommandByTask.TransactionBegin);

	        for(let data of recordset){
	        	// console.log(data);
	        	let seq = data.OL_SEQ,
	        		mawbNo = data.OL_MASTER;
				await driver.get('https://accs.tradevan.com.tw/accsw-bin/APACCS/cImMergeQueryAction.do?mawb_no='+mawbNo+'&voyage_flight_no=&flight_date=&est_arrival_date=&%E6%9F%A5%E8%A9%A2=%E6%9F%A5%E8%A9%A2');
				
				if(!await this.IsElementPresent(driver, By.xpath("/html/body/table[1]/tbody/tr/td/table[3]/tbody/tr"))){
					// console.log("查無資料("+mawbNo+")");
					num.fail += 1;
					continue;
				}
				num.success += 1;

				// 先刪除此單的所有ACCS
				tasks.push(async.apply(dbCommandByTask.DeleteRequestWithTransaction, {
	                crudType : 'Delete',
					table : 48,
	                params : {
						AML_SEQ : seq
	                }
        		}));

				//取得所有行數
				let elementList = await driver.findElements(By.xpath("/html/body/table[1]/tbody/tr/td/table[3]/tbody/tr"));
				// console.log('空運業界自動化服務系統('+mawbNo+') : ', (elementList.length-1));

				for(let [index, webElement] of elementList.entries()) {
					// 表頭跳過
					if(index==0) continue;

					let no = await webElement.findElement(By.xpath("td[1]")).getText();
					let mm = await webElement.findElement(By.xpath("td[2]")).getText();
					let td2Title = await webElement.findElement(By.xpath("td[2]/img")).getAttribute("title"),
						td2TitleArray = td2Title.split("；"),
						flightNo   = td2TitleArray[0].split("：")[1],
						importDate = td2TitleArray[1].split("：")[1],
						departDate = td2TitleArray[2].split("：")[1];
						// console.log(no, mm, flightNo, importDate, departDate);
					let totalNum = await webElement.findElement(By.xpath("td[3]")).getText();
					let deliveryNum = await webElement.findElement(By.xpath("td[4]")).getText();
					let cumulativeNum = await webElement.findElement(By.xpath("td[5]")).getText();
					let deliveryMask = await webElement.findElement(By.xpath("td[6]")).getText();
					let tranCust = await webElement.findElement(By.xpath("td[7]")).getText();
					let mfNotMatch = await webElement.findElement(By.xpath("td[8]")).getText();
					let fMask = await webElement.findElement(By.xpath("td[9]")).getText();
					let itemCode = await webElement.findElement(By.xpath("td[10]")).getText();
					let loadPlace = await webElement.findElement(By.xpath("td[11]")).getText();
					let downPlace = await webElement.findElement(By.xpath("td[12]")).getText();
					let desctination = await webElement.findElement(By.xpath("td[13]")).getText();
					let aml5108 = await webElement.findElement(By.xpath("td[14]")).getText();
					let fwbMask = await webElement.findElement(By.xpath("td[15]")).getText();

					if(no === "1."){
						// console.log(no, mm, flightNo, importDate, departDate);
				        tasks.push(async.apply(dbCommandByTask.UpdateRequestWithTransaction, {
			                crudType : 'Update',
							table : 18,
			                params : {
								OL_FLIGHTNO : flightNo,
								OL_IMPORTDT : moment(importDate, "YYYYMMDD").isValid() ? moment(importDate, "YYYYMMDD").format('YYYY-MM-DD') : null
			                },
		            		condition : {
		            			OL_SEQ : seq
		            		}
	            		}));
					}

					// console.log(no, mm, flightNo, importDate, departDate);
			        tasks.push(async.apply(dbCommandByTask.InsertRequestWithTransaction, {
		                crudType : 'Insert',
						table : 48,
		                params : {
							AML_SEQ : seq,
							AML_NO  : no,
		                	AML_TOTAL_NUM      : Number.parseInt(totalNum.replace(/\s/g,'')),
							AML_DELIVERY_NUM   : Number.parseInt(deliveryNum.replace(/\s/g,'')),
							AML_CUMULATIVE_NUM : Number.parseInt(cumulativeNum.replace(/\s/g,'')),
							AML_DELIVERY_MASK  : deliveryMask.replace(/\s/g,''),
							AML_TRAN_CUST      : tranCust.replace(/\s/g,''),
							AML_MF_NOT_MATCH   : mfNotMatch.replace(/\s/g,''),
							AML_FMASK          : fMask.replace(/\s/g,''),
							AML_ITEM_CODE      : itemCode.replace(/\s/g,''),
							AML_LOAD_PLACE     : loadPlace.replace(/\s/g,''),
							AML_DOWN_PLACE     : downPlace.replace(/\s/g,''),
							AML_DESCTINATION   : desctination.replace(/\s/g,''),
							AML_5108           : aml5108.replace(/\s/g,''),
							AML_FWB_MASK       : fwbMask.replace(/\s/g,''),
							AML_UP_DATETIME    : moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS'),
							AML_FLIGHTNO	   : flightNo,
							AML_IMPORTDT	   : moment(importDate, "YYYYMMDD").isValid() ? moment(importDate, "YYYYMMDD").format('YYYY-MM-DD') : null,
							AML_DEPARTDATE	   : moment(importDate, "YYYYMMDD").isValid() ? moment(departDate, "YYYYMMDD").format('YYYY-MM-DD') : null,
		                }
            		}));
				}
	        }

    		tasks.push(dbCommandByTask.TransactionCommit);

		    async.waterfall(tasks, function (err, args) {

		        if (err) {
		            // 如果連線失敗就不做Rollback
		            if(Object.keys(args).length !== 0){
		                dbCommandByTask.TransactionRollback(args, function (err, result){
		                    
		                });
		            }

		            console.error("空運業界自動化服務系統更新失敗訊息:", err);
		            // process.exit();
		        }else{
    				console.log("空運業界自動化服務系統更新成功筆數:", num.success, ", 查無資料筆數:", num.fail);
		        }
		    });
			
			// await sleep(2000);
		} finally {
			// await driver && driver.quit();
			await driver.close();
		}

		// 每隔一段時間之後就撈一次
		setTimeout(async () => {
			await this.Do().then(_ => console.log('Apaccs執行完畢，結束程式'), err => console.error('ERROR: ' + err));
		}, setting.APACCS.timer);

	}

	SelectUnfinishedMaster() {

		let querymain = "apaccs",
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

module.exports.Apaccs = Apaccs;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
