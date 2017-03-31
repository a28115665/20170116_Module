module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectAllUserInfo":
			_SQLCommand += "SELECT * \
						   FROM UserInfo \
						   WHERE 1=1"
			if(pParams["U_ID"] !== undefined){
				_SQLCommand += " AND U_ID = @U_ID";
			}
			if(pParams["U_Name"] !== undefined){
				_SQLCommand += " AND U_Name = @U_Name";
			}
			if(pParams["U_PW"] !== undefined){
				_SQLCommand += " AND U_PW = @U_PW";
			}
			break;
		case "SelectAllUserInfoNotWithAdmin":
			_SQLCommand += "SELECT * \
						   FROM UserInfo \
						   WHERE U_ID != 'Administrator' \
						   ORDER BY U_CR_DateTime Desc";
			break;
		case "SelectAllSysCode":
			_SQLCommand += "SELECT * \
						   FROM SYS_CODE \
						   WHERE 1=1";
			if(pParams["SC_Type"] !== undefined){
				_SQLCommand += " AND SC_Type = @SC_Type";
			}
			if(pParams["SC_Code"] !== undefined){
				_SQLCommand += " AND SC_Code = @SC_Code";
			}
			if(pParams["SC_ParentCode"] !== undefined){
				_SQLCommand += " AND SC_ParentCode = @SC_ParentCode";
			}
			if(pParams["SC_Desc"] !== undefined){
				_SQLCommand += " AND SC_Desc = @SC_Desc";
			}
			break;
	}

	return _SQLCommand;
};