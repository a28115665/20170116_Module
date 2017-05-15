var sql = require('mssql');
var setting = require('../app.setting.json');
var tables = require('./table.json');
var schemaType = require('./schemaType.js');

/**
 * [Connect description] SQL連線
 * @param {Function} callback [description]
 */
var Connect = function(callback) {
	var args = {};
  	sql.connect(setting.MSSQL, function(err) {
		if(err) callback(err, {});
		else callback(null, args);
	});
};

/**
 * [TransactionBegin description] Transaction Begin
 * @param {[type]}   args     [description]
 * @param {Function} callback [description]
 */
var TransactionBegin = function(args, callback){
	// console.log("TransactionBegin:");
	var transaction = new sql.Transaction();
	transaction.begin(function(err) {
		args["transaction"] = transaction;
		args["result"] = [];
		if(err) callback(err, {});
		else callback(null, args);
	});
}; 

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
 * [SelectRequestWithTransaction description] Transaction For Select
 * @param {[type]}   task     [description]
 * @param {[type]}   args     [description]
 * @param {Function} callback [description]
 */
var SelectRequestWithTransaction = function(task, args, callback) {
	// console.log("SelectRequestWithTransaction:");
	var request = new sql.Request(args.transaction),
		SQLCommand = "";

	schemaType.SchemaType2(task.params, request, sql);

	// 依querymain至各檔案下查詢method
	SQLCommand = queryMethods[task.querymain](task.queryname, task.params)

	requestSql(request, SQLCommand, function(err, ret) {
		args.result.push(ret);
		if(err) callback(err, args);
		else callback(null, args);
	});
};

/**
 * [InsertRequestWithTransaction description] Transaction For Insert
 * @param {[type]}   task     [description]
 * @param {[type]}   args     [description]
 * @param {Function} callback [description]
 */
var InsertRequestWithTransaction = function(task, args, callback) {
	// console.log("InsertRequestWithTransaction:");
	var request = new sql.Request(args.transaction),
		SQLCommand = "",
		Schema = [],
		Values = [];

	schemaType.SchemaType2(task.params, request, sql);

	switch(task.insertname){
		case "Insert":
			for(var key in task.params){
				Schema.push(key);
				Values.push(task.params[key]);
			}

			SQLCommand += "INSERT INTO " + tables[task.table] + " ("+Schema.join()+") VALUES (@"+Schema.join(",@")+")";
			
			break;
		// Insert時密碼需要加金鑰
		// 參考 https://dotblogs.com.tw/dc690216/2009/09/10/10558
		case "InsertByEncrypt":
			for(var key in task.params){
				Schema.push(key);
				Values.push(task.params[key]);
			}
			SQLCommand += "EXEC OpenKeys;";

			SQLCommand += "INSERT INTO " + tables[task.table] + " ("+Schema.join()+") VALUES (@"+Schema.join(",@")+")";
			
			if(SQLCommand.match(/@U_PW/gi)){
				SQLCommand = SQLCommand.replace(/@U_PW/gi, 'dbo.Encrypt(@U_PW)');
			}
			if(SQLCommand.match(/@CI_PW/gi)){
				SQLCommand = SQLCommand.replace(/@CI_PW/gi, 'dbo.Encrypt(@CI_PW)');
			}
			
			break;
		default:
			for(var key in task.params){
				Schema.push(key);
				Values.push(task.params[key]);
			}

			SQLCommand += "INSERT INTO " + tables[task.table] + " ("+Schema.join()+") VALUES (@"+Schema.join(",@")+")";
			
			break;
	}	 

	requestSql(request, SQLCommand, function(err, ret) {
		args.result.push(ret);
		if(err) callback(err, args);
		else callback(null, args);
	});
};

/**
 * [UpdateRequestWithTransaction description] Transaction For Update
 * @param {[type]}   task     [description]
 * @param {[type]}   args     [description]
 * @param {Function} callback [description]
 */
var UpdateRequestWithTransaction = function(task, args, callback) {
	// console.log("UpdateRequestWithTransaction:");
	var request = new sql.Request(args.transaction),
		SQLCommand = "",
		psParams = extend({}, task.params, task.condition)
		Schema = [],
		Condition = [];

	schemaType.SchemaType2(psParams, request, sql);

	switch(task.updatename){
		case "Update":
			for(var key in task.params){
				Schema.push(key + "=@" + key);
			}
			for(var key in task.condition){
				if(task.condition[key] == null){
					Condition.push(" AND "+key + " is null");
				}else{
					Condition.push(" AND "+key + "=@" + key);
				}
			}

			SQLCommand += "UPDATE " + tables[task.table] + " SET "+Schema.join()+" WHERE 1=1 "+Condition.join(" ");
			
			break;
		// Update時密碼需要加金鑰
		case "UpdateByEncrypt":
			for(var key in task.params){
				switch(key){
					case 'U_PW':
						Schema.push(key + "=dbo.Encrypt(@" + key + ")");
						break;
					case 'CI_PW':
						Schema.push(key + "=dbo.Encrypt(@" + key + ")");
						break;
					default:
						Schema.push(key + "=@" + key);
						break;
				}
			}
			for(var key in task.condition){
				if(task.condition[key] == null){
					Condition.push(" AND "+key + " is null");
				}else{
					Condition.push(" AND "+key + "=@" + key);
				}
			}
			SQLCommand += "EXEC OpenKeys;";

			SQLCommand += "UPDATE " + tables[task.table] + " SET "+Schema.join()+" WHERE 1=1 "+Condition.join(" ");
			
			break;
		default:
			for(var key in task.params){
				Schema.push(key + "=@" + key);
			}
			for(var key in task.condition){
				if(task.condition[key] == null){
					Condition.push(" AND "+key + " is null");
				}else{
					Condition.push(" AND "+key + "=@" + key);
				}
			}

			SQLCommand += "UPDATE " + tables[task.table] + " SET "+Schema.join()+" WHERE 1=1 "+Condition.join(" ");
			
			break;
	}	
	
	requestSql(request, SQLCommand, function(err, ret) {
		args.result.push(ret);
		if(err) callback(err, args);
		else callback(null, args);
	});
};

/**
 * [DeleteRequestWithTransaction description] Transaction For Delete
 * @param {[type]}   task     [description]
 * @param {[type]}   args     [description]
 * @param {Function} callback [description]
 */
var DeleteRequestWithTransaction = function(task, args, callback) {
	// console.log("DeleteRequestWithTransaction:");
	var request = new sql.Request(args.transaction),
		SQLCommand = "",
		Condition = [];

	schemaType.SchemaType2(task.params, request, sql);

	for(var key in task.params){
		Condition.push(" AND "+key + "=@" + key);
	}

	SQLCommand += "DELETE FROM " + tables[task.table] + " WHERE 1=1 "+Condition.join("");
	
	requestSql(request, SQLCommand, function(err, ret) {
		args.result.push(ret);
		if(err) callback(err, args);
		else callback(null, args);
	});
};

/**
 * [TransactionCommit description] Transaction Commit
 * @param {[type]}   args     [description]
 * @param {Function} callback [description]
 */
var TransactionCommit = function(args, callback){
	// console.log("TransactionCommit:");
	args.transaction.commit(function(err, ret) {
		if(err) callback(err, {});
		else callback(null, args);
	});
};

/**
 * [TransactionRollback description] Transaction Rollback
 * @param {[type]}   args     [description]
 * @param {Function} callback [description]
 */
var TransactionRollback = function(args, callback){
	// console.log("TransactionRollback:");
	args.transaction.rollback(function(err, ret) {
		if(err) callback(err, {});
		else callback(null, args);
	});
}; 

/**
 * [DisConnect description] SQL中斷連線
 * @param {[type]}   args     [description]
 * @param {Function} callback [description]
 */
var DisConnect = function(args, callback) {
	// console.log("DisConnect:");
	callback(null, args);
	sql.close();
};

function requestSql(request, sql, callback) {
    var errors = [];
    var result = [];
    var records = [];
    console.log(sql);
    request.query(sql);
    request.stream = true;
    request.on('recordset', function(columns) {
        // Emitted once for each recordset in a query
        //console.log(columns);
        var rec = {
            columns: columns,
            records: []
        };
        result.push(rec);
    });

    request.on('row', function(row) {
        // Emitted for each row in a recordset
        result[result.length - 1].records.push(row);
    });

    request.on('error', function(err) {
        // May be emitted multiple times
        errors.push(err);
    });

    request.on('done', function(returnValue) {
        // console.log(errors.length, result.length);
        // Always emitted as the last one
        if (errors.length == 0) {
        	// 如果returnValue為0 表示delete
        	if(result.length == 0){
            	callback(null, result);
        	}else{
            	callback(null, result[0].records);
        	}
        } else {
            callback(errors, {});
        }
    });
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

module.exports = {
    Connect : Connect,
    TransactionBegin : TransactionBegin,
    SelectRequestWithTransaction : SelectRequestWithTransaction,
    InsertRequestWithTransaction : InsertRequestWithTransaction,
    UpdateRequestWithTransaction : UpdateRequestWithTransaction,
	DeleteRequestWithTransaction : DeleteRequestWithTransaction,
	TransactionCommit : TransactionCommit,
	TransactionRollback : TransactionRollback,
	DisConnect : DisConnect
};
