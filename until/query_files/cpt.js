module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectApaccsMaster":
			_SQLCommand += "SELECT AML_FLIGHTNO, \
								AML_IMPORTDT  \
							FROM APACCS_MASTER_LIST \
							WHERE AML_ACTL_ARRIVALTIME IS NULL \
							AND AML_FLIGHTNO IS NOT NULL \
							AND AML_IMPORTDT IS NOT NULL \
							GROUP BY AML_FLIGHTNO, AML_IMPORTDT";
		break;
	}

	return _SQLCommand;
};