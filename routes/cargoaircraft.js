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
	    // $filter=startswith(ArrivalGate, '5') and ArrivalAirportID eq 'TPE' and ArrivalTerminal eq '1'&$top=100&$format=JSON
	    path: "/MOTC/v2/Air/FIDS/Flight?%24filter=startswith(ArrivalGate%2C%20'5')%20and%20ArrivalAirportID%20eq%20'TPE'%20and%20ArrivalTerminal%20eq%20'1'&%24top=100&%24format=JSON",
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
	            		_conditions = [];;
	            	// console.log(upsertData);

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
									FA_ARRIVAL_GATE       : upsertData[i].ArrivalGate,
									FA_UP_DATETIME        : moment(upsertData[i].UpdateTime).format('YYYY-MM-DD HH:mm:ss')
				                },
								condition : {
									FA_FLIGHTDATE : upsertData[i].FlightDate,
									FA_FLIGHTNUM  : upsertData[i].FlightNumber,
									FA_AIR_LINEID : upsertData[i].AirlineID
								}
		            		}));
		            	}

		            	// 塞入DB
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
            res.status(500).send('抓取航班失敗');
        });


		post_req.end();

    	// 每隔一段時間之後就撈一次
		setTimeout(Do, setting.MOTC.timer);
    }

    // 先撈第一次
    Do();
}

module.exports.GetCargoAircraftTime = GetCargoAircraftTime;
