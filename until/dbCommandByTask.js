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
		if(err) callback(err, {});
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

	for(var key in task.params){
		Schema.push(key);
		Values.push(task.params[key]);
	}

	SQLCommand += "INSERT INTO " + tables[task.table] + " ("+Schema.join()+") VALUES (@"+Schema.join(",@")+")";

	requestSql(request, SQLCommand, function(err, ret) {
		args.result.push(ret);
		if(err) callback(err, {});
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
		Schema = [],
		Condition = [];

	schemaType.SchemaType2(task.params, request, sql);

	for(var key in task.params){
		Schema.push(key + "=@" + key);
	}
	for(var key in task.condition){
		Condition.push(" AND "+key + "=@" + key);
	}

	SQLCommand += "UPDATE " + tables[task.table] + " SET "+Schema.join()+" WHERE 1=1 "+Condition.join(" ");
	
	requestSql(request, SQLCommand, function(err, ret) {
		args.result.push(ret);
		if(err) callback(err, {});
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

	SQLCommand += "DELETE FROM " + tables[table] + " WHERE 1=1 "+Condition.join("");
	
	requestSql(request, SQLCommand, function(err, ret) {
		args.result.push(ret);
		if(err) callback(err, {});
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
        // console.log(returnValue);
        // Always emitted as the last one
        if (errors.length == 0) {
            callback(null, result[0].records);
        } else {
            callback(errors, {});
        }
    });
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