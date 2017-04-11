module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectAllUserInfo":
			_SQLCommand += "SELECT * \
						   FROM USER_INFO \
						   WHERE 1=1"
			if(pParams["U_ID"] !== undefined){
				_SQLCommand += " AND U_ID = @U_ID";
			}
			if(pParams["U_NAME"] !== undefined){
				_SQLCommand += " AND U_NAME = @U_NAME";
			}
			if(pParams["U_PW"] !== undefined){
				_SQLCommand += " AND U_PW = @U_PW";
			}
			break;
		case "SelectAllUserInfoNotWithAdmin":
			_SQLCommand += "SELECT * \
						   FROM USER_INFO \
						   WHERE U_ID != 'Administrator' \
						   ORDER BY U_CR_DATETIME Desc";
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
		case "SelectAllGroup":
			_SQLCommand += "SELECT SG_GCODE, \
								   SG_TITLE, \
								   SG_DESC,  \
								   SG_STS    \
						   FROM SYS_GROUP \
						   WHERE 1=1";
			if(pParams["SC_TYPE"] !== undefined){
				_SQLCommand += " AND SC_TYPE = @SC_TYPE";
			}
			_SQLCommand += " ORDER BY SG_CR_DATETIME DESC ";
			break;
	}

	return _SQLCommand;
};