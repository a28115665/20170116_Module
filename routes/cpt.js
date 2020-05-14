const {Builder, By, Key, WebDriver, error} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

const dbCommand = require('../until/dbCommand.js');
const dbCommandByTask = require('../until/dbCommandByTask.js');
const moment = require('moment');
const async = require('async');
const until = require('../until/until.js');
const setting = require('../app.setting.json');
const logger = require('../until/log4js.js').logger('cpt');

const TIMEOUT = 30000;
 
class Cpt {

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
		if(!setting.CPT.active) {
			return;
		}
		else{
			// 延遲秒數，等待其它爬蟲結束
			// await until.sleep(setting.CPT.delay);
		}

		await this.Do().then(_ => console.log('Cpt執行完畢，結束程式'), err => console.error('ERROR: ' + err));

	}

	async Do() {

        let recordset = await this.SelectApaccsMaster();
    	// console.log(recordset);

        let driver;
		try {
		 	driver = await new Builder()
			    .forBrowser("chrome")
			    .setChromeOptions(this.chromeOptions)
			    .build();
		    await driver.manage().setTimeouts( { implicit: TIMEOUT, pageLoad: TIMEOUT, script: TIMEOUT } )
			// await driver.get('https://portal.sw.nat.gov.tw/APGQ/LoginFree?request_locale=zh_TW&breadCrumbs=JTdCJTIyYnJlYWRDcnVtYnMlMjIlM0ElNUIlN0IlMjJuYW1lJTIyJTNBJTIyJUU1JTg1JThEJUU4JUFEJTg5JUU2JTlGJUE1JUU4JUE5JUEyJUU2JTlDJThEJUU1JThCJTk5JTIyJTJDJTIydXJsJTIyJTNBJTIyJTIyJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMiVFOCU4OCVCOSVFNiVBOSU5RiVFNyU5NCVCMyVFNSVBMCVCMSVFOCVCMyU4NyVFNiU5NiU5OSUyMiUyQyUyMnVybCUyMiUzQSUyMmNoYW5nZU1lbnVVcmwyKCclRTglODglQjklRTYlQTklOUYlRTclOTQlQjMlRTUlQTAlQjElRTglQjMlODclRTYlOTYlOTknJTJDJ0FQR1FfMScpJTIyJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMihHQjM2MiklRTglODglQUElRTYlQTklOUYlRTclOEYlQUQlRTYlQUMlQTElRTYlOEElQjUlRTklODElOTQlRTYlOTklODIlRTklOTYlOTMlRTYlOUYlQTUlRTglQTklQTIlMjIlMkMlMjJ1cmwlMjIlM0ElMjJvcGVuTWVudSgnJTJGQVBHUSUyRkdCMzYyJyklMjIlN0QlMkMlN0IlN0QlMkMlN0IlN0QlNUQlMkMlMjJwYXRoVXJsJTIyJTNBJTIyJTIzTUVOVV9BUEdRJTJDJTIzTUVOVV9BUEdRXzElMkMlMkZBUEdRJTJGR0IzNjIlMjIlN0Q=');

	        let num = {
	        		success : 0,
	        		fail : 0
	        	};

	        for(let data of recordset){
	        	// console.log(data);
				// 預備寫入資料
	        	let tasks = [],
	        		flightNo = data.AML_FLIGHTNO,
	        		importDt = data.AML_IMPORTDT;
				
				if(flightNo == null || importDt == null){
	        		continue;
	        	}

	        	let flightNo1 = flightNo.split(' ')[0],
	        		flightNo2 = flightNo.split(' ')[1],
	        		schDateBegin = moment(importDt, "YYYY-MM-DD").format('YYYY%2FMM%2FDD'),
	        		schDateEnd = moment(importDt, "YYYY-MM-DD").format('YYYY%2FMM%2FDD');

				// console.log('https://portal.sw.nat.gov.tw/APGQ/GB362!query?rows=10&page=1&libraCopy=&gb362FormBean.CHOICE=A&gb362FormBean.FLIGHT_NO_1='+flightNo1+'&gb362FormBean.FLIGHT_NO_2='+flightNo2+'&gb362FormBean.SCH_DATE_BEGIN='+schDateBegin+'&gb362FormBean.SCH_DATE_END='+schDateEnd+'&choice=A&take=10&skip=0&pageSize=10');
	        	await driver.get('https://portal.sw.nat.gov.tw/APGQ/GB362!query?rows=10&page=1&libraCopy=&gb362FormBean.CHOICE=A&gb362FormBean.FLIGHT_NO_1='+flightNo1+'&gb362FormBean.FLIGHT_NO_2='+flightNo2+'&gb362FormBean.SCH_DATE_BEGIN='+schDateBegin+'&gb362FormBean.SCH_DATE_END='+schDateEnd+'&choice=A&take=10&skip=0&pageSize=10');

	        	//取得所有行數
				let pageSource = JSON.parse(await driver.findElement(By.xpath("/html/body")).getText());

				if(pageSource.gridModel.length == 0){
					// console.log("查無資料("+mawbNo+")");
					num.fail += 1;
					continue;
				}

		        tasks.push(dbCommandByTask.Connect);
		        tasks.push(dbCommandByTask.TransactionBegin);

				pageSource.gridModel.forEach(function(value, index, fullArray){
					// console.log(value);

					let _params = {};

					if(value.PREVIOUS_PORT){
						_params["AML_COUNTRY"] = value.PREVIOUS_PORT;
					}
					if(value.SCH_DATE_TIME){
						_params["AML_SCHEDL_ARRIVALTIME"] = moment(value.SCH_DATE_TIME, "YYYY/MM/DD HH:mm").format('YYYY-MM-DD HH:mm:ss');
					}
					if(value.ACT_DATE_TIME){
						_params["AML_ACTL_ARRIVALTIME"] =  moment(value.ACT_DATE_TIME, "YYYY/MM/DD HH:mm").format('YYYY-MM-DD HH:mm:ss');
					}

					tasks.push(async.apply(dbCommandByTask.UpdateRequestWithTransaction, {
		                crudType : 'Update',
						table : 48,
		                params : _params,
	            		condition : {
	            			AML_FLIGHTNO : flightNo,
							AML_IMPORTDT : moment(importDt, "YYYY-MM-DDTHH:mm:ss.SSSZ").format('YYYY-MM-DD')
	            		}
	        		}));
				})

	    		tasks.push(dbCommandByTask.TransactionCommit);

	    		let isSuccess = await this.AsyncWaterfall({
	    			AML_FLIGHTNO : flightNo,
					AML_IMPORTDT : moment(importDt, "YYYY-MM-DDTHH:mm:ss.SSSZ").format('YYYY-MM-DD')
	    		}, tasks);

	    		if(isSuccess){
					num.success += 1;
				}else{
					num.fail += 1;
				}

	        }

			logger.info("關港貿單一窗口更新成功筆數:", num.success, ", 查無資料筆數:", num.fail);

		    // async.waterfall(tasks, function (err, args) {

		    //     if (err) {
		    //         // 如果連線失敗就不做Rollback
		    //         if(Object.keys(args).length !== 0){
		    //             dbCommandByTask.TransactionRollback(args, function (err, result){

		    //             });
		    //         }

	     //    		logger.error(args);
		    //         console.error("關港貿單一窗口更新失敗訊息:", err);
		    //         // process.exit();
		    //     }else{
    		// 		console.log("關港貿單一窗口更新成功筆數:", num.success, ", 查無資料筆數:", num.fail);
		    //     }
		    // });
			
			// await sleep(2000);
		} catch(e) {
    		logger.error("關港貿單一窗口錯誤訊息:", e);
		} finally {
			// await driver && driver.quit();
			await driver.close();
		}

		// 每隔一段時間之後就撈一次
		setTimeout(async () => {
			await this.Do().then(_ => console.log('Cpt執行完畢，結束程式'), err => console.error('ERROR: ' + err));
		}, setting.CPT.timer);

	}

	SelectApaccsMaster() {

		let querymain = "cpt",
            queryname = "SelectApaccsMaster",
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

	        		logger.error("關港貿單一窗口更新失敗訊息("+pk+"):", args, " 錯誤訊息:", err);
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

module.exports.Cpt = Cpt;
