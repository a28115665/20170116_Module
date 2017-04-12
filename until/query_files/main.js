module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectAllBillboard":
			_SQLCommand += "SELECT BB_TITLE, BB_CONTENT, BB_POST_FROM, BB_STICK_TOP, U_Name AS 'BB_CR_Name' \
						   FROM BILLBOARD \
						   LEFT JOIN USER_INFO ON USER_INFO.U_ID = BILLBOARD.BB_CR_USER \
						   WHERE 1=1 \
						   ORDER BY BB_STICK_TOP DESC, BB_POST_FROM DESC"
			break;
	}

	return _SQLCommand;
};