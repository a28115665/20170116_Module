module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectAllBillboard":
			_SQLCommand += "SELECT BB_TITLE, BB_CONTENT, BB_EXPECTED_POST, BB_STICK_TOP, U_Name AS 'BB_CR_Name' \
						   FROM BILLBOARD \
						   LEFT JOIN UserInfo ON UserInfo.U_ID = BILLBOARD.BB_CR_USER \
						   WHERE 1=1 \
						   ORDER BY BB_STICK_TOP DESC, BB_EXPECTED_POST DESC"
			break;
	}

	return _SQLCommand;
};