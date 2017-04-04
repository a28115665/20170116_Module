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
			if(pParams["SC_TYPE"] !== undefined){
				_SQLCommand += " AND SC_TYPE = @SC_TYPE";
			}
			if(pParams["SC_CODE"] !== undefined){
				_SQLCommand += " AND SC_CODE = @SC_CODE";
			}
			if(pParams["SC_PARENT_CODE"] !== undefined){
				_SQLCommand += " AND SC_PARENT_CODE = @SC_PARENT_CODE";
			}
			if(pParams["SC_DESC"] !== undefined){
				_SQLCommand += " AND SC_DESC = @SC_DESC";
			}
			if(pParams["SC_STS"] !== undefined){
				_SQLCommand += " AND SC_STS = @SC_STS";
			}
			break;
	}

	return _SQLCommand;
};