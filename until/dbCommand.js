var sql = require('mssql');
var setting = require('../app.setting.json');
var tables = require('./table.json');
var schemaType = require('./schemaType.js');

/**
 * [將query_files底下所有的statement集中到queryMethods裡]
 * @param {[type]} queryMethods [依照檔名對應Methods]
 */
var queryMethods = {},
	queryFilesPath = require("path").join(__dirname, "query_files");
require("fs").readdirSync(queryFilesPath).forEach(function(file) {
	var _target = file.split(".")[0],
		_method = require("./query_files/" + file);

	queryMethods[_target] = _method;
});

/**
 * [SelectMethod 單筆資料Select]
 * @param {[type]}   querymain [查詢序目標檔名]
 * @param {[type]}   queryname [查詢序名稱]
 * @param {[type]}   params    [查詢參數]
 * @param {Function} callback  [回拋]
 */
var SelectMethod = function (querymain, queryname, params, callback){

	try {
		var connection = sql.connect(setting.MSSQL).then(function(cp) {
			var ps = new sql.PreparedStatement(cp),
				_params = typeof params == "string" ? JSON.parse(params) : {},
				SQLCommand = "";

			// 依querymain至各檔案下查詢method
			SQLCommand = queryMethods[querymain](queryname, _params)
			
			// schema所需的orm
			schemaType.SchemaType(_params, ps, sql);
			
			// 執行SQL，並且回傳值
		    ps.prepare(SQLCommand, function(err) {
			    // ... error checks
			    if(err) return callback(err, null);
			    
			    /*
			    	recordset -> 回傳值
					affected -> Returns number of affected rows in case of INSERT, UPDATE or DELETE statement.
			     */
				ps.execute(_params, function(err, recordset, affected) {
					// ... error checks
					if(err) return callback(err, null);

					callback(null, recordset);

					ps.unprepare(function(err) {
					    // ... error checks
					    if(err) return callback(err, null);
					});
				});
			});

		}).catch(function(err) {
		    // ... error checks
	        return callback(err, null);
		});
	}
	catch(err) {
		return callback(err, null);
	}

	// var request = new sql.Request(),
	// 	_params = JSON.parse(params);

	// sql.connect(setting.MSSQL).then(function() {
	// 	// console.log(queryname);
	// 	// console.log(_params["U_ID"], _params["U_Name"]);
	// 	var SQLCommand = "";
	//     switch(queryname){
	// 		case "SelectAllUserInfo":
	// 			SQLCommand += "SELECT * \
	// 						   FROM UserInfo \
	// 						   WHERE 1=1"
	// 			if(_params["U_ID"] !== undefined){
	// 				request.input('U_ID', sql.VarChar(15), _params["U_ID"]);
	// 				SQLCommand += " AND U_ID = @U_ID";
	// 			}
	// 			if(_params["U_Name"] !== undefined){
	// 				request.input('U_Name', sql.NVarChar(15), _params["U_Name"]);
	// 				SQLCommand += " AND U_Name = @U_Name";
	// 			}
	// 			break;
	// 		default:
	// 			callback(null, {});
	// 			break;
	// 	}	    
};

/**
 * [InsertMethod 單筆資料Insert]
 * @param {[type]}   insertname [新增序名稱]
 * @param {[type]}   table      [資料表名稱]
 * @param {[type]}   params     [新增參數]
 * @param {Function} callback   [回拋]
 */
var InsertMethod = function (insertname, table, params, callback){
	
	try {
		var connection = sql.connect(setting.MSSQL).then(function(cp) {
			var ps = new sql.PreparedStatement(cp),
				_params = typeof params == "string" ? JSON.parse(params) : params,
				SQLCommand = "",
				Schema = [],
				Values = [];

		    switch(insertname){
				case "Insert":
					for(var key in _params){
						Schema.push(key);
						Values.push(_params[key]);
					}

					SQLCommand += "INSERT INTO " + tables[table] + " ("+Schema.join()+") VALUES (@"+Schema.join(",@")+")";
					
					break;
				case "InsertByDecryption":
					for(var key in _params){
						Schema.push(key);
						Values.push(_params[key]);
					}
					SQLCommand += "EXEC OpenKeys;";

					SQLCommand += "INSERT INTO " + tables[table] + " ("+Schema.join()+") VALUES (@"+Schema.join(",@")+")";
					
					SQLCommand = SQLCommand.replace(/@U_PW/gi, 'dbo.Encrypt(@U_PW)');
					
					break;
				default:
					return callback(null, {});
					break;
			}	    
			schemaType.SchemaType(_params, ps, sql);

			// 執行SQL，並且回傳值
		    ps.prepare(SQLCommand, function(err) {
			    // ... error checks
			    if(err) return callback(err, null);
			    
			    /*
			    	recordset -> 回傳值
					affected -> Returns number of affected rows in case of INSERT, UPDATE or DELETE statement.
			     */
				ps.execute(_params, function(err, recordset, affected) {
					// console.log(err, recordset, affected);
					// ... error checks
					if(err) return callback(err, null);

					callback(null, affected);

					ps.unprepare(function(err) {
					    // ... error checks
					    if(err) return callback(err, null);
					});
				});
			});


		}).catch(function(err) {
		    // ... error checks
	        return callback(err, null);
		});
	}
	catch(err) {
		return callback(err, null);
	}
}

/**
 * [UpdateMethod 單筆資料Update] 
 * @param {[type]}   updatetname [更新序名稱]
 * @param {[type]}   table       [資料表名稱]
 * @param {[type]}   params      [更新參數]
 * @param {[type]}   condition   [更新條件]
 * @param {Function} callback    [回拋]
 */
var UpdateMethod = function (updatetname, table, params, condition, callback){
	
	try {
		var connection = sql.connect(setting.MSSQL).then(function() {
			var ps = new sql.PreparedStatement(connection),
				_params = typeof params == "string" ? JSON.parse(params) : params,
				_condition = JSON.parse(condition),
				_psParams = extend({}, _params, _condition),
				SQLCommand = "",
				Schema = [],
				Condition = [];

		    switch(updatetname){
				case "Update":
					for(var key in _params){
						Schema.push(key + "=@" + key);
					}
					for(var key in _condition){
						Condition.push(" AND "+key + "=@" + key);
					}

					SQLCommand += "UPDATE " + tables[table] + " SET "+Schema.join()+" WHERE 1=1 "+Condition.join(" ");
					
					break;
				default:
					callback(null, {});
					break;
			}	    
			schemaType.SchemaType(_psParams, ps, sql);

			// 執行SQL，並且回傳值
		    ps.prepare(SQLCommand, function(err) {
			    // ... error checks
			    if(err) return callback(err, null);
			    
			    /*
			    	recordset -> 回傳值
					affected -> Returns number of affected rows in case of INSERT, UPDATE or DELETE statement.
			     */
				ps.execute(_psParams, function(err, recordset, affected) {
					// console.log(err, recordset, affected);
					// ... error checks
					if(err) return callback(err, null);

					callback(null, affected);

					ps.unprepare(function(err) {
					    // ... error checks
					    if(err) return callback(err, null);
					});
				});
			});


		}).catch(function(err) {
		    // ... error checks
	        return callback(err, null);
		});
	}
	catch(err) {
		return callback(err, null);
	}
}

/**
 * [DeleteMethod 單筆資料Delete]
 * @param {[type]}   deletename [刪除序名稱]
 * @param {[type]}   table      [資料表名稱]
 * @param {[type]}   params     [刪除參數]
 * @param {Function} callback   [回拋]
 */
var DeleteMethod = function (deletename, table, params, callback){
	
	try {
		var connection = sql.connect(setting.MSSQL).then(function() {
			var ps = new sql.PreparedStatement(connection),
				_params = typeof params == "string" ? JSON.parse(params) : params,
				SQLCommand = "",
				Condition = [];

		    switch(deletename){
				case "Delete":
					for(var key in _params){
						Condition.push(" AND "+key + "=@" + key);
					}

					SQLCommand += "DELETE FROM " + tables[table] + " WHERE 1=1 "+Condition.join("");
					
					break;
				default:
					callback(null, {});
					break;
			}	    
			schemaType.SchemaType(_params, ps, sql);

			// 執行SQL，並且回傳值
		    ps.prepare(SQLCommand, function(err) {
			    // ... error checks
			    if(err) return callback(err, null);
			    
			    /*
			    	recordset -> 回傳值
					affected -> Returns number of affected rows in case of INSERT, UPDATE or DELETE statement.
			     */
				ps.execute(_params, function(err, recordset, affected) {
					// console.log(err, recordset, affected);
					// ... error checks
					if(err) return callback(err, null);

					callback(null, affected);

					ps.unprepare(function(err) {
					    // ... error checks
					    if(err) return callback(err, null);
					});
				});
			});


		}).catch(function(err) {
		    // ... error checks
	        return callback(err, null);
		});
	}
	catch(err) {
		return callback(err, null);
	}
}

/**
 * [extend 合併Object]
 * @param  {[type]} target [需要被合併的Objects]
 * @return {[type]}        [回傳合併後的Object]
 */
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

module.exports.SelectMethod = SelectMethod;
module.exports.InsertMethod = InsertMethod;
module.exports.UpdateMethod = UpdateMethod;
module.exports.DeleteMethod = DeleteMethod;