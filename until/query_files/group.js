module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectAllUserInfoNotWithAdmin":
			_SQLCommand += "SELECT U_ID, \
								   U_NAME, \
								   U_JOB, \
								   U_DEPART \
						   FROM USER_INFO \
						   WHERE U_ID != 'Administrator' AND U_CHECK = 1 AND U_STS = 0 \
						   ORDER BY U_CR_DATETIME Desc";
			break;
		case "SelectUserGroup":
			_SQLCommand += "SELECT UG_ID AS 'U_ID' \
						   FROM USER_GROUP \
						   WHERE 1=1 ";
			if(pParams["UG_GROUP"] !== undefined){
				_SQLCommand += " AND UG_GROUP = @UG_GROUP ";
			}
			break;
	}

	return _SQLCommand;
};