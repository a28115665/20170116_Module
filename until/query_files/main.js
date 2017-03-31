module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectAllBillboard":
			_SQLCommand += "SELECT BB_Title, BB_Content, BB_PostTime, BB_IsTop, U_Name AS 'BB_CR_Name' \
						   FROM Billboard \
						   LEFT JOIN UserInfo ON UserInfo.U_ID = Billboard.BB_CR_User \
						   WHERE 1=1 \
						   ORDER BY BB_IsTop DESC, BB_PostTime DESC"
			break;
	}

	return _SQLCommand;
};