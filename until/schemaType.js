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
			type = GiveSchemaType(type, sql, DatabaseSchema[key], key);
			
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
			type = GiveSchemaType(type, sql, DatabaseSchema[key], key);

			request.input(key, type, params[key]);
		}
	}
};

function GiveSchemaType(pType, pSql, pSchema, key){
	var _length = pSchema["CHARACTER_MAXIMUM_LENGTH"] == -1 ? pSql.MAX : pSchema["CHARACTER_MAXIMUM_LENGTH"];
	// 特殊處理加密欄位
	if(key == 'U_PW' || key == 'CI_PW'){
		pType = sql.NVarChar(15);
	}else{
		switch(pSchema["DATA_TYPE"]){
			case "int":
				pType = pSql.Int;
				break;
			case "bit":
				pType = pSql.Bit;
				break;
			case "smallint":
				pType = pSql.SmallInt;
				break;
			case "varchar":
				pType = pSql.VarChar(_length);
				break;
			case "nvarchar":
				pType = pSql.NVarChar(_length);
				break;
			case "varbinary":
				pType = pSql.VarBinary(_length);
				break;
			case "datetime":
				pType = pSql.VarChar(30);
				break;
			case "date":
				pType = pSql.VarChar(30);
				break;
		}
	}

	return pType;
};

module.exports.SchemaType = SchemaType;
module.exports.SchemaType2 = SchemaType2;