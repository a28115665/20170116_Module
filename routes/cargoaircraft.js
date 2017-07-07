var setting = require('../app.setting.json');
var http = require('http');
var moment = require('moment');
const querystring = require('querystring');

/**
 * GetCargoAircraftTime 背景不斷取得貨機起降時間
 */
var GetCargoAircraftTime = function (){

	var post_options = {
        host: 'ptx.transportdata.tw',
	    // $filter=startswith(ArrivalGate, '5') and (ArrivalAirportID eq 'TPE' or ArrivalAirportID eq 'TSA') and ArrivalTerminal eq '1'&$top=100&$format=JSON
	    // AirlineID B7 BR CA CI CX CZ HX IT KA MU NH NX VJ ZH
	    // $filter=(ArrivalAirportID eq 'TPE' or ArrivalAirportID eq 'TSA') and (AirlineID eq 'B7' or AirlineID eq 'BR' or AirlineID eq 'CA' or AirlineID eq 'CI' or AirlineID eq 'CX' or AirlineID eq 'CZ' or AirlineID eq 'HX' or AirlineID eq 'IT' or AirlineID eq 'KA' or AirlineID eq 'MU' or AirlineID eq 'NH' or AirlineID eq 'NX' or AirlineID eq 'VJ' or AirlineID eq 'ZH')&$top=100&$format=JSON
	    path: "/MOTC/v2/Air/FIDS/Flight?$filter=(ArrivalAirportID%20eq%20%27TPE%27%20or%20ArrivalAirportID%20eq%20%27TSA%27)%20and%20(AirlineID%20eq%20%27B7%27%20or%20AirlineID%20eq%20%27BR%27%20or%20AirlineID%20eq%20%27CA%27%20or%20AirlineID%20eq%20%27CI%27%20or%20AirlineID%20eq%20%27CX%27%20or%20AirlineID%20eq%20%27CZ%27%20or%20AirlineID%20eq%20%27HX%27%20or%20AirlineID%20eq%20%27IT%27%20or%20AirlineID%20eq%20%27KA%27%20or%20AirlineID%20eq%20%27MU%27%20or%20AirlineID%20eq%20%27NH%27%20or%20AirlineID%20eq%20%27NX%27%20or%20AirlineID%20eq%20%27VJ%27%20or%20AirlineID%20eq%20%27ZH%27)&$top=500&$format=JSON",
	    method: 'GET',
        headers: { 
        	'Content-Type': 'application/json' 
        }
    };

    var Do = function(){

		var post_req = http.request(post_options, function (post_res) {
			// console.log(post_res);
			
			if(post_res.statusCode == 200){
                var content = '';

				post_res.setEncoding('utf8');

	            post_res.on('data', function (chunk){
	                content += chunk;
	            });

	            post_res.on('end', function(){
	            	var upsertData = JSON.parse(content),
	            		_conditions = [];
	            	console.log("航班資訊總筆數:", upsertData.length);

	            	// 有資料再request
	            	if(upsertData.length > 0){

		            	for(var i in upsertData){
		            		// console.log("ScheduleArrivalTime=>",moment(upsertData[i].ScheduleArrivalTime).format('YYYY-MM-DD HH:mm:ss'));
		            		// console.log("ActualArrivalTime=>",moment(upsertData[i].ActualArrivalTime).format('YYYY-MM-DD HH:mm:ss'));
		            		// console.log("UpdateTime=>",moment(upsertData[i].UpdateTime).format('YYYY-MM-DD HH:mm:ss'));
		            		_conditions.push(JSON.stringify({
				                crudType : 'Upsert',
								table : 23,
				                params : {
				                	FA_AIR_ROTETYPE       : upsertData[i].AirRouteType,
				                	FA_DEPART_AIRTID      : upsertData[i].DepartureAirportID,
									FA_ARRIVAL_AIRPTID    : upsertData[i].ArrivalAirportID,
									FA_SCHEDL_ARRIVALTIME : moment(upsertData[i].ScheduleArrivalTime).format('YYYY-MM-DD HH:mm:ss'),
									FA_ACTL_ARRIVALTIME   : moment(upsertData[i].ActualArrivalTime).format('YYYY-MM-DD HH:mm:ss'),
									FA_ARRIVAL_REMK       : upsertData[i].ArrivalRemark,
									FA_ARRIVAL_TERNL      : upsertData[i].ArrivalTerminal,
									FA_ARRIVAL_GATE       : upsertData[i].ArrivalGate == "" ? null : upsertData[i].ArrivalGate,
									FA_UP_DATETIME        : moment(upsertData[i].UpdateTime).format('YYYY-MM-DD HH:mm:ss')
				                },
								condition : {
									FA_FLIGHTDATE : upsertData[i].FlightDate,
									FA_FLIGHTNUM  : upsertData[i].FlightNumber,
									FA_AIR_LINEID : upsertData[i].AirlineID
								}
		            		}));

							// 每100筆就request
							if(_conditions.length % 100 == 0){
	            				console.log("已更新航班資訊筆數:", _conditions.length);
				            	// 塞入DB
			        			var _post_upsertData100 = querystring.stringify(_conditions);

			        			var _post_upsertData_options100 = {
						            host: '127.0.0.1',
						            port: setting.NodeJs.port,
						            path: '/restful/crudByTask?' + _post_upsertData100,
						            method: 'GET',
						        };

						        var _post_req = http.request(_post_upsertData_options100, function (_post_res){
						        	var _content = '';

									_post_res.setEncoding('utf8');

						            _post_res.on('data', function (chunk){
						                _content += chunk;
						            });

						            _post_res.on('end', function(){
						            	// console.log(JSON.parse(content));
									})
						        });

						        _post_req.end();
						        
								_conditions = [];
							}
		            	}
        				console.log("已更新航班資訊筆數:", _conditions.length);

		            	// 剩餘筆數
	        			var _post_upsertData = querystring.stringify(_conditions);

	        			var _post_upsertData_options = {
				            host: '127.0.0.1',
				            port: setting.NodeJs.port,
				            path: '/restful/crudByTask?' + _post_upsertData,
				            method: 'GET',
				        };

				        var _post_req = http.request(_post_upsertData_options, function (_post_res){
				        	var _content = '';

							_post_res.setEncoding('utf8');

				            _post_res.on('data', function (chunk){
				                _content += chunk;
				            });

				            _post_res.on('end', function(){
				            	// console.log(JSON.parse(content));
							})
				        });

				        _post_req.end();
	            	}
	            })
	        }
		});

        post_req.on('error', function(err) {
            // Handle error
            console.log('抓取航班失敗，原因:', err);
        });


		post_req.end();

    	// 每隔一段時間之後就撈一次
		setTimeout(Do, setting.MOTC.timer);
    }

    // 先撈第一次
    Do();
}

module.exports.GetCargoAircraftTime = GetCargoAircraftTime;
