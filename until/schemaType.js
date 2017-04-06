var sql = require('mssql');
var setting = require('../app.setting.json');

var DatabaseSchema = {};

// 初始化 DatabaseSchema
sql.connect(setting.MSSQL).then(function() {
	new sql.Request().query('SELECT * FROM Information_Schema.COLUMNS', (err, result) => {
        // ... error checks
        if(err) return;

        for(var i in result){
        	DatabaseSchema[result[i]["COLUMN_NAME"]] = {
        		DATA_TYPE : result[i]["DATA_TYPE"], 
        		CHARACTER_MAXIMUM_LENGTH : result[i]["CHARACTER_MAXIMUM_LENGTH"]
        	};
        }
    });

});

/**
 * [SchemaType description] SQL Schema類型
 * @param {[type]} params [description]
 * @param {[type]} ps     [description]
 * @param {[type]} sql    [description]
 */
var SchemaType = function (params, ps, sql){
	for(var key in params){
		if(params[key] !== undefined){
        	// console.log(key);
			var type = null;
			// 判斷Schema是哪種類型
			switch(DatabaseSchema[key]["DATA_TYPE"]){
				case "int":
					type = sql.Int;
					break;
				case "bit":
					type = sql.Bit;
					break;
				case "varchar":
					type = sql.VarChar(DatabaseSchema[key]["CHARACTER_MAXIMUM_LENGTH"]);
					break;
				case "nvarchar":
					type = sql.NVarChar(DatabaseSchema[key]["CHARACTER_MAXIMUM_LENGTH"]);
					break;
				case "datetime":
					type = sql.VarChar(30);
					break;
			}
			ps.input(key, type);
		}
	}
};

/**
 * [SchemaType2 description] SQL Schema類型
 * @param {[type]} params [description]
 * @param {[type]} request     [description]
 * @param {[type]} sql    [description]
 */
var SchemaType2 = function (params, request, sql){
	for(var key in params){
		if(params[key] !== undefined){
        	// console.log(key);
			var type = null;
			// 判斷Schema是哪種類型
			switch(DatabaseSchema[key]["DATA_TYPE"]){
				case "int":
					type = sql.Int;
					break;
				case "bit":
					type = sql.Bit;
					break;
				case "varchar":
					type = sql.VarChar(DatabaseSchema[key]["CHARACTER_MAXIMUM_LENGTH"]);
					break;
				case "nvarchar":
					type = sql.NVarChar(DatabaseSchema[key]["CHARACTER_MAXIMUM_LENGTH"]);
					break;
				case "datetime":
					type = sql.VarChar(30);
					break;
			}
			request.input(key, type, params[key]);
		}
	}
};

module.exports.SchemaType = SchemaType;
module.exports.SchemaType2 = SchemaType2;