/**
 * [SchemaType description] SQL Schema類型
 * @param {[type]} params [description]
 * @param {[type]} ps     [description]
 * @param {[type]} sql    [description]
 */
var SchemaType = function (params, ps, sql){
	for(var key in params){
		if(params[key] !== undefined){
			switch(key){
				/*
					UserInfo
				 */
				case "U_ID":
					ps.input('U_ID', sql.VarChar(15));
					break;
				case "U_Name":
					ps.input('U_Name', sql.NVarChar(15));
					break;
				case "U_PW":
					ps.input('U_PW', sql.VarChar(15));
					break;
				case "U_Email":
					ps.input('U_Email', sql.NVarChar(50));
					break;
				case "U_Role":
					ps.input('U_Role', sql.VarChar(10));
					break;
				case "U_Depart":
					ps.input('U_Depart', sql.VarChar(10));
					break;
				case "U_Check":
					ps.input('U_Check', sql.Bit);
					break;
				case "U_CK_DateTime":
					ps.input('U_CK_DateTime', sql.VarChar(30));
					break;
				case "U_CR_User":
					ps.input('U_CR_User', sql.NVarChar(15));
					break;
				case "U_CR_DateTime":
					ps.input('U_CR_DateTime', sql.VarChar(30));
					break;
				case "U_UP_User":
					ps.input('U_UP_User', sql.NVarChar(15));
					break;
				case "U_UP_DateTime":
					ps.input('U_UP_DateTime', sql.VarChar(30));
					break;
				/*
					SYS_CODE
				 */
				case "SC_Type":
					ps.input('SC_Type', sql.VarChar(50));
					break;
				case "SC_Code":
					ps.input('SC_Code', sql.VarChar(10));
					break;
				case "SC_ParentCode":
					ps.input('SC_ParentCode', sql.VarChar(10));
					break;
				case "SC_Desc":
					ps.input('SC_Desc', sql.NVarChar(300));
					break;

			}
		}
	}
};

module.exports.SchemaType = SchemaType;