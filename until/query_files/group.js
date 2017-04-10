module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectAllUserInfoNotWithAdmin":
			_SQLCommand += "SELECT U_ID, \
								   U_NAME, \
								   U_JOB, \
								   U_DEPART \
						   FROM USER_INFO \
						   WHERE U_ID != 'Administrator' AND U_CHECK = False AND U_STS = True \
						   ORDER BY U_CR_DATETIME Desc";
			break;
		case "SelectSysGroup":
			_SQLCommand += "SELECT * \
						   FROM SYS_GROUP \
						   WHERE 1=1 ";
			if(pParams["UG_GROUP"] !== undefined){
				_SQLCommand += " AND UG_GROUP = @UG_GROUP ";
			}
			break;
	}

	return _SQLCommand;
};